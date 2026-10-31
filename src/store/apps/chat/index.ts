// ** Redux Imports
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// ** API Connector & Services
import apiConnector from 'src/services/api.service'
import authService from 'src/services/auth.service'

// ** Types
import {
  ChatStoreType,
  SendMsgParamsType,
  ChatsArrType,
  ContactType,
  ProfileUserType,
  ChatType,
  SelectedChatType
} from 'src/types/apps/chatTypes'

const GENERAL_ASSISTANT_CONTACT: ContactType = {
  id: 0,
  fullName: 'Asistente IA (General)',
  role: 'Todos los documentos',
  about: 'Consulta global sobre facturas, notas de pedido, remitos y proveedores de la empresa',
  avatar: '',
  avatarColor: 'primary',
  status: 'online'
}

const buildInitialAssistantMessage = (isGeneral: boolean, docName?: string): ChatType => ({
  senderId: 0,
  message: isGeneral
    ? '¡Hola! Soy tu asistente de inteligencia artificial para gestión documental. Pregúntame lo que necesites sobre los documentos de tu empresa, importes, proveedores o fechas de vencimiento.'
    : `Estás consultando específicamente sobre el documento "${docName || 'seleccionado'}". ¿Qué dato o resumen necesitas de este archivo?`,
  time: new Date().toISOString(),
  feedback: {
    isSent: true,
    isDelivered: true,
    isSeen: true
  }
})

// ** Fetch User Profile
export const fetchUserProfile = createAsyncThunk('appChat/fetchUserProfile', async () => {
  try {
    const me = await authService.me()
    const profile: ProfileUserType = {
      id: me.id || 1,
      fullName: me.name || me.email || 'Usuario',
      role: typeof me.role === 'string' ? me.role : me.role?.name || 'Usuario',
      about: me.email || '',
      avatar: me.avatar || '',
      status: 'online',
      settings: {
        isNotificationsOn: true,
        isTwoStepAuthVerificationEnabled: false
      }
    }

    return profile
  } catch (e) {
    const localUser = typeof window !== 'undefined' ? localStorage.getItem('userData') : null
    const parsed = localUser ? JSON.parse(localUser) : null

    return {
      id: parsed?.id || 1,
      fullName: parsed?.name || parsed?.email || 'Usuario',
      role: parsed?.role?.name || parsed?.role || 'Usuario',
      about: parsed?.email || '',
      avatar: parsed?.avatar || '',
      status: 'online',
      settings: {
        isNotificationsOn: true,
        isTwoStepAuthVerificationEnabled: false
      }
    } as ProfileUserType
  }
})

// ** Fetch Chats & Contacts
export const fetchChatsContacts = createAsyncThunk('appChat/fetchChatsContacts', async () => {
  const documents: any[] = await apiConnector.get('/documents/chat/context-documents')

  const documentContacts: ContactType[] = documents.map(doc => {
    const issuer = doc.extractedData?.issuer
    const docType = doc.documentType || 'DOCUMENTO'
    const total = doc.extractedData?.totalAmount

    return {
      id: doc.id,
      fullName: issuer ? `${issuer} (#${doc.id})` : doc.originalName,
      role: `${docType} - ${doc.originalName}`,
      about: total ? `Total: $${total} | ${doc.originalName}` : doc.originalName,
      avatar: '',
      avatarColor: 'info',
      status: 'online',
      documentMetadata: doc
    }
  })

  const contacts = [GENERAL_ASSISTANT_CONTACT, ...documentContacts]

  const initialChats: ChatsArrType[] = contacts.map(c => {
    const initMsg = buildInitialAssistantMessage(c.id === 0, c.fullName)

    return {
      ...c,
      chat: {
        id: c.id,
        userId: c.id,
        unseenMsgs: 0,
        chat: [initMsg],
        lastMessage: initMsg
      }
    }
  })

  return {
    contacts,
    chatsContacts: initialChats
  }
})

// ** Select Chat
export const selectChat = createAsyncThunk(
  'appChat/selectChat',
  async (id: number | string, { getState }) => {
    const numericId = Number(id)
    const state = (getState() as any).chat as ChatStoreType
    const contact =
      state.contacts?.find(c => c.id === numericId) ||
      (numericId === 0 ? GENERAL_ASSISTANT_CONTACT : null)

    const existingChat = state.chats?.find(c => c.id === numericId)
    if (existingChat && contact) {
      return {
        chat: existingChat.chat,
        contact: existingChat
      }
    }

    const initMsg = buildInitialAssistantMessage(numericId === 0, contact?.fullName)
    const newChatObj = {
      id: numericId,
      userId: numericId,
      unseenMsgs: 0,
      chat: [initMsg],
      lastMessage: initMsg
    }

    const contactArrItem: ChatsArrType = {
      ...(contact || GENERAL_ASSISTANT_CONTACT),
      chat: newChatObj
    }

    return {
      chat: newChatObj,
      contact: contactArrItem
    }
  }
)

