import React from 'react'
import Chip, { ChipProps } from '@mui/material/Chip'

export type GenericStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'PROCESSED'
  | 'ERROR'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
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
  PENDING: { label: 'Pendiente', color: 'warning' },
  PROCESSING: { label: 'Procesando IA', color: 'info' },
  PROCESSED: { label: 'Procesado', color: 'success' },
  ERROR: { label: 'Error', color: 'error' },
  ACTIVE: { label: 'Activo', color: 'success' },
  INACTIVE: { label: 'Inactivo', color: 'default' },
  SUSPENDED: { label: 'Suspendida', color: 'error' },
  BLOCKED: { label: 'Bloqueado', color: 'error' },
  APP_UPLOAD: { label: 'Subida Web', color: 'primary' },
  FTP: { label: 'SFTP / Bandeja', color: 'secondary' }
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
