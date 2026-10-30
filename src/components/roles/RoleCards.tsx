// ** React Imports
import { useEffect, useState, useContext } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'


import useApi from 'src/hooks/useApi'
import { CircularProgress } from '@mui/material'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import ConfirmDialog from 'src/@core/components/dialogs/ConfirmDialog'
import RoleCardItem from 'src/components/roles/RoleCardItem'
import RoleEditModal from 'src/components/roles/RoleEditModal'
import toast from 'react-hot-toast'

const RolesCards = () => {
  // ** States
  const [open, setOpen] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null)
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const api = useApi('role')
  const permissionsApi = useApi('permissions')
  const ability = useContext(AbilityContext)

  const [permissionsList, setPermissionsList] = useState<any[]>([])
  const [editingRole, setEditingRole] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const data = await api.getAll()
      setRoles(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchPermissions = async () => {
    try {
      const data = await permissionsApi.getAll()

      // El backend puede devolver un array o un paginado, aseguramos array
      setPermissionsList(Array.isArray(data) ? data : data?.data || [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchRoles()
    fetchPermissions()

    const handleRolesUpdated = () => {
      fetchRoles()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('roles:updated', handleRolesUpdated)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('roles:updated', handleRolesUpdated)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClose = () => {
    setOpen(false)
    setEditingRole(null)
  }

  const handleEditRole = (role: any) => {
    setEditingRole(role)
    setOpen(true)
  }

  const handleAddRole = () => {
    setEditingRole(null)
    setOpen(true)
  }

  const handleDeleteRole = (roleId: number) => {
    setRoleToDelete(roleId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteRole = async () => {
    if (!roleToDelete) return
    try {
      await api.remove(roleToDelete)
      toast.success('Rol eliminado correctamente')
      fetchRoles()
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar el rol')
    } finally {
      setDeleteDialogOpen(false)
      setRoleToDelete(null)
    }
  }

  const handleModalSubmit = async (mode: 'Agregar' | 'Editar', roleId: number | null, payload: any) => {
    try {
      setIsSaving(true)

      if (mode === 'Editar' && roleId) {
        await api.update(roleId, payload)
        toast.success('Rol actualizado correctamente')
      } else {
        await api.create(payload)
        toast.success('Rol creado correctamente')
      }

      handleClose()
      fetchRoles()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Error al procesar el rol')
    } finally {
      setIsSaving(false)
    }
  }

  const renderCards = () =>
    roles.map((item, index: number) => (
      <RoleCardItem key={index} role={item} onEdit={handleEditRole} onDelete={handleDeleteRole} />
    ))

  if (loading) return <CircularProgress />

  return (
    <Grid container spacing={6} className='match-height'>
      {renderCards()}
      {ability?.can('create', 'roles') && (
      <Grid item xs={12} sm={6} lg={4}>
        <Card
          sx={{ cursor: 'pointer' }}
          onClick={handleAddRole}
        >
          <Grid container sx={{ height: '100%' }}>
            <Grid item xs={5}>
              <Box
                sx={{
                  height: '100%',
                  minHeight: 140,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}
              >
                <img height={122} alt='add-role' src='/images/pages/add-new-role-illustration.png' />
              </Box>
            </Grid>
            <Grid item xs={7}>
              <CardContent sx={{ pl: 0, height: '100%' }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Button
                    variant='contained'
                    sx={{ whiteSpace: 'nowrap' }}
                    onClick={handleAddRole}
                  >
                    Agregar Rol
                  </Button>
                  <Typography sx={{ color: 'text.secondary' }}>Agrega un nuevo rol al sistema.</Typography>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      )}
      <RoleEditModal
        open={open}
        onClose={handleClose}
        role={editingRole}
        permissionsList={permissionsList}
        isSaving={isSaving}
        onSubmit={handleModalSubmit}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteRole}
        title='¿Eliminar rol?'
        content='¿Estás seguro de que quieres eliminar este rol? Los usuarios que lo tengan asignado quedarán sin rol (perderán sus accesos) hasta que les asignes uno nuevo.'
        confirmText='Eliminar'
        cancelText='Cancelar'
        color='error'
      />
    </Grid>
  )
}

export default RolesCards
