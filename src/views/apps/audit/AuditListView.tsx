import React, { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import useApi from 'src/hooks/useApi'
import DateTimeCell from './components/DateTimeCell'
import AuditDetailModal from './components/AuditDetailModal'
import TableSearchInput from 'src/components/common/TableSearchInput'

// ** Utils & Formatters
import { actionColors, actionLabels, formatEntityCategory } from './utils/auditFormatters'
import { getInitials } from 'src/@core/utils/get-initials'

// ** Next Imports
import Link from 'next/link'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

interface UserRoleType {
  [key: string]: { icon: string; color: string }
}

const userRoleObj: UserRoleType = {
  admin: { icon: 'tabler:device-laptop', color: 'secondary' },
  author: { icon: 'tabler:circle-check', color: 'success' },
  editor: { icon: 'tabler:edit', color: 'info' },
  maintainer: { icon: 'tabler:chart-pie-2', color: 'primary' },
  subscriber: { icon: 'tabler:user', color: 'warning' },
  superadmin: { icon: 'tabler:star', color: 'error' },
  tecnico: { icon: 'tabler:tool', color: 'warning' },
  user: { icon: 'tabler:user', color: 'primary' }
}

const auditCategoryOptions = [
  { value: '', label: 'Todas las categorías' },
  { value: 'ServiceOrder', label: 'Órdenes de servicio' },
  { value: 'Machine', label: 'Equipos' },
  { value: 'MachineLocation', label: 'Movimientos de equipo' },
  { value: 'DeviceModel', label: 'Modelos de equipo' },
  { value: 'Brand', label: 'Marcas' },
  { value: 'MachineType', label: 'Tipos de equipo' },
  { value: 'Client', label: 'Clientes' },
  { value: 'User', label: 'Usuarios' },
  { value: 'Role', label: 'Roles' },
  { value: 'Permission', label: 'Permisos' },
  { value: 'Problem', label: 'Problemas técnicos' },
  { value: 'Company', label: 'Empresas' },
  { value: 'Branch', label: 'Sucursales' },
  { value: 'Notification', label: 'Notificaciones' }
]

const renderClient = (user: any) => {
  const imgSrc = user?.image
    ? (user.image.startsWith('http') ? user.image : `${process.env.NEXT_PUBLIC_API_URL}/images/users/${user.image}`)
    : (user?.avatar || null)

  if (imgSrc) {
    return <CustomAvatar src={imgSrc} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        color={'primary'}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(user?.name ? `${user.name} ${user.lastName || ''}`.trim() : 'Sistema')}
      </CustomAvatar>
    )
  }
}

