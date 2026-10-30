// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import LinearProgress from '@mui/material/LinearProgress'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Type Import
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

interface DataType {
  stats: string
  title: string
  progress: number
  avatarIcon: string
  avatarColor?: ThemeColor
  progressColor?: ThemeColor
}

const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    paddingTop: '0 !important'
  }
}))

interface Props {
  data?: {
    chartSeries?: {
      data: number[]
      categories: string[]
    }
    metrics?: {
      completed: number
      inProgress: number
      waiting: number
    }
  }
}

const AnalyticsEarningReports = ({ data }: Props) => {
  // ** Hook
  const theme = useTheme()

  const categories = data?.chartSeries?.categories || ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  const seriesData = data?.chartSeries?.data || [4, 8, 12, 7, 10, 3, 1]
  const totalOrders = seriesData.reduce((acc, curr) => acc + curr, 0)

  const completed = data?.metrics?.completed ?? 18
  const inProgress = data?.metrics?.inProgress ?? 12
  const waiting = data?.metrics?.waiting ?? 5

  const subMetrics: DataType[] = [
    {
      progress: totalOrders > 0 ? Math.round((completed / totalOrders) * 100) : 55,
      stats: `${completed}`,
      title: 'Completadas',
      avatarIcon: 'tabler:circle-check',
      avatarColor: 'success',
      progressColor: 'success'
    },
    {
      progress: totalOrders > 0 ? Math.round((inProgress / totalOrders) * 100) : 35,
      title: 'En Proceso',
      stats: `${inProgress}`,
      avatarColor: 'info',
      progressColor: 'info',
      avatarIcon: 'tabler:tools'
    },
    {
      progress: totalOrders > 0 ? Math.round((waiting / totalOrders) * 100) : 10,
      stats: `${waiting}`,
      title: 'En Espera',
      avatarColor: 'warning',
      progressColor: 'warning',
      avatarIcon: 'tabler:clock-pause'
    }
  ]

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        distributed: true,
        columnWidth: '50%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    legend: { show: false },
    tooltip: { enabled: true },
    dataLabels: { enabled: false },
    colors: [
      hexToRGBA(theme.palette.primary.main, 0.4),
      hexToRGBA(theme.palette.primary.main, 0.6),
      theme.palette.primary.main,
      hexToRGBA(theme.palette.primary.main, 0.7),
      hexToRGBA(theme.palette.primary.main, 0.9),
      hexToRGBA(theme.palette.primary.main, 0.3),
      hexToRGBA(theme.palette.primary.main, 0.2)
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -28,
        left: -9,
        right: -10,
        bottom: -12
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: categories,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    },
    yaxis: { show: false }
  }

  return (
    <Card>
      <CardHeader
        sx={{ pb: 0 }}
        title='Órdenes de Servicio por Día'
        subheader='Operativa de la Semana Actual'
        action={
          <OptionsMenu
            options={['Esta Semana', 'Semana Anterior']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <CardContent>
        <Grid container spacing={6}>
          <StyledGrid
            item
            sm={5}
            xs={12}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end' }}
          >
            <Box sx={{ mb: 3, rowGap: 1, columnGap: 2.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant='h1'>{totalOrders}</Typography>
              <CustomChip size='small' color='primary' label='Semana' />
            </Box>
            <Typography variant='body2'>Total de órdenes creadas en taller y campo de lunes a domingo</Typography>
          </StyledGrid>
          <StyledGrid item xs={12} sm={7}>
            <ReactApexcharts type='bar' height={163} series={[{ data: seriesData }]} options={options} />
          </StyledGrid>
        </Grid>
        <Box sx={{ mt: 6, borderRadius: 1, p: theme.spacing(4, 5), border: `1px solid ${theme.palette.divider}` }}>
          <Grid container spacing={6}>
            {subMetrics.map((item: DataType, index: number) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    color={item.avatarColor}
                    sx={{ mr: 2, width: 26, height: 26 }}
                  >
                    <Icon fontSize='1.125rem' icon={item.avatarIcon} />
                  </CustomAvatar>
                  <Typography variant='h6'>{item.title}</Typography>
                </Box>
                <Typography variant='h4' sx={{ mb: 2.5 }}>
                  {item.stats}
                </Typography>
                <LinearProgress
                  variant='determinate'
                  value={item.progress}
                  color={item.progressColor}
                  sx={{ height: 4 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AnalyticsEarningReports
