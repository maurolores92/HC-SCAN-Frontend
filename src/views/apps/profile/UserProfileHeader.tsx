// ** React Imports
import { useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Services & Toast
import apiConnector from 'src/services/api.service'
import toast from 'react-hot-toast'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'

// ** Edit Drawer
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'

// ** Types
import { UsersType } from 'src/types/apps/userTypes'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 135,
  height: 135,
  objectFit: 'cover',
  display: 'block',
  [theme.breakpoints.down('md')]: {
    width: 120,
    height: 120
  }
}))

const statusColorMap: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
  ACTIVE: 'success',
  INACTIVE: 'error',
  SUSPENDED: 'warning'
}

const statusLabelMap: Record<string, string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  SUSPENDED: 'Suspendido'
}

const UserProfileHeader = () => {
  const { user, setUser } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  if (!user) return null

  const fullName = [user.name, user.lastName].filter(Boolean).join(' ') || user.fullName
  const userStatus = user.status
  const profileImgSrc = (user as any).image
    ? ((user as any).image.startsWith('http')
      ? (user as any).image
      : `${process.env.NEXT_PUBLIC_API_URL}/images/users/${(user as any).image}`)
    : (user.avatar || null)

  // Mapear UserDataType → UsersType para el drawer
  const editData: UsersType = {
    id: user.id,
    name: user.name ?? '',
    lastName: user.lastName ?? '',
    fullName,
    email: user.email,
    username: user.username,
    phone: user.phone ?? '',
    role: user.role,
    roleId: (user as any).roleId,
    status: user.status ?? 'ACTIVE',
    avatar: user.avatar ?? '',
    image: (user as any).image ?? null,
    billing: '',
    company: '',
    country: '',
    contact: user.phone ?? '',
    currentPlan: ''
  }

  const handleDirectImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 2MB')

      return
    }

    try {
      setIsUploadingImage(true)
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes: any = await apiConnector.sendFile('/uploads/users', formData)
      const newImage = uploadRes.fileName

      await apiConnector.put(`/users/${user.id}`, { image: newImage })

      setUser({
        ...user,
        image: newImage
      })

      toast.success('Foto de perfil actualizada correctamente')
    } catch (err: any) {
      toast.error(err?.message || 'Error al actualizar la foto de perfil')
    } finally {
      setIsUploadingImage(false)
      event.target.value = ''
    }
  }

  return (
    <>
      <Card>
        {/* Cover banner */}
        <CardMedia
          component='img'
          alt='profile-header'
          image='/images/fondo-helpcopies.jpg'
          sx={{ height: { xs: 150, md: 250 }, objectFit: 'cover' }}
          onError={(e: any) => {
            e.target.style.display = 'none'
          }}
        />

        <CardContent
          sx={{
            pt: 0,
            mt: -10,
            display: 'flex',
            alignItems: 'flex-end',
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}
        >
          {/* Contenedor de Foto de Perfil con botón para cambiar imagen */}
          <Box
            sx={{
              position: 'relative',
              display: 'inline-flex',
              flexShrink: 0,
              mb: { xs: 4, md: 0 }
            }}
          >
            {/* Imagen / Avatar clickeable para vista previa */}
            <Tooltip title={profileImgSrc ? 'Click para ampliar imagen' : ''} arrow>
              <Box
                onClick={() => {
                  if (profileImgSrc) setPreviewOpen(true)
                }}
                sx={{
                  position: 'relative',
                  borderRadius: theme => `${theme.shape.borderRadius}px`,
                  overflow: 'hidden',
                  cursor: profileImgSrc ? 'pointer' : 'default',
                  border: theme => `4px solid ${theme.palette.common.white}`,
                  boxShadow: theme => theme.shadows[4],
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': profileImgSrc
                    ? {
                      transform: 'scale(1.02)',
                      boxShadow: theme => theme.shadows[8]
                    }
                    : {}
                }}
              >
                {profileImgSrc ? (
                  <ProfilePicture src={profileImgSrc} alt={fullName} />
                ) : (
                  <CustomAvatar
                    skin='filled'
                    color='primary'
                    sx={{
                      width: { xs: 120, md: 135 },
                      height: { xs: 120, md: 135 },
                      fontSize: '3rem',
                      fontWeight: 600,
                      borderRadius: 0
                    }}
                  >
                    {getInitials(fullName || user.username)}
                  </CustomAvatar>
                )}
              </Box>
            </Tooltip>

            {/* Icono inferior derecho para cambiar la foto */}
            <Tooltip title='Cambiar foto de perfil' arrow>
              <IconButton
                component='label'
                htmlFor='profile-header-upload-input'
                disabled={isUploadingImage}
                size='small'
                sx={{
                  position: 'absolute',
                  bottom: -6,
                  right: -6,
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  border: theme => `2px solid ${theme.palette.common.white}`,
                  boxShadow: 4,
                  zIndex: 2,
                  width: 38,
                  height: 38,
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                {isUploadingImage ? (
                  <CircularProgress size={18} sx={{ color: 'common.white' }} />
                ) : (
                  <Icon icon='tabler:camera' fontSize='1.25rem' />
                )}
                <input
                  hidden
                  type='file'
                  accept='image/png, image/jpeg, image/webp'
                  onChange={handleDirectImageUpload}
                  id='profile-header-upload-input'
                />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Info */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              ml: { xs: 0, md: 6 },
              alignItems: 'flex-end',
              flexWrap: ['wrap', 'nowrap'],
              justifyContent: ['center', 'space-between']
            }}
          >
            {/* Nombre + datos */}
            <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
              <Typography variant='h5' sx={{ mb: 2.5 }}>
                {fullName}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: ['center', 'flex-start'] }}>
                {/* Rol */}
                {user.role && (
                  <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                    <Icon fontSize='1.25rem' icon='tabler:briefcase' />
                    <Typography sx={{ color: 'text.secondary' }}>{user.role}</Typography>
                  </Box>
                )}

                {/* Email */}
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                  <Icon fontSize='1.25rem' icon='tabler:mail' />
                  <Typography sx={{ color: 'text.secondary' }}>{user.email}</Typography>
                </Box>

                {/* Teléfono */}
                {user.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                    <Icon fontSize='1.25rem' icon='tabler:phone' />
                    <Typography sx={{ color: 'text.secondary' }}>{user.phone}</Typography>
                  </Box>
                )}

                {/* Username */}
                {user.username && (
                  <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                    <Icon fontSize='1.25rem' icon='tabler:at' />
                    <Typography sx={{ color: 'text.secondary' }}>{user.username}</Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Acciones: chip de estado + botón editar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              <Chip
                label={statusLabelMap[userStatus ?? ''] ?? 'Activo'}
                color={statusColorMap[userStatus ?? ''] ?? 'success'}
                size='small'
                sx={{ fontWeight: 600 }}
              />
              <Button
                variant='contained'
                startIcon={<Icon icon='tabler:pencil' fontSize='1rem' />}
                onClick={() => setDrawerOpen(true)}
              >
                Editar
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Modal de Vista Previa Grande */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth='md'
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible'
          }
        }}
      >
        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{
              position: 'absolute',
              top: -16,
              right: -16,
              color: 'common.white',
              bgcolor: 'rgba(0, 0, 0, 0.65)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.85)' },
              zIndex: 10
            }}
          >
            <Icon icon='tabler:x' fontSize='1.5rem' />
          </IconButton>
          {profileImgSrc && (
            <Box
              component='img'
              src={profileImgSrc}
              alt={fullName}
              sx={{
                maxWidth: '90vw',
                maxHeight: '80vh',
                borderRadius: 2,
                boxShadow: 24,
                objectFit: 'contain',
                border: theme => `3px solid ${theme.palette.common.white}`,
                bgcolor: 'background.paper'
              }}
            />
          )}
          <Typography
            variant='subtitle1'
            sx={{
              mt: 2,
              color: 'common.white',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              px: 3,
              py: 0.75,
              borderRadius: 1,
              fontWeight: 600
            }}
          >
            {fullName}
          </Typography>
        </Box>
      </Dialog>

      {/* Drawer de edición */}
      <AddUserDrawer
        open={drawerOpen}
        toggle={() => setDrawerOpen(false)}
        editData={editData}
        onUserUpdated={updated => {
          setUser({
            ...user,
            ...updated,
            image: updated.image || null
          })
        }}
      />
    </>
  )
}

export default UserProfileHeader
