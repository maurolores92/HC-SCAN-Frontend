import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'
import apiConnector from 'src/services/api.service'

export type DocumentSource = 'APP_UPLOAD' | 'FTP'
export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'ERROR'

export interface DocumentInvolvedParty {
  role: string
  name: string
  identifier?: string | null
}

export interface DocumentExtractedData {
  attributes?: Record<string, string | number | boolean | null>
  items?: Array<Record<string, string | number | null>>
  involvedParties?: DocumentInvolvedParty[]
  dates?: Record<string, string>
  amounts?: Record<string, number>
  [key: string]: any
}

export interface DocumentItem {
  id: number
  companyId: number
  originalName: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  fileHash?: string | null
  sha256Hash?: string | null
  source: DocumentSource
  status: DocumentStatus
  documentType?: string | null
  summary?: string | null
  documentNumber?: string | null
  documentDate?: string | null
  issuerName?: string | null
  issuerTaxId?: string | null
  recipientName?: string | null
  responsiblePerson?: string | null
  currency?: string | null
  totalAmount?: number | string | null
  tags?: string[] | null
  extractedData?: DocumentExtractedData | null
  rawText?: string | null
  pageCount?: number | null
  aiConfidence?: number | null
  extractionEngine?: string | null
  processedAt?: string | null
  userId?: number | null
  uploadedByUserId?: number | null
  errorMessage?: string | null
  createdAt: string
  updatedAt: string
}

export interface DocumentTypeFacet {
  value: string
  count: number
}

export interface FetchDocumentParams {
  page?: number
  limit?: number
  status?: string
  source?: string
  search?: string
  documentType?: string
  dateFrom?: string
  dateTo?: string
  filterCompanyId?: number
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (params: FetchDocumentParams = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
    )
    const response: any = await apiConnector.get('/documents', cleanParams)

    return response
  }
)

export const fetchDocumentFacets = createAsyncThunk(
  'documents/fetchDocumentFacets',
  async (companyId?: number) => {
    const params = companyId ? { companyId } : {}
    const response: any = await apiConnector.get('/documents/facets', params)

    return response
  }
)

export const fetchDocumentById = createAsyncThunk(
  'documents/fetchDocumentById',
  async (id: number) => {
    const response = await apiConnector.get<DocumentItem>(`/documents/${id}`)

    return response
  }
)

export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async (formData: FormData) => {
    const response = await apiConnector.sendFile('/documents/upload', formData)

    return response
  }
)

export const syncFtpDocuments = createAsyncThunk(
  'documents/syncFtpDocuments',
  async (companyId: number | undefined) => {
    const path = companyId ? `/documents/sync-ftp?companyId=${companyId}` : '/documents/sync-ftp'
    const response = await apiConnector.post(path, {})

    return response
  }
)

export const reprocessDocument = createAsyncThunk(
  'documents/reprocessDocument',
  async (id: number) => {
    const response = await apiConnector.post(`/documents/${id}/reprocess`, {})

    return response
  }
)

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (id: number, { dispatch }: Redux) => {
    const response = await apiConnector.remove(`/documents/${id}`)
    dispatch(fetchDocumentFacets(undefined))

    return response
  }
)

export const appDocumentsSlice = createSlice({
  name: 'documents',
  initialState: {
    data: [] as DocumentItem[],
    facets: [] as DocumentTypeFacet[],
    total: 0,
    params: {
      page: 1,
      limit: 10,
      search: '',
      status: '',
      source: '',
      documentType: '',
      dateFrom: '',
      dateTo: ''
    },
    loading: false,
    uploading: false,
    syncingFtp: false,
    reprocessingId: null as number | null,
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
      .addCase(fetchDocumentFacets.fulfilled, (state, action: any) => {
        state.facets = action.payload?.documentTypes || []
      })
      .addCase(fetchDocumentById.fulfilled, (state, action: any) => {
        state.selectedDocument = action.payload
      })
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
      .addCase(syncFtpDocuments.pending, state => {
        state.syncingFtp = true
      })
      .addCase(syncFtpDocuments.fulfilled, state => {
        state.syncingFtp = false
      })
      .addCase(syncFtpDocuments.rejected, (state, action) => {
        state.syncingFtp = false
        state.error = action.error.message || 'Error al sincronizar bandeja'
      })
      .addCase(reprocessDocument.pending, (state, action) => {
        state.reprocessingId = action.meta.arg
      })
      .addCase(reprocessDocument.fulfilled, state => {
        state.reprocessingId = null
      })
      .addCase(reprocessDocument.rejected, state => {
        state.reprocessingId = null
      })
  }
})

export const { setSelectedDocument, setParams } = appDocumentsSlice.actions

export default appDocumentsSlice.reducer
