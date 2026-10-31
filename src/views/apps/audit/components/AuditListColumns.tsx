import React from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { GridColDef } from '@mui/x-data-grid'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import { ThemeColor } from 'src/@core/layouts/types'
import { getInitials } from 'src/@core/utils/get-initials'
import DateTimeCell from '../components/DateTimeCell'
import { actionColors, actionLabels, formatEntityCategory } from '../utils/auditFormatters'

const userRoleObj: Record<string, { icon: string; color: ThemeColor }> = {
  company_admin: { icon: 'tabler:building-shield', color: 'secondary' },
  admin: { icon: 'tabler:device-laptop', color: 'secondary' },
  superadmin: { icon: 'tabler:star', color: 'error' },
  user: { icon: 'tabler:user', color: 'primary' }
}

const renderActorAvatar = (user: any) => {
  const imgSrc = user?.image
    ? user.image.startsWith('http')
      ? user.image
      : `${process.env.NEXT_PUBLIC_API_URL}/images/users/${user.image}`
    : user?.avatar || null

  if (imgSrc) {
    return <CustomAvatar src={imgSrc} sx={{ mr: 2.5, width: 38, height: 38 }} />
  }

  return (
    <CustomAvatar
      color='primary'
      sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
    >
      {getInitials(user?.name ? `${user.name} ${user.lastName || ''}`.trim() : 'Sistema')}
    </CustomAvatar>
  )
}

export const buildAuditColumns = (
  onOpenDetail: (row: any) => void,
  canViewUsers: boolean
): GridColDef[] => [
  {
    flex: 0.1,
    minWidth: 110,
    field: 'createdAt',
    headerName: 'Fecha',
    renderCell: ({ row }) => <DateTimeCell value={row.createdAt} />
  },
  {
    flex: 0.22,
    minWidth: 230,
    field: 'userName',
    headerName: 'Usuario',
    renderCell: ({ row }) => {
      const name = row.user ? `${row.user.name || ''} ${row.user.lastName || ''}`.trim() : null
      const displayName = row.userName || name || (row.userId ? `ID: ${row.userId}` : 'Sistema')
      const email = row.user?.email || '-'

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderActorAvatar(row.user)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            {canViewUsers && row.userId ? (
              <Typography
                noWrap
                component={Link}
                href={`/user/${row.userId}`}
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {displayName}
              </Typography>
            ) : (
              <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                {displayName}
              </Typography>
            )}
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.14,
    field: 'role',
    minWidth: 150,
    headerName: 'Rol',
    renderCell: ({ row }) => {
      const role = row.user?.role
      const roleName = role?.name || 'Operador'
      const roleSlug = role?.slug || 'user'

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar
            sx={{ mr: 3, width: 30, height: 30 }}
            color={userRoleObj[roleSlug]?.color || 'primary'}
          >
            <Icon icon={userRoleObj[roleSlug]?.icon || 'tabler:user'} />
          </CustomAvatar>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {roleName}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.12,
    minWidth: 135,
    field: 'action',
    headerName: 'Acción',
    renderCell: ({ row }) => (
      <CustomChip
        rounded
        size='small'
        label={actionLabels[row.action] || row.actionLabel || row.action}
        color={(actionColors[row.action] as any) || 'primary'}
        sx={{ fontWeight: 600 }}
      />
    )
  },
  {
    flex: 0.15,
    minWidth: 155,
    field: 'entity',
    headerName: 'Categoría',
    renderCell: ({ row }) => (
      <CustomChip
        rounded
        size='small'
        color='secondary'
        label={formatEntityCategory(row.entity)}
        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
      />
    )
  },
  {
    flex: 0.28,
    minWidth: 240,
    field: 'description',
    headerName: 'Descripción',
    renderCell: ({ row }) => (
      <Typography noWrap sx={{ color: 'text.secondary' }}>
        {row.description}
      </Typography>
    )
  },
  {
    flex: 0.08,
    minWidth: 80,
    sortable: false,
    field: 'actions',
    headerName: 'Acciones',
    renderCell: ({ row }) => (
      <Tooltip title='Detalle'>
        <IconButton size='small' color='primary' onClick={() => onOpenDetail(row)}>
          <Icon icon='tabler:eye' fontSize={20} />
        </IconButton>
      </Tooltip>
    )
  }
]

