import React from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import Tooltip from '@mui/material/Tooltip'
import Icon from 'src/@core/components/icon'

interface SyncFtpButtonProps {
  onSync: () => Promise<void> | void
  loading?: boolean
  disabled?: boolean
  variant?: 'contained' | 'outlined' | 'text'
  size?: 'small' | 'medium' | 'large'
}

export const SyncFtpButton: React.FC<SyncFtpButtonProps> = ({
  onSync,
  loading = false,
  disabled = false,
  variant = 'outlined',
  size = 'medium'
}) => {
  return (
    <Tooltip title='Escanear bandeja SFTP / carpeta local inbox y procesar nuevos archivos PDF' arrow>
      <span>
        <LoadingButton
          variant={variant}
          color='secondary'
          size={size}
          loading={loading}
          disabled={disabled}
          onClick={onSync}
          startIcon={<Icon icon='tabler:refresh' />}
          sx={{ textTransform: 'none', fontWeight: 500 }}
        >
          {loading ? 'Sincronizando...' : 'Sincronizar Bandeja / SFTP'}
        </LoadingButton>
      </span>
    </Tooltip>
  )
}

export default SyncFtpButton
