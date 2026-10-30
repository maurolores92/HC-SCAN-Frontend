import React from 'react'
import Chip, { ChipProps } from '@mui/material/Chip'

export type GenericStatus =

  // Document statuses
  | 'PENDING'
  | 'PROCESSING'
  | 'PROCESSED'
  | 'ERROR'

  // Company statuses
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'

  // User statuses
  | 'BLOCKED'
  | string

interface StatusChipProps extends Omit<ChipProps, 'color' | 'label'> {
  status: GenericStatus
  customLabel?: string
}

interface StatusConfig {
  label: string
  color: NonNullable<ChipProps['color']>
}

const STATUS_CONFIGS: Record<string, StatusConfig> = {
  // Document
  PENDING: { label: 'Pendiente', color: 'warning' },
  PROCESSING: { label: 'Procesando IA', color: 'info' },
  PROCESSED: { label: 'Procesado', color: 'success' },
  ERROR: { label: 'Error', color: 'error' },

  // Company / User
  ACTIVE: { label: 'Activo', color: 'success' },
  INACTIVE: { label: 'Inactivo', color: 'default' },
  SUSPENDED: { label: 'Suspendida', color: 'error' },
  BLOCKED: { label: 'Bloqueado', color: 'error' },

  // Sources
  APP_UPLOAD: { label: 'Web App', color: 'primary' },
  FTP: { label: 'Servidor FTP', color: 'secondary' }
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  customLabel,
  size = 'small',
  sx,
  ...props
}) => {
  const normalizedKey = (status || '').toUpperCase()
  const config = STATUS_CONFIGS[normalizedKey] || {
    label: customLabel || status,
    color: 'default'
  }

  return (
    <Chip
      size={size}
      label={customLabel || config.label}
      color={config.color}
      sx={{
        fontWeight: 500,
        fontSize: '0.75rem',
        textTransform: 'capitalize',
        ...sx
      }}
      {...props}
    />
  )
}

export default StatusChip