const AuditListView = ({ companyId }: { companyId?: number }) => {
  // ** State
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  // Pagination & Filters
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [actionFilter, setActionFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  // Modal de Detalle de Auditoría
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false)
  const [selectedAudit, setSelectedAudit] = useState<any | null>(null)

  const handleOpenDetail = (row: any) => {
    setSelectedAudit(row)
    setDetailModalOpen(true)
  }

  const api = useApi('audit')

  const fetchAudits = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = {
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize
      }
      if (actionFilter) params.action = actionFilter
      if (categoryFilter) params.entity = categoryFilter
      if (searchFilter) params.search = searchFilter
      if (companyId) params.companyId = companyId

      const response: any = await api.getAll(params)

      if (response && response.data) {
        setData(response.data)
        setTotal(response.total || response.data.length)
      } else if (Array.isArray(response)) {
        setData(response)
        setTotal(response.length)
      }
    } catch (error) {
      console.error('Error fetching audits:', error)
    } finally {
      setLoading(false)
    }
  }, [api, paginationModel, actionFilter, categoryFilter, searchFilter, companyId])

  useEffect(() => {
    fetchAudits()
  }, [fetchAudits])

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 105,
      field: 'createdAt',
      headerName: 'Fecha',
      renderCell: ({ row }) => <DateTimeCell value={row.createdAt} />
    },
    {
      flex: 0.22,
      minWidth: 240,
      field: 'userName',
      headerName: 'Usuario',
      renderCell: ({ row }) => {
        const name = row.user ? `${row.user.name || ''} ${row.user.lastName || ''}`.trim() : null
        const displayName = row.userName || name || (row.userId ? `ID: ${row.userId}` : 'Sistema')
        const email = row.user?.email || '-'

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row.user)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component={Link}
                href={row.userId ? `/user/${row.userId}` : '#'}
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
        const roleName = role?.name || 'Sin Rol'
        const roleSlug = role?.slug || 'user'

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar
              sx={{ mr: 3, width: 30, height: 30 }}
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
      flex: 0.12,
      minWidth: 130,
      field: 'action',
      headerName: 'Acción',
      renderCell: ({ row }) => {
        return (
          <CustomChip
            rounded
            size='small'
            label={actionLabels[row.action] || row.actionLabel || row.action}
            color={(actionColors[row.action] as any) || 'primary'}
            sx={{ fontWeight: 600 }}
          />
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 160,
      field: 'entity',
      headerName: 'Categoría',
      renderCell: ({ row }) => {
        return (
          <CustomChip
            rounded
            size='small'
            color='secondary'
            label={formatEntityCategory(row.entity)}
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          />
        )
      }
    },
    {
      flex: 0.28,
      minWidth: 240,
      field: 'description',
      headerName: 'Descripción',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row.description}
          </Typography>
        )
      }
    },
    {
      flex: 0.08,
      minWidth: 80,
      sortable: false,
      field: 'actions',
      headerName: 'Acciones',
      renderCell: ({ row }) => (
        <Tooltip title='Detalle'>
          <IconButton size='small' color='primary' onClick={() => handleOpenDetail(row)}>
            <Icon icon='tabler:eye' fontSize={20} />
          </IconButton>
        </Tooltip>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Filtros de Auditoría' />
          <CardContent>
            <Grid container spacing={6} alignItems='center'>
              <Grid item lg={3} sm={6} xs={12}>
                <TableSearchInput
                  fullWidth
                  label='Buscar'
                  placeholder='Usuario, descripción, ID...'
                  value={searchFilter}
                  onChange={val => {
                    setSearchFilter(val)
                    setPaginationModel(prev => ({ ...prev, page: 0 }))
                  }}
                />
              </Grid>
              <Grid item lg={3} sm={6} xs={12}>
                <FormControl fullWidth size='small'>
                  <InputLabel id='action-select'>Acción</InputLabel>
                  <Select
                    fullWidth
                    value={actionFilter}
                    id='select-action'
                    label='Acción'
                    labelId='action-select'
                    onChange={e => {
                      setActionFilter(e.target.value)
                      setPaginationModel(prev => ({ ...prev, page: 0 }))
                    }}
                  >
                    <MenuItem value=''>Todas las acciones</MenuItem>
                    <MenuItem value='CREATE'>Creación (CREATE)</MenuItem>
                    <MenuItem value='UPDATE'>Modificación (UPDATE)</MenuItem>
                    <MenuItem value='STATUS_CHANGE'>Cambio de Estado</MenuItem>
                    <MenuItem value='CATEGORY_CHANGE'>Cambio de Categoría</MenuItem>
                    <MenuItem value='PRIORITY_CHANGE'>Cambio de Prioridad</MenuItem>
                    <MenuItem value='TECHNICIAN_ASSIGNMENT'>Asignación de Técnico</MenuItem>
                    <MenuItem value='ITEM_ADDED'>Repuesto Agregado</MenuItem>
                    <MenuItem value='ITEM_REMOVED'>Repuesto Eliminado</MenuItem>
                    <MenuItem value='ITEM_RETURNED'>Repuesto Devuelto</MenuItem>
                    <MenuItem value='MACHINE_LOCATION_CHANGE'>Movimiento de Equipo</MenuItem>
                    <MenuItem value='DELETE'>Eliminación (DELETE)</MenuItem>
                    <MenuItem value='LOGIN'>Inicio de Sesión (LOGIN)</MenuItem>
                    <MenuItem value='LOGOUT'>Cierre de Sesión (LOGOUT)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item lg={3} sm={6} xs={12}>
                <FormControl fullWidth size='small'>
                  <InputLabel id='category-select'>Categoría</InputLabel>
                  <Select
                    fullWidth
                    value={categoryFilter}
                    id='select-category'
                    label='Categoría'
                    labelId='category-select'
                    onChange={e => {
                      setCategoryFilter(e.target.value)
                      setPaginationModel(prev => ({ ...prev, page: 0 }))
                    }}
                  >
                    {auditCategoryOptions.map(cat => (
                      <MenuItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {(searchFilter || actionFilter || categoryFilter) && (
                <Grid item lg={3} sm={6} xs={12}>
                  <Button
                    variant='tonal'
                    color='secondary'
                    size='small'
                    startIcon={<Icon icon='tabler:filter-off' />}
                    onClick={() => {
                      setSearchFilter('')
                      setActionFilter('')
                      setCategoryFilter('')
                      setPaginationModel(prev => ({ ...prev, page: 0 }))
                    }}
                  >
                    Limpiar Filtros
                  </Button>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <DataGrid
            autoHeight
            pagination
            rows={data}
            rowCount={total}
            columns={columns}
            loading={loading}
            checkboxSelection={false}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            paginationMode='server'
          />
        </Card>
      </Grid>

      {/* Modal de Detalle de Auditoría */}
      <AuditDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        audit={selectedAudit}
      />
    </Grid>
  )
}

export default AuditListView
