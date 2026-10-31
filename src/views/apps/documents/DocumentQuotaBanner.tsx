import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { CompanyQuotaSummaryType } from 'src/types/apps/planTypes'
import QuotaProgressBar, { formatStorageMb } from 'src/components/common/QuotaProgressBar'

interface DocumentQuotaBannerProps {
  quota: CompanyQuotaSummaryType | null
}

export const DocumentQuotaBanner: React.FC<DocumentQuotaBannerProps> = ({ quota }) => {
  if (!quota || quota.isSuperAdmin) return null

  const docsFull =
    !quota.documents.unlimited &&
    quota.documents.max !== null &&
    quota.documents.current >= quota.documents.max

  const storageFull =
    !quota.storageMb.unlimited &&
    quota.storageMb.max !== null &&
    quota.storageMb.current >= quota.storageMb.max

  const isQuotaExhausted = docsFull || storageFull

  return (
    <Box sx={{ mb: 4 }}>
      {isQuotaExhausted && (
        <Alert severity='error' sx={{ mb: 3 }}>
          Su compañía alcanzó el límite de almacenamiento o cantidad de documentos permitido por el{' '}
          <strong>Plan {quota.plan?.name || 'Actual'}</strong>. Elimine archivos obsoletos o solicite
          una ampliación de plan al administrador de la plataforma.
        </Alert>
      )}

      <Card>
        <CardContent sx={{ py: 3, px: 4 }}>
          <Grid container spacing={4} alignItems='center'>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  CAPACIDAD DOCUMENTAL DEL PLAN
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    size='small'
                    color={(quota.plan?.badgeColor || 'primary') as any}
                    label={quota.plan ? `Plan ${quota.plan.name}` : 'Plan Base'}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4.5}>
              <QuotaProgressBar
                label='Cantidad de PDFs'
                current={quota.documents.current}
                max={quota.documents.max}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4.5}>
              <QuotaProgressBar
                label='Almacenamiento (Storage)'
                current={quota.storageMb.current}
                max={quota.storageMb.max}
                formatValue={formatStorageMb}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default DocumentQuotaBanner

