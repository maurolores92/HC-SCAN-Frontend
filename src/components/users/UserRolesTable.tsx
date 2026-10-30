import React, { useState } from 'react'
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import TableHeader from 'src/components/roles/TableHeader'
import Tooltip from '@mui/material/Tooltip'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Config Imports
import { statusColors } from 'src/configs/statusColors'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

export interface UserRolesTableProps {
  data: any[]
  value: string
  handleFilter: (val: string) => void
  onAssignRole?: (row: any) => void
  onChangeRole?: (row: any) => void
}

interface UserRoleType {
  [key: string]: { icon: string; color: string }
}

const userRoleObj: UserRoleType = {
  editor: { icon: 'tabler:edit', color: 'info' },
  author: { icon: 'tabler:user', color: 'warning' },
  admin: { icon: 'tabler:device-laptop', color: 'error' },
  maintainer: { icon: 'tabler:chart-pie-2', color: 'success' },
  subscriber: { icon: 'tabler:circle-check', color: 'primary' }
}

const userStatusLabels: Record<string, string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  PENDING: 'Pendiente',
  active: 'Activo',
  inactive: 'Inactivo',
  pending: 'Pendiente',
  blocked: 'Bloqueado',
  BLOCKED: 'Bloqueado',
}

const renderClient = (row: any) => {
  const fullName = row.fullName || [row.name, row.lastName].filter(Boolean).join(' ') || 'John Doe'
  const imgSrc = (row as any).image
    ? ((row as any).image.startsWith('http')
      ? (row as any).image
      : `${process.env.NEXT_PUBLIC_API_URL}/images/users/${(row as any).image}`)
    : (row.avatar && row.avatar.length ? row.avatar : null)

  if (imgSrc) {
    return <CustomAvatar src={imgSrc} sx={{ mr: 3, width: 38, height: 38 }} />


  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(fullName)}
      </CustomAvatar>
    )
  }
}

const UserRolesTable: React.FC<UserRolesTableProps> = ({ data, value, handleFilter, onChangeRole }) => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 280,
      field: 'fullName',
      headerName: 'Usuario',
      renderCell: ({ row }) => {
        const { email } = row
        const fullName = (row as any).fullName || [(row as any).name, (row as any).lastName].filter(Boolean).join(' ') || 'Unknown User'

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
                {fullName}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'role',
      minWidth: 170,
      headerName: 'Rol',
      renderCell: ({ row }) => {
        const roleName = row.role?.name || row.role || 'Sin Rol'
        const roleSlug = row.role?.slug || 'none'

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar
              skin='light'
              sx={{ mr: 4, width: 30, height: 30 }}
              color={(userRoleObj[roleSlug]?.color as ThemeColor) || 'primary'}
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
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Estado',
      renderCell: ({ row }) => {
        const statusLabel = userStatusLabels[row.status] || row.status || 'Activo'

        return (
          <CustomChip
            size='small'
            label={statusLabel}
            color={statusColors[row.status] || 'primary'}
            sx={{ fontWeight: 600 }}
          />
        )
      }
    },
    {
      flex: 0.12,
      minWidth: 120,
      sortable: false,
      field: 'actions',
      headerName: 'Acciones',
      renderCell: ({ row }) => {
        const isSuperAdminUser =
          String(row.username || '').toLowerCase() === 'superadmin' ||
          String(row.role?.slug || '').toLowerCase() === 'superadmin' ||
          String(row.role || '').toLowerCase() === 'superadmin'

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {!isSuperAdminUser && onChangeRole && (
              <Tooltip title={row.role ? 'Cambiar Rol' : 'Asignar Rol'}>
                <IconButton
                  size='small'
                  color={row.role ? 'primary' : 'warning'}
                  onClick={() => onChangeRole(row)}
                >
                  <Icon icon={row.role ? 'tabler:user-check' : 'tabler:shield-check'} fontSize={20} />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title='Ver detalle de usuario'>
              <IconButton size='small' component={Link} href={`/user/${row.id}`} color='info'>
                <Icon icon='tabler:eye' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    }
  ]

  return (
    <Card>
      <TableHeader value={value} handleFilter={handleFilter} />

      <DataGrid
        autoHeight
        rowHeight={62}
        rows={data}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
  )
}

export default UserRolesTable
