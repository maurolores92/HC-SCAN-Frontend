// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

interface BrandItem {
  brandId: number
  brandName: string
  count: number
  percentage: number
  trendNumber: number
}

interface Props {
  data?: BrandItem[]
}

const AnalyticsSalesByCountries = ({ data }: Props) => {
  const rawBrands: BrandItem[] = data && data.length > 0 ? data : [
    { brandId: 1, brandName: 'Ricoh', count: 184, percentage: 68, trendNumber: 68 },
    { brandId: 2, brandName: 'HP', count: 52, percentage: 19, trendNumber: 19 },
    { brandId: 3, brandName: 'Brother', count: 24, percentage: 9, trendNumber: 9 },
    { brandId: 4, brandName: 'Konica Minolta', count: 11, percentage: 4, trendNumber: 4 }
  ]
  const brands = rawBrands.slice(0, 5)

  const getBrandIcon = (brandName: string) => {
    const lower = brandName.toLowerCase()
    if (lower.includes('ricoh')) return 'tabler:printer'
    if (lower.includes('hp')) return 'tabler:devices'
    if (lower.includes('brother')) return 'tabler:copy'

    return 'tabler:device-laptop'
  }

  const totalMachines = brands.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title='Parque de Máquinas por Marca'
        subheader={`${totalMachines} Equipos Instalados distribuidos`}
        action={
          <OptionsMenu
            options={['Ver Todos', 'Exportar']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
        {brands.map((item: BrandItem, index: number) => {
          return (
            <Box
              key={item.brandId || item.brandName}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: index !== brands.length - 1 ? 4.5 : undefined
              }}
            >
              <CustomAvatar
                skin='light'
                variant='rounded'
                color={index === 0 ? 'primary' : index === 1 ? 'info' : 'secondary'}
                sx={{ mr: 4, width: 38, height: 38 }}
              >
                <Icon icon={getBrandIcon(item.brandName)} fontSize='1.25rem' />
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
                  <Typography variant='h6'>{item.brandName}</Typography>
                  <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                    {item.count} máquinas activas
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    color={index === 0 ? 'primary' : 'secondary'}
                    label={`${item.percentage}%`}
                  />
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default AnalyticsSalesByCountries
