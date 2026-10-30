// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CustomChip from 'src/@core/components/mui/chip'

interface TopCountry {
  name: string
  visits: string
  flag: string
  percentage: number
}

const topCountries: TopCountry[] = [
  { name: 'Argentina', visits: '4,850', flag: '🇦🇷', percentage: 68 },
  { name: 'Uruguay', visits: '1,320', flag: '🇺🇾', percentage: 19 },
  { name: 'Chile', visits: '940', flag: '🇨🇱', percentage: 13 }
]

const AnalyticsWebsiteAnalyticsSlider = () => {
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        backgroundColor: 'primary.main',
        color: 'common.white',
        '& .MuiTypography-root': { color: 'common.white' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <CardContent sx={{ p: theme => `${theme.spacing(5)} !important` }}>
        <Grid container spacing={3} alignItems='center'>
          {/* Columna Izquierda: Información compacta de visitas */}
          <Grid item xs={12} sm={8}>
            <Typography variant='body2' sx={{ color: 'rgba(255, 255, 255, 0.8) !important', mb: 1 }}>
              Métricas Web Institucional
            </Typography>

            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant='h4' sx={{ fontWeight: 700 }}>
                7,110
              </Typography>
              <CustomChip
                rounded
                size='small'
                skin='light'
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'common.white',
                  fontWeight: 600
                }}
                label='+14.2% esta semana'
              />
            </Box>

            {/* Top 3 Países compactos */}
            <Typography variant='caption' sx={{ color: 'rgba(255, 255, 255, 0.75) !important', display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Países con mayor tráfico
            </Typography>

            <Grid container spacing={1.5}>
              {topCountries.map((c, index) => (
                <Grid item xs={4} key={index}>
                  <Box
                    sx={{
                      py: 1,
                      px: 1.5,
                      borderRadius: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.15)',
                      textAlign: 'center'
                    }}
                  >
                    <Typography sx={{ fontSize: '1rem', lineHeight: 1.2 }}>{c.flag}</Typography>
                    <Typography noWrap variant='caption' sx={{ fontWeight: 600, display: 'block' }}>
                      {c.name}
                    </Typography>
                    <Typography variant='caption' sx={{ color: 'rgba(255, 255, 255, 0.7) !important', fontSize: '0.7rem' }}>
                      {c.visits}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Columna Derecha: Ilustración contenida */}
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Box
              component='img'
              src='/images/cards/graphic-illustration-1.png'
              alt='Web Analytics'
              sx={{
                maxHeight: 125,
                maxWidth: '100%',
                filter: 'drop-shadow(0px 6px 12px rgba(0,0,0,0.2))'
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsWebsiteAnalyticsSlider
