import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import Icon from 'src/@core/components/icon'
import apiConnector from 'src/services/api.service'
import { useAuth } from 'src/hooks/useAuth'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { CompanyQuotaSummaryType } from 'src/types/apps/planTypes'
import QuotaProgressBar, { formatStorageMb } from './QuotaProgressBar'

interface TenantPlanUsageCardProps {
  companyId?: number
  initialSummary?: CompanyQuotaSummaryType | null
  title?: string
  subheader?: string
}

export const TenantPlanUsageCard: React.FC<TenantPlanUsageCardProps> = ({
  companyId,
  initialSummary = null,
  title = 'Plan y Consumo de Recursos',
  subheader = 'Monitoreo en tiempo real según los accesos habilitados en la compañía'
}) => {
  const { user } = useAuth()
  const ability = useContext(AbilityContext)
  const [summary, setSummary] = useState<CompanyQuotaSummaryType | null>(initialSummary)
  const [loading, setLoading] = useState<boolean>(!initialSummary)

  useEffect(() => {
    if (initialSummary) {
      setSummary(initialSummary)
      setLoading(false)

      return
    }

    let mounted = true
    setLoading(true)
    const params = companyId ? { companyId } : {}
    apiConnector
      .get<CompanyQuotaSummaryType>('/plans/my-quota', params)
      .then(res => {
        if (mounted) setSummary(res)
      })
      .catch(() => {
        if (mounted) setSummary(null)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [companyId, initialSummary])

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant='text' width='45%' height={32} />
          <Skeleton variant='rectangular' height={90} sx={{ mt: 2, borderRadius: 1 }} />
        </CardContent>
      </Card>
    )
  }

  if (!summary) return null

  // Mostrar métricas del plan según los permisos asignados al usuario (o todas para Super Admin / Company Admin)
  const isFullAdmin =
    Boolean(companyId) ||
    user?.role === 'superadmin' ||
    user?.role === 'company_admin' ||
    user?.role === 'admin'

  const canSeeUsersQuota = isFullAdmin || Boolean(ability?.can('read', 'users'))
  const canSeeDocumentsQuota = isFullAdmin || Boolean(ability?.can('read', 'documents'))
  const canSeeAiQuota =
    isFullAdmin ||
    Boolean(ability?.can('read', 'ai_queries')) ||
    Boolean(ability?.can('QUERY_AI_DOCUMENTS', 'all'))

  const badgeColor = (summary.plan?.badgeColor || 'primary') as
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'error'

  const hasVisibleMetrics = canSeeUsersQuota || canSeeDocumentsQuota || canSeeAiQuota

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
            {summary.plan ? (
              <Chip
                icon={<Icon icon='tabler:award' fontSize={16} />}
                label={`Plan ${summary.plan.name}`}
                color={badgeColor}
                size='small'
                sx={{ fontWeight: 600 }}
              />
            ) : (
              <Chip label='Sin Plan Asignado' size='small' variant='outlined' />
            )}
            {summary.useCustomLimits && (
              <Chip
                label='Límites Personalizados'
                color='warning'
                variant='outlined'
                size='small'
              />
            )}
          </Box>
        }
      />
      {hasVisibleMetrics && (
        <CardContent>
          <Grid container spacing={4}>
            {canSeeUsersQuota && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 3, borderRadius: 1.5, border: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Icon icon='tabler:users' fontSize={20} />
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      Usuarios Activos
                    </Typography>
                  </Box>
                  <QuotaProgressBar
                    label='Usuarios habilitados'
                    current={summary.users.current}
                    max={summary.users.max}
                  />
                </Box>
              </Grid>
            )}

            {canSeeDocumentsQuota && (
              <>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 3, borderRadius: 1.5, border: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Icon icon='tabler:files' fontSize={20} />
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        Cantidad de Documentos PDF
                      </Typography>
                    </Box>
                    <QuotaProgressBar
                      label='Archivos indexados'
                      current={summary.documents.current}
                      max={summary.documents.max}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 3, borderRadius: 1.5, border: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Icon icon='tabler:database' fontSize={20} />
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        Almacenamiento en Disco (Storage)
                      </Typography>
                    </Box>
                    <QuotaProgressBar
                      label='Espacio ocupado'
                      current={summary.storageMb.current}
                      max={summary.storageMb.max}
                      formatValue={formatStorageMb}
                    />
                  </Box>
                </Grid>
              </>
            )}

            {canSeeAiQuota && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 3, borderRadius: 1.5, border: 1, borderColor: 'divider' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1.5
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Icon icon='tabler:sparkles' fontSize={20} />
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        Consultas IA Mensuales
                      </Typography>
                    </Box>
                    {summary.aiQueries.period && (
                      <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                        Ciclo {summary.aiQueries.period}
                      </Typography>
                    )}
                  </Box>
                  <QuotaProgressBar
                    label='Consultas al Chat IA en el período'
                    current={summary.aiQueries.current}
                    max={summary.aiQueries.max}
                  />
                  <Typography
                    variant='caption'
                    sx={{ display: 'block', mt: 1.5, color: 'text.secondary' }}
                  >
                    Documentos analizados por IA en el ciclo:{' '}
                    <strong>{summary.aiQueries.aiDocumentsProcessed ?? 0}</strong>
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      )}
    </Card>
  )
}

export default TenantPlanUsageCard
