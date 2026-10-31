import React, { useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { GridColDef } from '@mui/x-data-grid'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import StatusChip from 'src/components/common/StatusChip'
import QuotaProgressBar, { formatStorageMb } from 'src/components/common/QuotaProgressBar'

interface RowOptionsProps {
  row: any
  onEditClick: (row: any) => void
  onStatusToggle: (row: any) => void
  onDeleteClick: (row: any) => void
}

const RowOptions: React.FC<RowOptionsProps> = ({
  row,
  onEditClick,
  onStatusToggle,
  onDeleteClick
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  return (
    <>
      <IconButton size='small' onClick={e => setAnchorEl(e.currentTarget)}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href={`/companies/${row.id}`}
          onClick={() => setAnchorEl(null)}
        >
          <Icon icon='tabler:eye' fontSize={18} />
          Ver detalle y consumo
        </MenuItem>

        <MenuItem
          onClick={() => {
            setAnchorEl(null)
            onEditClick(row)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:edit' fontSize={18} />
          Editar / Cambiar Plan
        </MenuItem>

        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href={`/audit?companyId=${row.id}`}
          onClick={() => setAnchorEl(null)}
        >
          <Icon icon='tabler:clipboard-list' fontSize={18} />
          Auditoría
        </MenuItem>

        <MenuItem
          onClick={() => {
            setAnchorEl(null)
            onStatusToggle(row)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon={row.status === 'SUSPENDED' ? 'tabler:check' : 'tabler:ban'} fontSize={18} />
          {row.status === 'SUSPENDED' ? 'Activar' : 'Suspender'}
        </MenuItem>

        {row.status === 'SUSPENDED' && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null)
              onDeleteClick(row)
            }}
            sx={{ '& svg': { mr: 2, color: 'error.main' } }}
          >
            <Icon icon='tabler:trash' fontSize={18} color='error' />
            <Typography color='error'>Eliminar</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  )
}

export const buildCompaniesColumns = (handlers: {
  onEditClick: (row: any) => void
  onStatusToggle: (row: any) => void
  onDeleteClick: (row: any) => void
}): GridColDef[] => [
  {
    flex: 0.24,
    minWidth: 220,
    field: 'name',
    headerName: 'Compañía',
    renderCell: ({ row }) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar
          skin='light'
          color='primary'
          sx={{ mr: 3, width: 34, height: 34, fontSize: '0.9rem', fontWeight: 600 }}
        >
          {getInitials(row.name || 'Compañía')}
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            noWrap
            component={Link}
            href={`/companies/${row.id}`}
            sx={{
              fontWeight: 600,
              textDecoration: 'none',
              color: 'text.primary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            {row.name}
          </Typography>
          <Typography noWrap variant='caption' sx={{ color: 'text.disabled' }}>
            {row.taxId || row.slug || '-'}
          </Typography>
        </Box>
      </Box>
    )
  },
  {
    flex: 0.14,
    minWidth: 140,
    field: 'plan',
    headerName: 'Plan Activo',
    renderCell: ({ row }) => {
      const plan = row.quotaSummary?.plan || row.plan
      const badgeColor = (plan?.badgeColor || 'primary') as any

      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {plan ? (
            <Chip label={plan.name} color={badgeColor} size='small' sx={{ fontWeight: 600 }} />
          ) : (
            <Chip label='Base' size='small' variant='outlined' />
          )}
          {row.useCustomLimits && (
            <Typography variant='caption' sx={{ fontSize: '0.68rem', color: 'warning.main' }}>
              Cupo personalizado
            </Typography>
          )}
        </Box>
      )
    }
  },
  {
    flex: 0.16,
    minWidth: 150,
    field: 'usersQuota',
    headerName: 'Cupo Usuarios',
    renderCell: ({ row }) => {
      const usersMetric = row.quotaSummary?.users

      return (
        <QuotaProgressBar
          dense
          current={usersMetric ? usersMetric.current : row.activeUsersCount ?? 0}
          max={usersMetric ? usersMetric.max : row.maxUsers ?? 10}
        />
      )
    }
  },
  {
    flex: 0.18,
    minWidth: 165,
    field: 'storageQuota',
    headerName: 'Storage (MB/GB)',
    renderCell: ({ row }) => {
      const storage = row.quotaSummary?.storageMb

      return (
        <QuotaProgressBar
          dense
          current={storage?.current ?? 0}
          max={storage ? storage.max : null}
          formatValue={formatStorageMb}
        />
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 140,
    field: 'aiQuota',
    headerName: 'Consultas IA / Mes',
    renderCell: ({ row }) => {
      const ai = row.quotaSummary?.aiQueries

      return (
        <QuotaProgressBar
          dense
          current={ai?.current ?? 0}
          max={ai ? ai.max : null}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: 'status',
    headerName: 'Estado',
    renderCell: ({ row }) => <StatusChip status={row.status || 'ACTIVE'} />
  },
  {
    flex: 0.06,
    minWidth: 70,
    sortable: false,
    field: 'actions',
    headerName: 'Acciones',
    renderCell: ({ row }) => (
      <RowOptions
        row={row}
        onEditClick={handlers.onEditClick}
        onStatusToggle={handlers.onStatusToggle}
        onDeleteClick={handlers.onDeleteClick}
      />
    )
  }
]

