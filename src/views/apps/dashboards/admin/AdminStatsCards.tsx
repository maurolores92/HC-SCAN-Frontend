import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'

export interface DashboardStats {
  totalDocuments: number
  pendingDocuments: number
  processedDocuments: number
  errorDocuments: number
}

interface StatItem {
  label: string
  value: number
  subtitle: string
  icon: string
  color: 'primary' | 'warning' | 'success' | 'error'
}

export const AdminStatsCards: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
  const items: StatItem[] = [
    {
      label: 'TOTAL DOCUMENTOS',
      value: stats.totalDocuments,
      subtitle: 'Archivos PDF cargados',
      icon: 'tabler:file-text',
      color: 'primary'
    },
    {
      label: 'PENDIENTES IA',
      value: stats.pendingDocuments,
      subtitle: 'En cola de extracción',
      icon: 'tabler:clock',
      color: 'warning'
    },
    {
      label: 'PROCESADOS EXITOSOS',
      value: stats.processedDocuments,
      subtitle: 'Con información en BD',
      icon: 'tabler:circle-check',
      color: 'success'
    },
    {
      label: 'ERRORES DE LECTURA',
      value: stats.errorDocuments,
      subtitle: 'Requieren revisión',
      icon: 'tabler:alert-triangle',
      color: 'error'
    }
  ]

  return (
    <>
      {items.map(item => (
        <Grid item xs={12} sm={6} md={3} key={item.label}>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 4
              }}
            >
              <Box>
                <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {item.label}
                </Typography>
                <Typography variant='h4' sx={{ my: 0.5, fontWeight: 700 }}>
                  {item.value}
                </Typography>
                <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                  {item.subtitle}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${item.color}.light`,
                  color: `${item.color}.main`
                }}
              >
                <Icon icon={item.icon} fontSize={26} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  )
}

export default AdminStatsCards

