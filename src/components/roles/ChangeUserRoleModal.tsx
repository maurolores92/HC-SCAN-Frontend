// ** React Imports
import React, { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'

// ** Custom Core Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import { getInitials } from 'src/@core/utils/get-initials'

// ** API Connector & Types
import apiConnector from 'src/services/api.service'
import { UsersType } from 'src/types/apps/userTypes'
import toast from 'react-hot-toast'

interface Props {
  open: boolean
  onClose: () => void
  user: UsersType | null
  onSuccess?: () => void
}

interface RoleItem {
  id: number
  name: string
  slug: string
  description?: string
  usersCount?: number
}

// Helper para identificar y ocultar estrictamente roles de superadmin
const isSuperAdminRole = (role: any): boolean => {
  const slug = String(role?.slug || '').toLowerCase().trim()
  const name = String(role?.name || '').toLowerCase().trim()

  return (
    slug === 'superadmin' ||
    slug === 'super-admin' ||
    slug === 'super_admin' ||
    name === 'superadmin' ||
    name === 'super administrador' ||
    name === 'super admin'
  )
}

export const ChangeUserRoleModal = ({ open, onClose, user, onSuccess }: Props) => {
  const [roles, setRoles] = useState<RoleItem[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<number | string>('')
  const [loadingRoles, setLoadingRoles] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Cargar lista de roles disponibles, filtrando estrictamente el rol de superadmin
  const fetchRoles = useCallback(async () => {
    try {
      setLoadingRoles(true)
      const res: any = await apiConnector.get('/role')
      const list: RoleItem[] = Array.isArray(res) ? res : (res?.data || [])

      // Ocultar permanentemente cualquier variación de superadmin
      const filtered = list.filter(r => !isSuperAdminRole(r))
      setRoles(filtered)
    } catch {
      toast.error('Error al cargar la lista de roles')
    } finally {
      setLoadingRoles(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      fetchRoles()
      const currentRoleId = user?.roleId || (user?.role as any)?.id || ''
      setSelectedRoleId(currentRoleId)
    }
  }, [open, user, fetchRoles])

  if (!user) return null

  const userFullName =
    user.fullName ||
    [user.name, user.lastName].filter(Boolean).join(' ') ||
    user.username ||
    'Usuario'

  const currentRoleName =
    (user.role as any)?.name ||
    (typeof user.role === 'string' ? user.role : null) ||
    'Sin Rol Asignado'

  const currentRoleId = user?.roleId || (user?.role as any)?.id || null

  const handleSubmit = async () => {
    if (!selectedRoleId) {
      toast.error('Por favor selecciona un rol')

      return
    }

    try {
      setIsSubmitting(true)
      await apiConnector.put(`/users/${user.id}`, {
        roleId: Number(selectedRoleId),
      })

      const selectedRoleObj = roles.find(r => r.id === Number(selectedRoleId))
      toast.success(`Rol de ${userFullName} actualizado a "${selectedRoleObj?.name || 'Nuevo Rol'}"`)

      // Notificar a componentes externos (ej. RoleCards) para refrescar contadores
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('roles:updated'))
      }

      onSuccess?.()
      onClose()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al actualizar el rol del usuario'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isSameRole = Number(selectedRoleId) === Number(currentRoleId)

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              p: 1,
              borderRadius: 2,
              backgroundColor: 'rgba(156, 39, 176, 0.12)',
              color: '#9C27B0',
            }}
          >
            <Icon icon='tabler:user-check' fontSize={24} />
          </Box>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>
              Cambiar Rol de Usuario
            </Typography>
            <Typography variant='caption' sx={{ color: 'text.secondary' }}>
              Actualiza los permisos de acceso del usuario
            </Typography>
          </Box>
        </Box>
        <IconButton size='small' onClick={onClose} disabled={isSubmitting}>
          <Icon icon='tabler:x' fontSize={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 4 }}>
        {/* Tarjeta del Usuario Seleccionado */}
        <Card
          variant='outlined'
          sx={{
            p: 2.5,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 2,
            backgroundColor: theme =>
              theme.palette.mode === 'light' ? '#FAFAFA' : '#1E1B2E',
          }}
        >
          {user.avatar ? (
            <CustomAvatar src={user.avatar} sx={{ width: 44, height: 44 }} />
          ) : (
            <CustomAvatar
              skin='light'
              color='primary'
              sx={{ width: 44, height: 44, fontWeight: 700 }}
            >
              {getInitials(userFullName)}
            </CustomAvatar>
          )}

          <Box sx={{ overflow: 'hidden', flex: 1 }}>
            <Typography variant='subtitle1' noWrap sx={{ fontWeight: 700 }}>
              {userFullName}
            </Typography>
            <Typography variant='body2' noWrap sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 0.5 }}>
              {user.email}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                Rol actual:
              </Typography>
              <CustomChip
                rounded
                size='small'
                color='primary'
                label={currentRoleName}
                sx={{ fontWeight: 700, fontSize: '0.72rem', height: 20 }}
              />
            </Box>
          </Box>
        </Card>

        {/* Selector de Nuevo Rol */}
        {loadingRoles ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: '#9C27B0' }} />
          </Box>
        ) : (
          <FormControl fullWidth size='small'>
            <InputLabel id='select-new-role-label'>Nuevo Rol</InputLabel>
            <Select
              labelId='select-new-role-label'
              value={selectedRoleId}
              label='Nuevo Rol'
              onChange={e => setSelectedRoleId(e.target.value)}
              disabled={isSubmitting}
            >
              {roles.map(role => (
                <MenuItem key={role.id} value={role.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      {role.name}
                    </Typography>
                    {Number(role.id) === Number(currentRoleId) && (
                      <CustomChip
                        rounded
                        size='small'
                        color='secondary'
                        label='Actual'
                        sx={{ fontSize: '0.7rem', height: 18 }}
                      />
                    )}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 2.5, justifyContent: 'flex-end', gap: 1.5 }}>
        <Button variant='tonal' color='secondary' onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSubmit}
          disabled={!selectedRoleId || isSameRole || isSubmitting || loadingRoles}
          startIcon={isSubmitting ? <CircularProgress size={16} color='inherit' /> : <Icon icon='tabler:check' />}
          sx={{ fontWeight: 700, px: 3 }}
        >
          {isSubmitting ? 'Guardando...' : 'Cambiar Rol'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChangeUserRoleModal
