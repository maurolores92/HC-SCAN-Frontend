import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import useApi from 'src/hooks/useApi'
import toast from 'react-hot-toast'
import CompanyModal from './CompanyModal'
import StatusChip from 'src/components/common/StatusChip'
import QuotaProgressBar from 'src/components/common/QuotaProgressBar'
import ConfirmActionDialog from 'src/components/common/ConfirmActionDialog'

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
  const rowOptionsOpen = Boolean(anchorEl)

  return (
    <>
      <IconButton size='small' onClick={e => setAnchorEl(e.currentTarget)}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
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
          Ver detalle
        </MenuItem>

        <MenuItem
          onClick={() => {
            setAnchorEl(null)
            onEditClick(row)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:edit' fontSize={18} />
          Editar
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

export const CompaniesListView = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchFilter, setSearchFilter] = useState<string>('')

  // Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null)

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [companyToDelete, setCompanyToDelete] = useState<any | null>(null)

  const api = useApi('companies')

  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    try {
      const response: any = await api.getAll()
      const list = Array.isArray(response) ? response : response?.data || []

      let filteredData = list
      if (searchFilter) {
        const query = searchFilter.toLowerCase()
        filteredData = list.filter(
          (c: any) =>
            c.name?.toLowerCase().includes(query) ||
            c.slug?.toLowerCase().includes(query) ||
            c.taxId?.toLowerCase().includes(query) ||
            c.cuit?.toLowerCase().includes(query)
        )
      }

      setData(filteredData)
    } catch (error) {
      console.error('Error fetching companies:', error)
      toast.error('Error al cargar compañías')
    } finally {
      setLoading(false)
    }
  }, [api, searchFilter])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  const handleStatusToggle = async (company: any) => {
    try {
      const newStatus = company.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED'
      await api.update(company.id, { status: newStatus })
      toast.success(`Compañía ${newStatus === 'ACTIVE' ? 'activada' : 'suspendida'} correctamente`)
      fetchCompanies()
    } catch (error) {
      toast.error('Error al cambiar el estado')
    }
  }

  const confirmDelete = async () => {
    if (!companyToDelete) return
    try {
      await api.remove(companyToDelete.id)
      toast.success('Compañía eliminada correctamente')
      fetchCompanies()
    } catch (error) {
      toast.error('Error al eliminar la compañía')
    } finally {
      setDeleteDialogOpen(false)
      setCompanyToDelete(null)
    }
  }

  const columns: GridColDef[] = [
    {
      flex: 0.28,
      minWidth: 240,
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
              Slug: {row.slug || '-'}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      flex: 0.2,
      minWidth: 180,
      field: 'contact',
      headerName: 'Contacto',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 500 }}>
            {row.email || 'Sin email'}
          </Typography>
          <Typography noWrap variant='caption' sx={{ color: 'text.disabled' }}>
            {row.phone || '-'}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'taxId',
      headerName: 'CUIT / Tax ID',
      renderCell: ({ row }) => (
        <Typography noWrap variant='body2' sx={{ color: 'text.secondary' }}>
          {row.taxId || row.cuit || '-'}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 170,
      field: 'quota',
      headerName: 'Cupo Usuarios',
      renderCell: ({ row }) => (
        <QuotaProgressBar
          dense
          current={row.activeUsersCount ?? 0}
          max={row.maxUsers ?? 10}
        />
      )
    },
    {
      flex: 0.12,
      minWidth: 110,
      field: 'status',
      headerName: 'Estado',
      renderCell: ({ row }) => <StatusChip status={row.status || 'ACTIVE'} />
    },
    {
      flex: 0.08,
      minWidth: 80,
      sortable: false,
      field: 'actions',
      headerName: 'Acciones',
      renderCell: ({ row }) => (
        <RowOptions
          row={row}
          onEditClick={r => {
            setSelectedCompany(r)
            setModalOpen(true)
          }}
          onStatusToggle={handleStatusToggle}
          onDeleteClick={r => {
            setCompanyToDelete(r)
            setDeleteDialogOpen(true)
          }}
        />
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Compañías Clientes (Tenants)'
            subheader='Gestión centralizada de organizaciones, límites de usuarios y módulos asignados'
          />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <TextField
                size='small'
                placeholder='Buscar compañía por nombre, slug o CUIT...'
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                sx={{ minWidth: 320 }}
              />
              <Button
                variant='contained'
                onClick={() => {
                  setSelectedCompany(null)
                  setModalOpen(true)
                }}
                startIcon={<Icon icon='tabler:plus' />}
              >
                Nueva Compañía
              </Button>
            </Box>
          </CardContent>

          <DataGrid
            autoHeight
            rowHeight={64}
            rows={data}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
          />
        </Card>
      </Grid>

      <CompanyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchCompanies}
        companyData={selectedCompany}
      />

      <ConfirmActionDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title='¿Eliminar compañía definitivamente?'
        content={`¿Estás seguro de que deseas eliminar permanentemente "${companyToDelete?.name}"? Esta acción borrará a todos los usuarios, roles y documentos asociados.`}
        confirmText='Sí, purgar compañía'
        cancelText='Cancelar'
        color='error'
      />
    </Grid>
  )
}

export default CompaniesListView
