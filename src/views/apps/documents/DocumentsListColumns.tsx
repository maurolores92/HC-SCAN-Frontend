import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import { GridColDef } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { DocumentItem } from 'src/store/apps/documents'
import StatusChip from 'src/components/common/StatusChip'

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

const formatDocType = (type?: string | null) => {
  if (!type) return null

  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const formatAmount = (amount?: number | string | null, currency?: string | null) => {
  if (amount === null || amount === undefined || amount === '') return null
  const num = Number(amount)
  if (!Number.isFinite(num)) return null
  const prefix = currency || '$'

  return `${prefix} ${num.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

export const buildDocumentsColumns = (handlers: {
  onPreview: (doc: DocumentItem) => void
  onReprocess: (doc: DocumentItem) => void
  onDelete: (doc: DocumentItem) => void
  reprocessingId?: number | null
}): GridColDef[] => [
  {
    field: 'originalName',
    headerName: 'Documento PDF',
    flex: 0.3,
    minWidth: 250,
    renderCell: ({ row }: { row: DocumentItem }) => {
      const hashValue = row.fileHash || row.sha256Hash

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden', width: '100%' }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              flexShrink: 0,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'error.light',
              color: 'error.main'
            }}
          >
            <Icon icon='tabler:file-type-pdf' fontSize={21} />
          </Box>
          <Box sx={{ overflow: 'hidden', flex: 1 }}>
            <Typography
              variant='body2'
              noWrap
              sx={{
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': { color: 'primary.main', textDecoration: 'underline' }
              }}
              onClick={() => handlers.onPreview(row)}
            >
              {row.originalName}
            </Typography>
            <Typography variant='caption' noWrap sx={{ display: 'block', color: 'text.secondary' }}>
              {row.summary
                ? row.summary
                : `${formatBytes(row.fileSize)}${hashValue ? ` · ${hashValue.substring(0, 10)}...` : ''}`}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    field: 'documentType',
    headerName: 'Tipo Detectado',
    flex: 0.14,
    minWidth: 145,
    renderCell: ({ row }: { row: DocumentItem }) => {
      const label = formatDocType(row.documentType)

      return label ? (
        <Box sx={{ overflow: 'hidden' }}>
          <Chip label={label} size='small' color='primary' variant='outlined' sx={{ fontWeight: 600 }} />
          {row.documentNumber && (
            <Typography variant='caption' noWrap sx={{ display: 'block', mt: 0.3, color: 'text.secondary' }}>
              N° {row.documentNumber}
            </Typography>
          )}
        </Box>
      ) : (
        <Typography variant='caption' sx={{ color: 'text.disabled' }}>
          Sin clasificar
        </Typography>
      )
    }
  },
  {
    field: 'issuerName',
    headerName: 'Emisor / Responsable',
    flex: 0.2,
    minWidth: 180,
    renderCell: ({ row }: { row: DocumentItem }) => (
      <Box sx={{ overflow: 'hidden' }}>
        <Typography variant='body2' noWrap sx={{ fontWeight: row.issuerName ? 500 : 400 }}>
          {row.issuerName || row.recipientName || '—'}
        </Typography>
        <Typography variant='caption' noWrap sx={{ display: 'block', color: 'text.secondary' }}>
          {row.responsiblePerson
            ? `Resp: ${row.responsiblePerson}`
            : row.issuerTaxId
            ? `ID: ${row.issuerTaxId}`
            : ''}
        </Typography>
      </Box>
    )
  },
  {
    field: 'documentDate',
    headerName: 'Fecha / Monto',
    flex: 0.14,
    minWidth: 135,
    renderCell: ({ row }: { row: DocumentItem }) => {
      const formattedAmount = formatAmount(row.totalAmount, row.currency)
      const dateStr = row.documentDate
        ? row.documentDate
        : new Date(row.createdAt).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })

      return (
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant='body2' noWrap sx={{ fontWeight: formattedAmount ? 600 : 400 }}>
            {formattedAmount || dateStr}
          </Typography>
          {formattedAmount && (
            <Typography variant='caption' noWrap sx={{ display: 'block', color: 'text.secondary' }}>
              {dateStr}
            </Typography>
          )}
        </Box>
      )
    }
  },
  {
    field: 'source',
    headerName: 'Origen',
    flex: 0.11,
    minWidth: 120,
    renderCell: ({ row }: { row: DocumentItem }) => <StatusChip status={row.source} />
  },
  {
    field: 'status',
    headerName: 'Estado IA',
    flex: 0.12,
    minWidth: 125,
    renderCell: ({ row }: { row: DocumentItem }) => <StatusChip status={row.status} />
  },
  {
    field: 'actions',
    headerName: 'Acciones',
    flex: 0.11,
    minWidth: 125,
    sortable: false,
    renderCell: ({ row }: { row: DocumentItem }) => {
      const isReprocessing = handlers.reprocessingId === row.id || row.status === 'PROCESSING'

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title='Ver PDF y Ficha Inteligente IA'>
            <IconButton size='small' color='primary' onClick={() => handlers.onPreview(row)}>
              <Icon icon='tabler:eye' fontSize={19} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Reprocesar extracción con IA'>
            <span>
              <IconButton
                size='small'
                color='info'
                disabled={isReprocessing}
                onClick={() => handlers.onReprocess(row)}
              >
                {isReprocessing ? (
                  <CircularProgress size={16} />
                ) : (
                  <Icon icon='tabler:sparkles' fontSize={18} />
                )}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title='Eliminar'>
            <IconButton size='small' color='error' onClick={() => handlers.onDelete(row)}>
              <Icon icon='tabler:trash' fontSize={19} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  }
]
