/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils
import { getInitials } from 'src/@core/utils/get-initials'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'

// ** Drawers
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import SignatureModal from 'src/views/apps/user/list/SignatureModal'

interface Props {
  user: UsersType
  onUserUpdated?: (user: UsersType) => void
}

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

interface InfoRowProps {
  icon: string
  label: string
  value?: string | null
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => {
  if (!value) return null

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, '& svg': { color: 'text.secondary' } }}>
      <Icon fontSize='1.125rem' icon={icon} />
      <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary', minWidth: 80 }}>{label}</Typography>
      <Typography sx={{ color: 'text.secondary' }}>{value}</Typography>
    </Box>
  )
}

const UserDetailLeft = ({ user, onUserUpdated }: Props) => {
  const [editOpen, setEditOpen] = useState(false)
  const [signatureOpen, setSignatureOpen] = useState(false)

  const fullName = [user.name, user.lastName].filter(Boolean).join(' ') || user.fullName
  const userStatus = user.status?.toUpperCase()

  const avatarSrc = (user as any).image
    ? ((user as any).image.startsWith('http')
      ? (user as any).image
      : `${process.env.NEXT_PUBLIC_API_URL}/images/users/${(user as any).image}`)
    : (user.avatar || null)

  const roleName = typeof user.role === 'object' ? (user.role as any)?.name : user.role

  return (
    <>
      <Grid container spacing={6}>
        {/* Card de datos del usuario */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 10, pb: 4 }}>
              {/* Avatar */}
              {avatarSrc ? (
                <CustomAvatar
                  src={avatarSrc}
                  variant='rounded'
                  alt={fullName}
                  sx={{ width: 100, height: 100, mb: 4 }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  color='primary'
                  variant='rounded'
                  sx={{ width: 100, height: 100, mb: 4, fontSize: '2.5rem' }}
                >
                  {getInitials(fullName || 'U')}
                </CustomAvatar>
              )}

              {/* Nombre y rol */}
              <Typography variant='h5' sx={{ mb: 1 }}>
                {fullName}
              </Typography>
              <Chip
                label={roleName}
                size='small'
                variant='outlined'
                sx={{ mb: 4, textTransform: 'capitalize' }}
              />

              <Divider sx={{ width: '100%', my: 4 }} />

              {/* Información detallada */}
              <Box sx={{ width: '100%' }}>
                <Typography
                  variant='body2'
                  sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.8px' }}
                >
                  Datos del usuario
                </Typography>

                <InfoRow icon='tabler:user' label='Nombre' value={fullName} />
                <InfoRow icon='tabler:at' label='Usuario' value={user.username} />
                <InfoRow icon='tabler:mail' label='Email' value={user.email} />
                <InfoRow icon='tabler:phone' label='Teléfono' value={user.phone ?? user.contact} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Icon fontSize='1.125rem' icon='tabler:circle-check' />
                  <Typography sx={{ mx: 2, fontWeight: 500, color: 'text.secondary', minWidth: 80 }}>Estado</Typography>
                  <Chip
                    size='small'
                    label={statusLabelMap[userStatus ?? ''] ?? user.status}
                    color={(statusColorMap[userStatus ?? ''] ?? 'default') as ThemeColor}
                  />
                </Box>

                {/* Firma */}
                {(user as any).signature && (
                  <>
                    <Divider sx={{ my: 4 }} />
                    <Typography
                      variant='body2'
                      sx={{ mb: 3, color: 'text.disabled', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.8px' }}
                    >
                      Firma
                    </Typography>
                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        p: 2,
                        bgcolor: theme => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <img
                        src={(user as any).signature}
                        alt='Firma'
                        style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain' }}
                      />
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center', gap: 2, pb: 6 }}>
              <Button
                variant='contained'
                startIcon={<Icon icon='tabler:pencil' />}
                onClick={() => setEditOpen(true)}
              >
                Editar
              </Button>
              <Button
                variant='outlined'
                startIcon={<Icon icon='tabler:signature' />}
                onClick={() => setSignatureOpen(true)}
              >
                Firma
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Drawer de edición */}
      <AddUserDrawer
        open={editOpen}
        toggle={() => setEditOpen(false)}
        editData={user}
      />

      {/* Modal de firma */}
      <SignatureModal
        open={signatureOpen}
        toggle={() => setSignatureOpen(false)}
        userId={user.id}
        existingSignature={(user as any).signature ?? null}
      />
    </>
  )
}

export default UserDetailLeft
