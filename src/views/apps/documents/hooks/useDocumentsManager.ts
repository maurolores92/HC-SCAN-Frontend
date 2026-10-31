import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { AppDispatch, RootState } from 'src/store'
import {
  deleteDocument,
  DocumentItem,
  fetchDocumentFacets,
  fetchDocuments,
  reprocessDocument,
  syncFtpDocuments,
  uploadDocument
} from 'src/store/apps/documents'
import { fetchMyCompanyQuota } from 'src/store/apps/plans'

export const useDocumentsManager = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data, facets, total, loading, uploading, syncingFtp, reprocessingId } = useSelector(
    (state: RootState) => state.documents
  )
  const { myQuota } = useSelector((state: RootState) => state.plans)
  const latestNotification = useSelector(
    (state: RootState) => state.notifications.notifications[0]
  )

  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [documentType, setDocumentType] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [showUpload, setShowUpload] = useState(false)

  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null)
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const lastHandledNotifId = useRef<number | null>(latestNotification?.id ?? null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
      setPage(0)
    }, 350)

    return () => clearTimeout(timer)
  }, [searchInput])

  const loadData = useCallback(() => {
    dispatch(
      fetchDocuments({
        page: page + 1,
        limit: pageSize,
        search: debouncedSearch,
        documentType,
        dateFrom,
        dateTo,
        status,
        source
      })
    )
    dispatch(fetchDocumentFacets(undefined))
    dispatch(fetchMyCompanyQuota())
  }, [dispatch, page, pageSize, debouncedSearch, documentType, dateFrom, dateTo, status, source])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Auto-refresco en vivo vía WebSocket al recibir eventos document.uploaded / document.processed / document.error
  useEffect(() => {
    if (!latestNotification || latestNotification.id === lastHandledNotifId.current) return
    lastHandledNotifId.current = latestNotification.id

    if (latestNotification.type?.startsWith('document.')) {
      loadData()
    }
  }, [latestNotification, loadData])

  // Sincronizar datos del modal si el documento abierto termina de procesarse
  useEffect(() => {
    if (!previewDoc) return
    const updatedInList = data.find(item => item.id === previewDoc.id)
    if (updatedInList && updatedInList.status !== previewDoc.status) {
      setPreviewDoc(prev => (prev ? { ...prev, ...updatedInList } : null))
    }
  }, [data, previewDoc])

  const handleResetFilters = () => {
    setSearchInput('')
    setDebouncedSearch('')
    setDocumentType('')
    setDateFrom('')
    setDateTo('')
    setStatus('')
    setSource('')
    setPage(0)
  }

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      await dispatch(uploadDocument(formData)).unwrap()
      toast.success('PDF subido e ingresado a extracción inteligente con IA')
      setShowUpload(false)
      loadData()
    } catch (err: any) {
      toast.error(err?.message || 'Error al subir el archivo PDF')
    }
  }

  const handleSyncFtp = async () => {
    try {
      const res: any = await dispatch(syncFtpDocuments(undefined)).unwrap()
      if (res?.quotaReached) {
        toast.error(
          `Bandeja sincronizó ${res?.syncedCount || 0} archivo(s), pero ${res?.skippedByQuotaCount || 0} pasaron a cuarentena por límite de plan.`
        )
      } else {
        const count = res?.syncedCount ?? res?.imported ?? 0
        toast.success(`Bandeja sincronizada: ${count} nuevo(s) PDF(s) en procesamiento IA`)
      }
      loadData()
    } catch (err: any) {
      toast.error(err?.message || 'Error al sincronizar bandeja SFTP / local')
    }
  }

  const handleReprocess = async (doc: DocumentItem) => {
    try {
      await dispatch(reprocessDocument(doc.id)).unwrap()
      toast.success(`Reprocesando '${doc.originalName}' con IA...`)
      loadData()
    } catch (err: any) {
      toast.error(err?.message || 'Error al reprocesar el documento')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!docToDelete) return
    try {
      setIsDeleting(true)
      await dispatch(deleteDocument(docToDelete.id)).unwrap()
      toast.success('Documento eliminado correctamente')
      setDocToDelete(null)
      loadData()
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar el documento')
    } finally {
      setIsDeleting(false)
    }
  }

  const hasActiveFilters = Boolean(
    searchInput || documentType || dateFrom || dateTo || status || source
  )

  return {
    data,
    facets,
    total,
    loading,
    uploading,
    syncingFtp,
    reprocessingId,
    myQuota,
    searchInput,
    setSearchInput,
    documentType,
    setDocumentType,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    status,
    setStatus,
    source,
    setSource,
    page,
    setPage,
    pageSize,
    setPageSize,
    showUpload,
    setShowUpload,
    previewDoc,
    setPreviewDoc,
    docToDelete,
    setDocToDelete,
    isDeleting,
    hasActiveFilters,
    handleResetFilters,
    handleUpload,
    handleSyncFtp,
    handleReprocess,
    handleDeleteConfirm
  }
}

