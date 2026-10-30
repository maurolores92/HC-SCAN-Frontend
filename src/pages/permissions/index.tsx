// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import useApi from 'src/hooks/useApi'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import AssignRoleModal from 'src/components/permissions/AssignRoleModal'
import PermissionsDataGrid from 'src/components/permissions/PermissionsDataGrid'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'

// ** Actions Imports
import { fetchData } from 'src/store/apps/permissions'
import toast from 'react-hot-toast'


const PermissionsTable = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)
  const [selectedPermission, setSelectedPermission] = useState<any>(null)

  const [roles, setRoles] = useState<any[]>([])
  const [loadingRoles, setLoadingRoles] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.permissions)
  const roleApi = useApi('role')
  const permissionsApi = useApi('permissions')

  // Fetch Roles
  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true)
      try {
        const data = await roleApi.getAll()
        const filteredRoles = (data as any[] || []).filter((r: any) => r.slug !== 'admin' && r.slug !== 'superadmin')
        setRoles(filteredRoles)
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingRoles(false)
      }
    }
    fetchRoles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(
      fetchData({
        q: value
      })
    )
  }, [dispatch, value])

  const [moduleValue, setModuleValue] = useState<string>('')

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleModuleFilter = useCallback((val: string) => {
    setModuleValue(val)
  }, [])

  const handleEditPermission = (row: any) => {
    setSelectedPermission(row)
    setEditDialogOpen(true)
  }

  const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen)

  const handleModalSubmit = async (permissionId: number, data: { displayName: string; description: string; roleIds: number[] }) => {
    try {
      setIsUpdating(true)
      await permissionsApi.update(permissionId, data)
      toast.success('Permiso actualizado correctamente')
      setEditDialogOpen(false)

      // Refrescar tabla
      dispatch(fetchData({ q: value }))
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Error al actualizar el permiso')
    } finally {
      setIsUpdating(false)
    }
  }

  // Obtener módulos (categorías) únicos
  const uniqueModules = Array.from(new Set(store.data.map((p: any) => p.categoria))).filter(Boolean) as string[]

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <PageHeader
            title={
              <Typography variant='h4' sx={{ mb: 6 }}>
                Lista de permisos
              </Typography>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <PermissionsDataGrid
            data={store.data}
            value={value}
            moduleValue={moduleValue}
            handleFilter={handleFilter}
            handleModuleFilter={handleModuleFilter}
            modules={uniqueModules}
            onEditPermission={handleEditPermission}
          />
        </Grid>
      </Grid>

      <AssignRoleModal
        open={editDialogOpen}
        onClose={handleDialogToggle}
        permission={selectedPermission}
        roles={roles}
        loadingRoles={loadingRoles}
        isUpdating={isUpdating}
        onSubmit={handleModalSubmit}
      />
    </>
  )
}

PermissionsTable.acl = {
  action: 'read',
  subject: 'permissions'
}

export default PermissionsTable
