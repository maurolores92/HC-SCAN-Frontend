import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'
import apiConnector from 'src/services/api.service'

export type DocumentSource = 'APP_UPLOAD' | 'FTP'
export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'ERROR'

export interface DocumentItem {
  id: number
  companyId: number
  originalName: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  sha256Hash: string
  source: DocumentSource
  status: DocumentStatus
  extractedData?: Record<string, any> | null
  uploadedByUserId?: number | null
  errorMessage?: string | null
  createdAt: string
  updatedAt: string
}

interface FetchParams {
  page?: number
  limit?: number
  status?: string
  source?: string
  search?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Documents List
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (params: FetchParams = {}) => {
    const response: any = await apiConnector.get('/documents', params)
    
return response
  }
)

// ** Upload Document (PDF)
export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async (formData: FormData, { dispatch }: Redux) => {
    const response = await apiConnector.sendFile('/documents/upload', formData)
    dispatch(fetchDocuments({}))
    
return response
  }
)

// ** Sync FTP Documents
export const syncFtpDocuments = createAsyncThunk(
  'documents/syncFtpDocuments',
  async (companyId: number | undefined, { dispatch }: Redux) => {
    const path = companyId ? `/documents/sync-ftp?companyId=${companyId}` : '/documents/sync-ftp'
    const response = await apiConnector.post(path, {})
    dispatch(fetchDocuments({}))
    
return response
  }
)

// ** Delete Document
export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (id: number, { dispatch }: Redux) => {
    const response = await apiConnector.remove(`/documents/${id}`)
    dispatch(fetchDocuments({}))
    
return response
  }
)

export const appDocumentsSlice = createSlice({
  name: 'documents',
  initialState: {
    data: [] as DocumentItem[],
    total: 0,
    params: {
      page: 1,
      limit: 10,
      search: '',
      status: '',
      source: ''
    },
    loading: false,
    uploading: false,
    syncingFtp: false,
    selectedDocument: null as DocumentItem | null,
    error: null as string | null
  },
  reducers: {
    setSelectedDocument: (state, action) => {
      state.selectedDocument = action.payload
    },
    setParams: (state, action) => {
      state.params = { ...state.params, ...action.payload }
    }
  },
  extraReducers: builder => {
    builder

      // Fetch Documents
      .addCase(fetchDocuments.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDocuments.fulfilled, (state, action: any) => {
        state.loading = false
        state.data = action.payload?.data || []
        state.total = action.payload?.meta?.totalItems || 0
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error al cargar documentos'
      })

      // Upload Document
      .addCase(uploadDocument.pending, state => {
        state.uploading = true
      })
      .addCase(uploadDocument.fulfilled, state => {
        state.uploading = false
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploading = false
        state.error = action.error.message || 'Error al subir documento'
      })

      // Sync FTP
      .addCase(syncFtpDocuments.pending, state => {
        state.syncingFtp = true
      })
      .addCase(syncFtpDocuments.fulfilled, state => {
        state.syncingFtp = false
      })
      .addCase(syncFtpDocuments.rejected, (state, action) => {
        state.syncingFtp = false
        state.error = action.error.message || 'Error al sincronizar FTP'
      })
  }
})

export const { setSelectedDocument, setParams } = appDocumentsSlice.actions

export default appDocumentsSlice.reducer
