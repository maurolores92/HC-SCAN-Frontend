// ** React Imports
import { useContext } from 'react'
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

import { UsersType } from 'src/types/apps/userTypes'

interface CellType {
  row: UsersType
}

const renderClient = (row: UsersType) => {
  const imgSrc = (row as any).image
    ? ((row as any).image.startsWith('http')
      ? (row as any).image
      : `${process.env.NEXT_PUBLIC_API_URL}/images/users/${(row as any).image}`)
    : (row.avatar?.length ? row.avatar : null)

  if (imgSrc) {
    return <CustomAvatar src={imgSrc} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    const displayName = row.fullName || `${row.name || ''} ${row.lastName || ''}`.trim() || 'Sin Nombre';

    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(displayName)}
      </CustomAvatar>
    )
  }
}

import Tooltip from '@mui/material/Tooltip'

const RowOptions = ({
  id,
  row,
  onEditClick,
  onChangePasswordClick,
  onSignatureClick,
  onDeleteClick,
  onActivateClick
}: {
  id: number | string
  row: UsersType
  onEditClick: (row: UsersType) => void
  onChangePasswordClick: (row: UsersType) => void
  onSignatureClick: (row: UsersType) => void
  onDeleteClick: (id: number | string) => void
  onActivateClick: (id: number | string) => void
}) => {
  const ability = useContext(AbilityContext)
  const { user } = useAuth()

  const isSuperAdmin = user?.role === 'superadmin'
  const canUpdate = ability?.can('update', 'users') || isSuperAdmin
  const canDelete = ability?.can('delete', 'users') || isSuperAdmin

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
      <Tooltip title='Ver usuario' arrow>
        <IconButton
          size='small'
          component={Link}
          href={`/user/${id}`}
          sx={{ color: 'info.main' }}
        >
          <Icon icon='tabler:eye' fontSize={18} />
        </IconButton>
      </Tooltip>

      {canUpdate && (
        <Tooltip title='Editar usuario' arrow>
          <IconButton
            size='small'
            onClick={() => onEditClick(row)}
            sx={{ color: 'primary.main' }}
          >
            <Icon icon='tabler:edit' fontSize={18} />
          </IconButton>
        </Tooltip>
      )}

      {canUpdate && (
        <Tooltip title='Cambiar contraseña' arrow>
          <IconButton
            size='small'
            onClick={() => onChangePasswordClick(row)}
            sx={{ color: 'warning.main' }}
          >
            <Icon icon='tabler:key' fontSize={18} />
          </IconButton>
        </Tooltip>
      )}

      {canUpdate && (
        <Tooltip title='Gestionar firma digital' arrow>
          <IconButton
            size='small'
            onClick={() => onSignatureClick(row)}
            sx={{ color: 'secondary.main' }}
          >
            <Icon icon='tabler:signature' fontSize={18} />
          </IconButton>
        </Tooltip>
      )}

      {row.status === 'INACTIVE' ? (
        canUpdate && (
          <Tooltip title='Activar usuario' arrow>
            <IconButton
              size='small'
              onClick={() => onActivateClick(id)}
              sx={{ color: 'success.main' }}
            >
              <Icon icon='tabler:user-check' fontSize={18} />
            </IconButton>
          </Tooltip>
        )
      ) : (
        canDelete && (
          <Tooltip title='Inactivar usuario' arrow>
            <IconButton
              size='small'
              onClick={() => onDeleteClick(id)}
              sx={{ color: 'error.main' }}
            >
              <Icon icon='tabler:ban' fontSize={18} />
            </IconButton>
          </Tooltip>
        )
      )}
    </Box>
  )
}

export const getColumns = (
  onEditClick: (row: UsersType) => void,
  onChangePasswordClick: (row: UsersType) => void,
  onSignatureClick: (row: UsersType) => void,
  onDeleteClick: (id: number | string) => void,
  onActivateClick: (id: number | string) => void
): GridColDef[] => [
    {
      flex: 0.25,
      minWidth: 280,
      field: 'fullName',
      headerName: 'Usuario',
      renderCell: ({ row }: CellType) => {
        const { username } = row
        const displayName = row.fullName || `${row.name || ''} ${row.lastName || ''}`.trim() || 'Sin Nombre';

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component={Link}
                href={`/user/${row.id}`}
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {displayName}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                @{username}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      headerName: 'Telefono',
      field: 'phone',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row.phone || row.contact || '-'}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      headerName: 'Documento',
      field: 'document',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row.document || '-'}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'createdAt',
      headerName: 'Fecha Alta',
      renderCell: ({ row }: CellType) => {
        const date = row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-';

        return (
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {date}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Estado',
      renderCell: ({ row }: CellType) => {
        const statusLabel = row.statusInfo?.label || row.status
        const statusColor = row.statusInfo?.color || 'primary'

        return (
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={statusLabel}
            color={statusColor}
            sx={{ textTransform: 'capitalize' }}
          />
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 170,
      sortable: false,
      field: 'actions',
      headerName: 'Acciones',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: CellType) => (
        <RowOptions id={row.id} row={row} onEditClick={onEditClick} onChangePasswordClick={onChangePasswordClick} onSignatureClick={onSignatureClick} onDeleteClick={onDeleteClick} onActivateClick={onActivateClick} />
      )
    }
  ]
