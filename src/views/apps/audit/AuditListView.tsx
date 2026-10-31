import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import useApi from 'src/hooks/useApi'
import { useAuth } from 'src/hooks/useAuth'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import AuditDetailModal from './components/AuditDetailModal'
import { buildAuditColumns } from './components/AuditListColumns'
import TableSearchInput from 'src/components/common/TableSearchInput'

const TENANT_CATEGORY_OPTIONS = [
  { value: '', label: 'Todas las categorías' },
  { value: 'Document', label: 'Documentos PDF' },
  { value: 'User', label: 'Usuarios' },
  { value: 'Role', label: 'Roles' }
]

const PLATFORM_CATEGORY_OPTIONS = [
  { value: '', label: 'Todas las categorías' },
  { value: 'Company', label: 'Empresas' },
  { value: 'Plan', label: 'Planes y Cupos' },
  { value: 'Permission', label: 'Permisos' },
  { value: 'Notification', label: 'Notificaciones' }
]

const AuditListView = ({ companyId }: { companyId?: number }) => {
  const { user } = useAuth()
  const ability = useContext(AbilityContext)
  const isSuperAdmin =
    user?.role === 'superadmin' || String(user?.username || '').toLowerCase() === 'superadmin'
  const canViewUsers = Boolean(!isSuperAdmin && ability?.can('read', 'users'))

  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [actionFilter, setActionFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false)
  const [selectedAudit, setSelectedAudit] = useState<any | null>(null)

  const api = useApi('audit')
  const categoryOptions = isSuperAdmin ? PLATFORM_CATEGORY_OPTIONS : TENANT_CATEGORY_OPTIONS

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
      if (isSuperAdmin && companyId) params.companyId = companyId

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
  }, [api, paginationModel, actionFilter, categoryFilter, searchFilter, companyId, isSuperAdmin])

  useEffect(() => {
    fetchAudits()
  }, [fetchAudits])

  const columns = useMemo(
    () =>
      buildAuditColumns(row => {
        setSelectedAudit(row)
        setDetailModalOpen(true)
      }, canViewUsers),
    [canViewUsers]
  )

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={isSuperAdmin ? 'Auditoría de Plataforma' : 'Auditoría de la Compañía'}
            subheader={
              isSuperAdmin
                ? 'Registro trazable de empresas, planes, permisos y eventos globales'
                : 'Movimientos exclusivos realizados por los usuarios de su empresa'
            }
          />
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
                    <MenuItem value='DELETE'>Eliminación (DELETE)</MenuItem>
                    {!isSuperAdmin && <MenuItem value='UPLOAD'>Carga de PDF (UPLOAD)</MenuItem>}
                    {!isSuperAdmin && (
                      <MenuItem value='PROCESS_DOCUMENT'>Extracción IA (PROCESS_DOCUMENT)</MenuItem>
                    )}
                    {!isSuperAdmin && <MenuItem value='AI_QUERY'>Consulta IA (AI_QUERY)</MenuItem>}
                    <MenuItem value='STATUS_CHANGE'>Cambio de Estado</MenuItem>
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
                    {categoryOptions.map(cat => (
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

      <AuditDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        audit={selectedAudit}
      />
    </Grid>
  )
}

export default AuditListView
