// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface Props {
  data?: {
    monthTotal: number
    monthCollected: number
    monthPending: number
    totalCount: number
    collectedPercentage: number
  }
}

const AnalyticsOrderVisits = ({ data }: Props) => {
  const monthTotal = data?.monthTotal ?? 14500000
  const monthCollected = data?.monthCollected ?? 11310000
  const monthPending = data?.monthPending ?? 3190000
  const totalCount = data?.totalCount ?? 84
  const collectedPercentage = data?.collectedPercentage ?? 78

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val)
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent sx={{ p: theme => `${theme.spacing(5)} !important`, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ gap: 2, mb: 5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
              Facturación Mes (Tango ERP)
            </Typography>
            <Typography variant='h5' sx={{ fontWeight: 600 }}>
              {formatCurrency(monthTotal)}
            </Typography>
          </div>
          <Typography sx={{ fontWeight: 500, color: 'success.main' }}>
            {totalCount} Comprobantes
          </Typography>
        </Box>
        <Box sx={{ mb: 3.5, gap: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ py: 2.25, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 1.5, height: 24, width: 24 }}>
                <Icon icon='tabler:circle-check' fontSize='1.125rem' />
              </CustomAvatar>
              <Typography sx={{ color: 'text.secondary' }}>Cobrado</Typography>
            </Box>
            <Typography variant='h6'>{collectedPercentage}%</Typography>
            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
              {formatCurrency(monthCollected)}
            </Typography>
          </Box>
          <Divider flexItem sx={{ m: 0 }} orientation='vertical'>
            <CustomAvatar
              skin='light'
              color='secondary'
              sx={{ height: 24, width: 24, fontSize: '0.6875rem', color: 'text.secondary' }}
            >
              VS
            </CustomAvatar>
          </Divider>
          <Box sx={{ py: 2.25, display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 1.5, color: 'text.secondary' }}>Saldo Pendiente</Typography>
              <CustomAvatar skin='light' color='warning' variant='rounded' sx={{ height: 24, width: 24 }}>
                <Icon icon='tabler:clock' fontSize='1.125rem' />
              </CustomAvatar>
            </Box>
            <Typography variant='h6'>{100 - collectedPercentage}%</Typography>
            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
              {formatCurrency(monthPending)}
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          value={collectedPercentage}
          color='success'
          variant='determinate'
          sx={{
            height: 10,
            '&.MuiLinearProgress-colorSuccess': { backgroundColor: 'warning.light' },
            '& .MuiLinearProgress-bar': {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0
            }
          }}
        />
      </CardContent>
    </Card>
  )
}

export default AnalyticsOrderVisits
