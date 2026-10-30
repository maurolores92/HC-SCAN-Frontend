import React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import SyncFtpButton from 'src/components/documents/SyncFtpButton'

interface DocumentFilterToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  source: string
  onSourceChange: (value: string) => void
  onToggleUpload: () => void
  showUpload: boolean
  onSyncFtp: () => Promise<void> | void
  isSyncing: boolean
}

export const DocumentFilterToolbar: React.FC<DocumentFilterToolbarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  source,
  onSourceChange,
  onToggleUpload,
  showUpload,
  onSyncFtp,
  isSyncing
}) => {
  return (
    <Box
      sx={{
        p: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 3
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3, flex: 1 }}>
        <TextField
          size='small'
          placeholder='Buscar por nombre o hash...'
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          sx={{ minWidth: 240 }}
        />

        <TextField
          select
          size='small'
          value={status}
          onChange={e => onStatusChange(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value=''>Todos los estados</MenuItem>
          <MenuItem value='PENDING'>Pendiente</MenuItem>
          <MenuItem value='PROCESSING'>En Proceso IA</MenuItem>
          <MenuItem value='PROCESSED'>Procesado</MenuItem>
          <MenuItem value='ERROR'>Error</MenuItem>
        </TextField>

        <TextField
          select
          size='small'
          value={source}
          onChange={e => onSourceChange(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value=''>Todos los orígenes</MenuItem>
          <MenuItem value='APP_UPLOAD'>Subida Web</MenuItem>
          <MenuItem value='FTP'>Servidor FTP</MenuItem>
        </TextField>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
  )
}

export default DocumentFilterToolbar

