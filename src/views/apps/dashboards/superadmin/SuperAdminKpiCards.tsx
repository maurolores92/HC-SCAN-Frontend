import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'

export interface SuperAdminPlatformMetrics {
  totalCompanies: number
  activeCompanies: number
  totalPlans: number
  totalActiveUsers: number
  totalStorageMb: number
}

interface Props {
  metrics: SuperAdminPlatformMetrics
}

const SuperAdminKpiCards: React.FC<Props> = ({ metrics }) => {
  const cards = [
    {
      title: 'Empresas Clientes',
      value: metrics.totalCompanies,
      subtitle: `${metrics.activeCompanies} activas en plataforma`,
      icon: 'tabler:building-community',
      color: 'primary' as const
    },
    {
      title: 'Planes Configurados',
      value: metrics.totalPlans,
      subtitle: 'Catálogo global de suscripciones',
      icon: 'tabler:award',
      color: 'info' as const
    },
    {
      title: 'Usuarios en Empresas',
      value: metrics.totalActiveUsers,
      subtitle: 'Cuentas activas totales',
      icon: 'tabler:users-group',
      color: 'success' as const
    },
    {
      title: 'Storage Consumido',
      value: `${metrics.totalStorageMb.toFixed(1)} MB`,
      subtitle: 'Uso consolidado de bóvedas',
      icon: 'tabler:database',
      color: 'warning' as const
    }
  ]

  return (
    <>
      {cards.map(card => (
        <Grid item xs={12} sm={6} md={3} key={card.title}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant='body2' sx={{ color: 'text.secondary', mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant='h4' sx={{ fontWeight: 700, mb: 0.5 }}>
                  {card.value}
                </Typography>
                <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                  {card.subtitle}
                </Typography>
              </Box>
              <CustomAvatar skin='light' color={card.color} sx={{ width: 48, height: 48 }}>
                <Icon icon={card.icon} fontSize={26} />
              </CustomAvatar>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  )
}

export default SuperAdminKpiCards

