/* eslint-disable @typescript-eslint/no-unused-vars, lines-around-comment */
// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { UserDataType } from 'src/context/types'

interface Props {
  user: UserDataType
}

interface InfoRowProps {
  icon: string
  label: string
  value?: string | null
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => {
  if (!value) return null

  return (
    <Box
      sx={{
        display: 'flex',
        '&:not(:last-of-type)': { mb: 3 },
        '& svg': { color: 'text.secondary' }
      }}
    >
      <Box sx={{ display: 'flex', mr: 2, mt: 0.25 }}>
        <Icon fontSize='1.25rem' icon={icon} />
      </Box>
      <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{label}:</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{value}</Typography>
      </Box>
    </Box>
  )
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

const AboutOverivew = ({ user }: Props) => {
  const fullName = [user.name, user.lastName].filter(Boolean).join(' ') || user.fullName

  return (
    <Grid container spacing={6}>

      {/* Overview / stats card */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography
              variant='body2'
              sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.8px' }}
            >
              Resumen
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Estado</Typography>
              <Chip
                size='small'
                label={statusLabelMap[user.status ?? ''] ?? 'Activo'}
                color={statusColorMap[user.status ?? ''] ?? 'success'}
              />
            </Box>

            {/* Placeholders — se conectarán con datos reales cuando estén disponibles */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Proyectos activos</Typography>
              <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>—</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Tareas completadas</Typography>
              <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>—</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Último acceso</Typography>
              <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>
                {user.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                  : '—'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AboutOverivew
