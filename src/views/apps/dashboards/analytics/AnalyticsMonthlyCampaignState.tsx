// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'

interface DataType {
  icon: string
  title: string
  amount: string
  trendNumber: string
  avatarColor: ThemeColor
  trend?: 'positive' | 'negative'
}

interface Props {
  data?: {
    pendingRequests?: number
    activeTravelKits?: number
    pendingReturns?: number
    machinesInWorkshop?: number
  }
}

const AnalyticsMonthlyCampaignState = ({ data }: Props) => {
  const pendingRequests = data?.pendingRequests ?? 4
  const activeTravelKits = data?.activeTravelKits ?? 6
  const pendingReturns = data?.pendingReturns ?? 2
  const machinesInWorkshop = data?.machinesInWorkshop ?? 3

  const alertItems: DataType[] = [
    {
      title: 'Solicitudes de Repuestos Pendientes',
      amount: `${pendingRequests}`,
      icon: 'tabler:package-export',
      trendNumber: 'Por despachar',
      avatarColor: 'warning'
    },
    {
      title: 'Lolos de Viaje Asignados',
      amount: `${activeTravelKits}`,
      trendNumber: 'En comisión activa',
      avatarColor: 'info',
      icon: 'tabler:briefcase'
    },
    {
      amount: `${pendingReturns}`,
      title: 'Devoluciones Pendientes a Depósito',
      trend: 'negative',
      trendNumber: 'Por reingresar',
      icon: 'tabler:arrow-back-up',
      avatarColor: 'error'
    },
    {
      amount: `${machinesInWorkshop}`,
      title: 'Equipos Retirados a Taller',
      trendNumber: 'En reparación',
      icon: 'tabler:tool',
      avatarColor: 'primary'
    }
  ]

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title='Alertas Operativas y Pañol'
        subheader='Resumen de Depósito Central'
        action={
          <OptionsMenu
            options={['Ver Solicitudes', 'Ver Depósitos Móviles']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
        {alertItems.map((item: DataType, index: number) => {
          return (
            <Grid
              container
              key={index}
              alignItems='center'
              sx={{
                mb: index !== alertItems.length - 1 ? 4 : 0
              }}
            >
              {/* Icono: 2 columnas */}
              <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={item.avatarColor}
                  sx={{ width: 36, height: 36 }}
                >
                  <Icon icon={item.icon} fontSize='1.25rem' />
                </CustomAvatar>
              </Grid>

              {/* Título: 6 columnas */}
              <Grid item xs={6} sx={{ pr: 2 }}>
                <Typography variant='h6' sx={{ fontSize: '0.875rem', lineHeight: 1.3 }}>
                  {item.title}
                </Typography>
              </Grid>

              {/* Cantidad y estado: 4 columnas */}
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.95rem' }}>
                  {item.amount}
                </Typography>
                <Typography variant='caption' sx={{ color: 'text.disabled', display: 'block', lineHeight: 1.1 }}>
                  {item.trendNumber}
                </Typography>
              </Grid>
            </Grid>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default AnalyticsMonthlyCampaignState
