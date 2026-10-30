import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import { AppDispatch, RootState } from 'src/store'
import {
  fetchDocuments,
  uploadDocument,
  syncFtpDocuments,
  deleteDocument,
  DocumentItem
} from 'src/store/apps/documents'
import StatusChip from 'src/components/common/StatusChip'
import ConfirmActionDialog from 'src/components/common/ConfirmActionDialog'
import DocumentDropzone from 'src/components/documents/DocumentDropzone'
import PdfViewerModal from 'src/components/documents/PdfViewerModal'
import DocumentStatsHeader from './DocumentStatsHeader'
import DocumentFilterToolbar from './DocumentFilterToolbar'

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const DocumentsListView = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data, total, loading, uploading, syncingFtp } = useSelector(
    (state: RootState) => state.documents
  )

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [showUpload, setShowUpload] = useState(false)

  // Preview & Delete states
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null)
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = useCallback(() => {
    dispatch(
      fetchDocuments({
        page: page + 1,
        limit: pageSize,
        search,
        status,
        source
      })
    )
  }, [dispatch, page, pageSize, search, status, source])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      await dispatch(uploadDocument(formData)).unwrap()
      toast.success('Documento subido correctamente')
      setShowUpload(false)
      loadData()
    } catch (err: any) {
      toast.error(err?.message || 'Error al subir el archivo')
    }
  }

  const handleSyncFtp = async () => {
    try {
      const res: any = await dispatch(syncFtpDocuments(undefined)).unwrap()
      toast.success(`FTP Sincronizado: ${res?.imported || 0} nuevos archivos indexados`)
      loadData()
    } catch (err: any) {
      toast.error(err?.message || 'Error al sincronizar FTP')
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

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'originalName',
        headerName: 'Documento PDF',
        flex: 0.35,
        minWidth: 260,
        renderCell: ({ row }: { row: DocumentItem }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden' }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'error.light',
                color: 'error.main'
              }}
            >
              <Icon icon='tabler:file-type-pdf' fontSize={22} />
            </Box>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                variant='body2'
                noWrap
                sx={{
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main', textDecoration: 'underline' }
                }}
                onClick={() => setPreviewDoc(row)}
              >
                {row.originalName}
              </Typography>
              <Typography variant='caption' noWrap sx={{ color: 'text.disabled' }}>
                Hash: {row.sha256Hash ? `${row.sha256Hash.substring(0, 14)}...` : '-'}
              </Typography>
            </Box>
          </Box>
        )
      },
      {
        field: 'fileSize',
        headerName: 'Tamaño',
        flex: 0.12,
        minWidth: 100,
        renderCell: ({ row }: { row: DocumentItem }) => (
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            {formatBytes(row.fileSize)}
          </Typography>
        )
      },
      {
        field: 'source',
        headerName: 'Origen',
        flex: 0.15,
        minWidth: 130,
        renderCell: ({ row }: { row: DocumentItem }) => <StatusChip status={row.source} />
      },
      {
        field: 'status',
        headerName: 'Estado IA',
        flex: 0.15,
        minWidth: 140,
        renderCell: ({ row }: { row: DocumentItem }) => <StatusChip status={row.status} />
      },
      {
        field: 'createdAt',
        headerName: 'Fecha Registro',
        flex: 0.15,
        minWidth: 140,
        renderCell: ({ row }: { row: DocumentItem }) => (
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            {new Date(row.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </Typography>
        )
      },
      {
        field: 'actions',
        headerName: 'Acciones',
        flex: 0.12,
        minWidth: 110,
        sortable: false,
        renderCell: ({ row }: { row: DocumentItem }) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Ver / Previsualizar'>
              <IconButton size='small' color='primary' onClick={() => setPreviewDoc(row)}>
                <Icon icon='tabler:eye' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Eliminar'>
              <IconButton size='small' color='error' onClick={() => setDocToDelete(row)}>
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    ],
    []
  )

  return (
    <Box>
      <DocumentStatsHeader documents={data} total={total} />

      <Card>
        <CardHeader
          title='Gestión de Documentos PDF'
          subheader='Almacenamiento corporativo e ingesta inteligente de información con IA'
        />

        <Collapse in={showUpload}>
          <Box sx={{ px: 4, pb: 4 }}>
            <DocumentDropzone onUpload={handleUpload} isUploading={uploading} />
          </Box>
        </Collapse>

        <DocumentFilterToolbar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          source={source}
          onSourceChange={setSource}
          onToggleUpload={() => setShowUpload(prev => !prev)}
          showUpload={showUpload}
          onSyncFtp={handleSyncFtp}
          isSyncing={syncingFtp}
        />

        <DataGrid
          autoHeight
          rowHeight={64}
          rows={data}
          rowCount={total}
          columns={columns}
          loading={loading}
          paginationMode='server'
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={model => {
            setPage(model.page)
            setPageSize(model.pageSize)
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
        />
      </Card>

      <PdfViewerModal
        open={Boolean(previewDoc)}
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />

      <ConfirmActionDialog
        open={Boolean(docToDelete)}
        title='¿Eliminar documento PDF?'
        content={`¿Estás seguro de que deseas eliminar permanentemente el documento "${docToDelete?.originalName}"? Esta acción borrará el archivo de almacenamiento y sus datos extraídos.`}
        confirmText='Sí, eliminar'
        cancelText='Cancelar'
        color='error'
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDocToDelete(null)}
      />
    </Box>
  )
}

export default DocumentsListView
