// ** React Imports
import { useRef, useEffect, Ref, ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent, { ScrollBarProps } from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Imports
import { getInitials } from 'src/@core/utils/get-initials'

// ** Types Imports
import {
  ChatLogType,
  MessageType,
  MsgFeedbackType,
  ChatLogChatType,
  MessageGroupType,
  FormattedChatsType
} from 'src/types/apps/chatTypes'

const PerfectScrollbar = styled(PerfectScrollbarComponent)<ScrollBarProps & { ref: Ref<unknown> }>(({ theme }) => ({
  padding: theme.spacing(5)
}))

const ChatLog = (props: ChatLogType) => {
  // ** Props
  const { data, hidden } = props

  // ** Ref
  const chatArea = useRef(null)

  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    if (chatArea.current) {
      if (hidden) {
        // @ts-ignore
        chatArea.current.scrollTop = chatArea.current.scrollHeight
      } else {
        // @ts-ignore
        chatArea.current._container.scrollTop = chatArea.current._container.scrollHeight
      }
    }
  }

  // ** Formats chat data based on sender
  const formattedChatData = () => {
    let chatLog: MessageType[] | [] = []
    if (data.chat) {
      chatLog = data.chat.chat
    }

    const formattedChatLog: FormattedChatsType[] = []
    let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : 11
    let msgGroup: MessageGroupType = {
      senderId: chatMessageSenderId,
      messages: []
    }
    chatLog.forEach((msg: MessageType, index: number) => {
      if (chatMessageSenderId === msg.senderId) {
        msgGroup.messages.push({
          time: msg.time,
          msg: msg.message,
          feedback: msg.feedback,
          referencedDocuments: msg.referencedDocuments
        })
      } else {
        chatMessageSenderId = msg.senderId

        formattedChatLog.push(msgGroup)
        msgGroup = {
          senderId: msg.senderId,
          messages: [
            {
              time: msg.time,
              msg: msg.message,
              feedback: msg.feedback,
              referencedDocuments: msg.referencedDocuments
            }
          ]
        }
      }

      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
    })

    return formattedChatLog
  }

  const renderMsgFeedback = (isSender: boolean, feedback: MsgFeedbackType) => {
    if (isSender) {
      if (feedback.isSent && !feedback.isDelivered) {
        return (
          <Box component='span' sx={{ display: 'flex', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
            <Icon icon='tabler:check' fontSize='1.125rem' />
          </Box>
        )
      } else if (feedback.isSent && feedback.isDelivered) {
        return (
          <Box
            component='span'
            sx={{
              display: 'flex',
              '& svg': { mr: 1.5, color: feedback.isSeen ? 'success.main' : 'text.secondary' }
            }}
          >
            <Icon icon='tabler:checks' fontSize='1.125rem' />
          </Box>
        )
      }
    }

    return null
  }

  useEffect(() => {
    scrollToBottom()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.chat?.chat?.length, data?.isLoadingAi])

  // ** Renders user chat
  const renderChats = () => {
    return formattedChatData().map((item: FormattedChatsType, index: number) => {
      const isSender = item.senderId === data.userContact.id
      const isAi = item.senderId === 0

      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: !isSender ? 'row' : 'row-reverse',
            mb: index !== formattedChatData().length - 1 ? 4 : 2
          }}
        >
          <div>
            <CustomAvatar
              skin='light'
              color={isAi ? 'primary' : data.contact.avatarColor || 'secondary'}
              sx={{
                width: 32,
                height: 32,
                ml: isSender ? 3 : undefined,
                mr: !isSender ? 3 : undefined,
                fontSize: theme => theme.typography.body1.fontSize
              }}
              {...(data.contact.avatar && !isSender && !isAi
                ? {
                    src: data.contact.avatar,
                    alt: data.contact.fullName
                  }
                : {})}
              {...(isSender
                ? {
                    src: data.userContact.avatar,
                    alt: data.userContact.fullName
                  }
                : {})}
            >
              {isAi ? (
                <Icon icon='tabler:sparkles' fontSize='1rem' />
              ) : isSender ? (
                getInitials(data.userContact.fullName)
              ) : (
                getInitials(data.contact.fullName)
              )}
            </CustomAvatar>
          </div>

          <Box className='chat-body' sx={{ maxWidth: ['calc(100% - 5.75rem)', '80%', '72%'] }}>
            {item.messages.map((chat: ChatLogChatType, mIdx: number, { length }: { length: number }) => {
              const time = new Date(chat.time)

              return (
                <Box key={mIdx} sx={{ '&:not(:last-of-type)': { mb: 3 } }}>
                  <div>
                    <Typography
                      sx={{
                        boxShadow: 1,
                        borderRadius: 1,
                        maxWidth: '100%',
                        width: 'fit-content',
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        p: theme => theme.spacing(2.25, 4),
                        ml: isSender ? 'auto' : undefined,
                        borderTopLeftRadius: !isSender ? 0 : undefined,
                        borderTopRightRadius: isSender ? 0 : undefined,
                        color: isSender ? 'common.white' : 'text.primary',
                        backgroundColor: isSender ? 'primary.main' : 'background.paper'
                      }}
                    >
                      {chat.msg}
                    </Typography>
                  </div>

                  {chat.referencedDocuments && chat.referencedDocuments.length > 0 ? (
                    <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {chat.referencedDocuments.map((doc, docIdx) => (
                        <Chip
                          key={docIdx}
                          size='small'
                          variant='outlined'
                          color='primary'
                          icon={<Icon icon='tabler:file-text' fontSize='0.875rem' />}
                          label={`${doc.originalName}${doc.documentType ? ` (${doc.documentType})` : ''}`}
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                    </Box>
                  ) : null}

                  {mIdx + 1 === length ? (
                    <Box
                      sx={{
                        mt: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isSender ? 'flex-end' : 'flex-start'
                      }}
                    >
                      {renderMsgFeedback(isSender, chat.feedback)}
                      <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                        {time
                          ? new Date(time).toLocaleString('es-AR', { hour: 'numeric', minute: 'numeric', hour12: false })
                          : null}
                      </Typography>
                    </Box>
                  ) : null}
                </Box>
              )
            })}
          </Box>
        </Box>
      )
    })
  }

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return (
        <Box ref={chatArea} sx={{ p: 5, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </Box>
      )
    }

    return (
      <PerfectScrollbar ref={chatArea} options={{ wheelPropagation: false }}>
        {children}
      </PerfectScrollbar>
    )
  }

  return (
    <Box sx={{ height: 'calc(100% - 9.5rem)' }}>
      <ScrollWrapper>
        {renderChats()}
        {data.isLoadingAi ? (
          <Box sx={{ display: 'flex', flexDirection: 'row', mb: 3, alignItems: 'center' }}>
            <CustomAvatar skin='light' color='primary' sx={{ width: 32, height: 32, mr: 3 }}>
              <Icon icon='tabler:sparkles' fontSize='1rem' />
            </CustomAvatar>
            <Box
              sx={{
                boxShadow: 1,
                borderRadius: 1,
                borderTopLeftRadius: 0,
                p: theme => theme.spacing(2, 3),
                backgroundColor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}
            >
              <CircularProgress size={16} />
              <Typography variant='body2' sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                El asistente está analizando tus documentos...
              </Typography>
            </Box>
          </Box>
        ) : null}
      </ScrollWrapper>
    </Box>
  )
}

export default ChatLog