// ** Send Msg
export const sendMsg = createAsyncThunk(
  'appChat/sendMsg',
  async (obj: SendMsgParamsType, { rejectWithValue }) => {
    try {
      const contactId = obj.contact?.id ?? 0
      const documentId = contactId > 0 ? contactId : undefined

      const history = (obj.chat?.chat || [])
        .slice(-10)
        .map(m => ({
          role: m.senderId === 0 ? ('model' as const) : ('user' as const),
          text: m.message
        }))

      const response: any = await apiConnector.post('/documents/chat', {
        message: obj.message,
        documentId,
        conversationHistory: history
      })

      return {
        contactId,
        reply: response.reply,
        referencedDocuments: response.referencedDocuments || [],
        usage: response.usage
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Error al comunicarse con el asistente de documentos.'

      return rejectWithValue(errorMsg)
    }
  }
)

const initialState: ChatStoreType = {
  chats: null,
  contacts: null,
  userProfile: null,
  selectedChat: null,
  isLoadingAi: false,
  error: null
}

export const appChatSlice = createSlice({
  name: 'appChat',
  initialState,
  reducers: {
    removeSelectedChat: state => {
      state.selectedChat = null
    },
    clearCurrentChat: state => {
      if (state.selectedChat) {
        const isGeneral = state.selectedChat.contact.id === 0
        const initMsg = buildInitialAssistantMessage(isGeneral, state.selectedChat.contact.fullName)
        state.selectedChat.chat.chat = [initMsg]
        state.selectedChat.chat.lastMessage = initMsg

        const match = state.chats?.find(c => c.id === state.selectedChat?.contact.id)
        if (match) {
          match.chat.chat = [initMsg]
          match.chat.lastMessage = initMsg
        }
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<ProfileUserType>) => {
        state.userProfile = action.payload
      })
      .addCase(fetchChatsContacts.fulfilled, (state, action) => {
        state.contacts = action.payload.contacts
        state.chats = action.payload.chatsContacts
        // Auto-select General Assistant if nothing selected
        if (!state.selectedChat && action.payload.chatsContacts.length > 0) {
          const general = action.payload.chatsContacts[0]
          state.selectedChat = {
            chat: general.chat,
            contact: general
          }
        }
      })
      .addCase(selectChat.fulfilled, (state, action: PayloadAction<SelectedChatType>) => {
        state.selectedChat = action.payload
      })
      .addCase(sendMsg.pending, (state, action) => {
        state.isLoadingAi = true
        state.error = null

        const userMsg: ChatType = {
          message: action.meta.arg.message,
          senderId: state.userProfile?.id || 1,
          time: new Date().toISOString(),
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        }

        if (state.selectedChat) {
          state.selectedChat.chat.chat.push(userMsg)
          state.selectedChat.chat.lastMessage = userMsg
        }
      })
      .addCase(sendMsg.fulfilled, (state, action) => {
        state.isLoadingAi = false

        const aiMsg: ChatType = {
          message: action.payload.reply,
          senderId: 0,
          time: new Date().toISOString(),
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          },
          referencedDocuments: action.payload.referencedDocuments
        }

        if (state.selectedChat) {
          state.selectedChat.chat.chat.push(aiMsg)
          state.selectedChat.chat.lastMessage = aiMsg

          const match = state.chats?.find(c => c.id === state.selectedChat?.contact.id)
          if (match) {
            match.chat.chat = [...state.selectedChat.chat.chat]
            match.chat.lastMessage = aiMsg
          }
        }
      })
      .addCase(sendMsg.rejected, (state, action) => {
        state.isLoadingAi = false
        state.error = (action.payload as string) || 'Error al procesar la consulta'

        const errorMsg: ChatType = {
          message: `⚠️ No fue posible procesar tu consulta: ${action.payload || 'Ocurrió un error inesperado.'}`,
          senderId: 0,
          time: new Date().toISOString(),
          feedback: {
            isSent: true,
            isDelivered: true,
            isSeen: true
          }
        }

        if (state.selectedChat) {
          state.selectedChat.chat.chat.push(errorMsg)
          state.selectedChat.chat.lastMessage = errorMsg
        }
      })
  }
})

export const { removeSelectedChat, clearCurrentChat } = appChatSlice.actions

export default appChatSlice.reducer
