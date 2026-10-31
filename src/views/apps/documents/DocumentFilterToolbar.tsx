import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Icon from 'src/@core/components/icon'
import SyncFtpButton from 'src/components/documents/SyncFtpButton'
import { DocumentTypeFacet } from 'src/store/apps/documents'

interface DocumentFilterToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  documentType: string
  onDocumentTypeChange: (value: string) => void
  facets: DocumentTypeFacet[]
  dateFrom: string
  onDateFromChange: (value: string) => void
  dateTo: string
  onDateToChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  source: string
  onSourceChange: (value: string) => void
  onResetFilters: () => void
  hasActiveFilters: boolean
  onToggleUpload: () => void
  showUpload: boolean
  onSyncFtp: () => Promise<void> | void
  isSyncing: boolean
}

const formatDocumentTypeLabel = (raw: string) =>
  raw
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())

export const DocumentFilterToolbar: React.FC<DocumentFilterToolbarProps> = ({
  search,
  onSearchChange,
  documentType,
  onDocumentTypeChange,
  facets,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  status,
  onStatusChange,
  source,
  onSourceChange,
  onResetFilters,
  hasActiveFilters,
  onToggleUpload,
  showUpload,
  onSyncFtp,
  isSyncing
}) => {
  return (
    <Box sx={{ p: 4, borderTop: 1, borderColor: 'divider' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
          mb: 3
        }}
      >
        <TextField
          size='small'
          placeholder='Buscar por cualquier dato, texto del PDF, emisor, responsable, N° o atributo...'
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          sx={{ flex: 1, minWidth: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Icon icon='tabler:search' fontSize={18} />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position='end'>
                <IconButton size='small' onClick={() => onSearchChange('')}>
                  <Icon icon='tabler:x' fontSize={16} />
                </IconButton>
              </InputAdornment>
            ) : undefined
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <SyncFtpButton onSync={onSyncFtp} loading={isSyncing} />

          <Button
            variant={showUpload ? 'outlined' : 'contained'}
            color='primary'
            onClick={onToggleUpload}
            startIcon={<Icon icon={showUpload ? 'tabler:chevron-up' : 'tabler:upload'} />}
          >
            {showUpload ? 'Ocultar Carga' : 'Subir PDF'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2.5} alignItems='center'>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            size='small'
            label='Tipo de Documento'
            value={documentType}
            onChange={e => onDocumentTypeChange(e.target.value)}
          >
            <MenuItem value=''>Todos los tipos</MenuItem>
            {facets.map(facet => (
              <MenuItem key={facet.value} value={facet.value}>
                {formatDocumentTypeLabel(facet.value)} ({facet.count})
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={2.2}>
          <TextField
            select
            fullWidth
            size='small'
            label='Estado IA'
            value={status}
            onChange={e => onStatusChange(e.target.value)}
          >
            <MenuItem value=''>Todos los estados</MenuItem>
            <MenuItem value='PENDING'>Pendiente</MenuItem>
            <MenuItem value='PROCESSING'>Procesando IA</MenuItem>
            <MenuItem value='PROCESSED'>Procesado</MenuItem>
            <MenuItem value='ERROR'>Error</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={2.2}>
          <TextField
            select
            fullWidth
            size='small'
            label='Origen'
            value={source}
            onChange={e => onSourceChange(e.target.value)}
          >
            <MenuItem value=''>Todos los orígenes</MenuItem>
            <MenuItem value='APP_UPLOAD'>Subida Web</MenuItem>
            <MenuItem value='FTP'>SFTP / Bandeja</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <TextField
            fullWidth
            size='small'
            type='date'
            label='Fecha Doc. Desde'
            value={dateFrom}
            onChange={e => onDateFromChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <TextField
            fullWidth
            size='small'
            type='date'
            label='Fecha Doc. Hasta'
            value={dateTo}
            onChange={e => onDateToChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {hasActiveFilters && (
          <Grid item xs={12} md={0.6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title='Limpiar todos los filtros'>
              <IconButton color='secondary' onClick={onResetFilters} size='small'>
                <Icon icon='tabler:filter-off' />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default DocumentFilterToolbar
