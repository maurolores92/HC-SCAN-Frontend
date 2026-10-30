// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
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
  amount: number
  subtitle: string
  avatarIcon: string
  avatarColor: ThemeColor
  amountDiff?: 'positive' | 'negative'
}

interface Props {
  data?: {
    weeklyDispatches: number
    weeklyReturns: number
    approvedRequests: number
    rejectedRequests: number
    chartSeries?: {
      entries: number[]
      exits: number[]
    }
  }
}

const AnalyticsTotalEarning = ({ data }: Props) => {
  // ** Hook
  const theme = useTheme()

  const entriesData = data?.chartSeries?.entries || [15, 12, 18, 10, 14, 20, 16]
  const exitsData = data?.chartSeries?.exits || [-8, -10, -7, -12, -6, -9, -5]
  const approved = data?.approvedRequests ?? 28
  const rejected = data?.rejectedRequests ?? 2

  const stockSeries = [
    { name: 'Entradas / Devoluciones', data: entriesData },
    { name: 'Salidas / Entregas', data: exitsData }
  ]

  const metricsData: DataType[] = [
    {
      amount: approved,
      subtitle: 'Entregadas a técnicos',
      title: 'Solicitudes Aprobadas',
      avatarColor: 'success',
      avatarIcon: 'tabler:check'
    },
    {
      amount: rejected,
      title: 'Solicitudes Rechazadas',
      avatarColor: 'error',
      subtitle: 'Por falta de stock o modelo',
      avatarIcon: 'tabler:x',
      amountDiff: 'negative'
    }
  ]

  const options: ApexOptions = {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    legend: { show: false },
    tooltip: { enabled: true },
    dataLabels: { enabled: false },
    stroke: {
      width: 4,
      lineCap: 'round',
      colors: [theme.palette.background.paper]
    },
    colors: [hexToRGBA(theme.palette.success.main, 1), hexToRGBA(theme.palette.warning.main, 1)],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '40%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: -20,
        left: -5,
        right: -2,
        bottom: -12
      }
    },
    xaxis: {
      axisTicks: { show: false },
      crosshairs: { opacity: 0 },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: { show: false }
    }
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title='Movimiento de Repuestos (Pañol)'
        action={
          <OptionsMenu
            options={['Esta Semana', 'Histórico']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
        subheader={
          <Box
            sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& svg': { mr: 1, color: 'success.main' } }}
          >
            <Typography variant='h2' sx={{ mr: 2 }}>
              {approved + rejected}
            </Typography>
            <Icon fontSize='1.25rem' icon='tabler:arrow-up-right' />
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Movimientos gestionados esta semana
            </Typography>
          </Box>
        }
      />
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <ReactApexcharts type='bar' height={178} series={stockSeries} options={options} />
        {metricsData.map((item: DataType, index: number) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(index === 0 && { mt: 7 }),
                mb: index !== metricsData.length - 1 ? 4 : undefined
              }}
            >
              <CustomAvatar
                skin='light'
                variant='rounded'
                color={item.avatarColor}
                sx={{ mr: 4, width: 34, height: 34 }}
              >
                <Icon icon={item.avatarIcon} />
              </CustomAvatar>
              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant='h6'>{item.title}</Typography>
                  <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                    {item.subtitle}
                  </Typography>
                </Box>
                <Typography
                  sx={{ fontWeight: 600, color: item.amountDiff === 'negative' ? 'error.main' : 'success.main' }}
                >
                  {`${item.amountDiff === 'negative' ? '' : '+'}${item.amount}`}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default AnalyticsTotalEarning
