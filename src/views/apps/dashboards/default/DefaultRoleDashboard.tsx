// ** React Imports
import React from 'react'
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Auth Hook
import { useAuth } from 'src/hooks/useAuth'

export const DefaultRoleDashboard = ({ roleName }: { roleName?: string }) => {
  const { user } = useAuth()
  const displayRole = roleName || (typeof user?.role === 'string' ? user.role : 'Usuario')

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card
          sx={{
            background: theme =>
              theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(76, 175, 80, 0.08) 100%)'
                : 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(76, 175, 80, 0.15) 100%)',
            border: theme => `1px solid ${theme.palette.divider}`,
          }}
        >
          <CardContent sx={{ p: { xs: 5, md: 7 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
              <Typography variant='h4' sx={{ fontWeight: 700 }}>
                ¡Bienvenido, {user?.name || 'Usuario'}! 👋
              </Typography>
              <CustomChip
                size='small'
                label={displayRole}
                color='primary'
                sx={{ fontWeight: 600, textTransform: 'capitalize' }}
              />
            </Box>
            <Typography variant='body1' sx={{ color: 'text.secondary', maxWidth: 640 }}>
              Has ingresado al sistema HelpCopies ERP. Utiliza el menú lateral para acceder a los módulos y herramientas autorizadas según tus permisos.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <CustomAvatar
              skin='light'
              color='primary'
              sx={{ width: 64, height: 64, mx: 'auto', mb: 3 }}
            >
              <Icon icon='tabler:layout-dashboard' fontSize={32} />
            </CustomAvatar>
            <Typography variant='h6' sx={{ fontWeight: 600, mb: 1 }}>
              Panel de Control en Preparación
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary', maxWidth: 480, mx: 'auto', mb: 4 }}>
              Este rol cuenta con acceso al sistema y su panel de indicadores personalizados se habilitará en las próximas actualizaciones.
            </Typography>
            <Button
              component={Link}
              href='/myprofile'
              variant='tonal'
              color='primary'
              startIcon={<Icon icon='tabler:user' />}
            >
              Ver Mi Perfil
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default DefaultRoleDashboard
