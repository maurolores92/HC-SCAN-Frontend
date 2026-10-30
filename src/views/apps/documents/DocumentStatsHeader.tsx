import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import { DocumentItem } from 'src/store/apps/documents'

interface DocumentStatsHeaderProps {
  documents: DocumentItem[]
  total: number
}

interface StatCardProps {
  title: string
  count: number
  icon: string
  color: string
  subtitle: string
}

const StatCard: React.FC<StatCardProps> = ({ title, count, icon, color, subtitle }) => (
  <Card>
    <CardContent sx={{ py: 3, px: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {title.toUpperCase()}
          </Typography>
          <Typography variant='h4' sx={{ my: 0.5, fontWeight: 700 }}>
            {count}
          </Typography>
          <Typography variant='caption' sx={{ color: 'text.disabled' }}>
            {subtitle}
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
            backgroundColor: `${color}.light`,
            color: `${color}.main`
          }}
        >
          <Icon icon={icon} fontSize={26} />
        </Box>
      </Box>
    </CardContent>
  </Card>
)

export const DocumentStatsHeader: React.FC<DocumentStatsHeaderProps> = ({ documents, total }) => {
  const pendingCount = documents.filter(d => d.status === 'PENDING').length
  const processingCount = documents.filter(d => d.status === 'PROCESSING').length
  const processedCount = documents.filter(d => d.status === 'PROCESSED').length
  const errorCount = documents.filter(d => d.status === 'ERROR').length

  return (
    <Grid container spacing={4} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title='Total PDFs'
          count={total}
          icon='tabler:files'
          color='primary'
          subtitle='Documentos registrados'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title='Pendientes IA'
          count={pendingCount + processingCount}
          icon='tabler:clock'
          color='warning'
          subtitle='Esperando procesamiento'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title='Procesados'
          count={processedCount}
          icon='tabler:circle-check'
          color='success'
          subtitle='Información extraída'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title='Errores'
          count={errorCount}
          icon='tabler:alert-triangle'
          color='error'
          subtitle='Requieren revisión'
        />
      </Grid>
    </Grid>
  )
}

export default DocumentStatsHeader

