// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Type Import
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import Icon from 'src/@core/components/icon'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

interface DataType {
  title: string
  subtitle: string
  avatarIcon: string
  avatarColor?: ThemeColor
}

interface Props {
  data?: {
    resolutionRate: number
    totalOrders: number
    completedOrders: number
    urgentOrders: number
    unassignedOrders: number
    draftOrders: number
  }
}

const AnalyticsSupportTracker = ({ data }: Props) => {
  // ** Hook
  const theme = useTheme()

  const resolutionRate = data?.resolutionRate ?? 82
  const totalOrders = data?.totalOrders ?? 45
  const urgentOrders = data?.urgentOrders ?? 3
  const unassignedOrders = data?.unassignedOrders ?? 2
  const draftOrders = data?.draftOrders ?? 4

  const subItems: DataType[] = [
    {
      subtitle: `${urgentOrders} órdenes`,
      title: 'Urgentes / Alta Prioridad',
      avatarColor: 'error',
      avatarIcon: 'tabler:alert-triangle'
    },
    {
      subtitle: `${unassignedOrders} órdenes`,
      avatarColor: 'warning',
      title: 'Sin Asignar a Técnico',
      avatarIcon: 'tabler:user-exclamation'
    },
    {
      subtitle: `${draftOrders} visitas`,
      title: 'Borradores en Calendario',
      avatarColor: 'info',
      avatarIcon: 'tabler:calendar-time'
    }
  ]

  const options: ApexOptions = {
    chart: {
      sparkline: { enabled: true }
    },
    stroke: { dashArray: 10 },
    labels: ['Resolución'],
    colors: [hexToRGBA(theme.palette.primary.main, 1)],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        opacityTo: 0.5,
        opacityFrom: 1,
        shadeIntensity: 0.5,
        stops: [30, 70, 100],
        inverseColors: false,
        gradientToColors: [theme.palette.success.main]
      }
    },
    plotOptions: {
      radialBar: {
        endAngle: 130,
        startAngle: -140,
        hollow: { size: '60%' },
        track: { background: 'transparent' },
        dataLabels: {
          name: {
            offsetY: -15,
            color: theme.palette.text.disabled,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.body2.fontSize as string
          },
          value: {
            offsetY: 15,
            fontWeight: 500,
            formatter: value => `${value}%`,
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.h1.fontSize as string
          }
        }
      }
    },
    grid: {
      padding: {
        top: -30,
        bottom: 12
      }
    },
    responsive: [
      {
        breakpoint: 1300,
        options: {
          grid: {
            padding: {
              left: 22
            }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          grid: {
            padding: {
              left: 0
            }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardHeader
        title='Tasa de Resolución de Soporte'
        subheader='Rendimiento del Servicio Técnico'
        action={
          <OptionsMenu
            options={['Este Mes', 'Mes Anterior']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={5}>
            <Typography variant='h1'>{totalOrders}</Typography>
            <Typography sx={{ mb: 6, color: 'text.secondary' }}>Órdenes Activas este Mes</Typography>
            {subItems.map((item: DataType, index: number) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', mb: index !== subItems.length - 1 ? 4 : undefined }}
              >
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={item.avatarColor}
                  sx={{ mr: 4, width: 34, height: 34 }}
                >
                  <Icon icon={item.avatarIcon} />
                </CustomAvatar>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant='h6'>{item.title}</Typography>
                  <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                    {item.subtitle}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} sm={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ReactApexcharts type='radialBar' height={325} options={options} series={[resolutionRate]} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsSupportTracker
