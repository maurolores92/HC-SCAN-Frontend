import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import apiConnector from 'src/services/api.service'
import { CompanyQuotaSummaryType } from 'src/types/apps/planTypes'
import QuotaProgressBar from 'src/components/common/QuotaProgressBar'

interface UserQuotaBannerProps {
  companyId?: number
  refreshTrigger?: number
}

export const UserQuotaBanner: React.FC<UserQuotaBannerProps> = ({ companyId, refreshTrigger = 0 }) => {
  const [summary, setSummary] = useState<CompanyQuotaSummaryType | null>(null)

  useEffect(() => {
    let mounted = true
    const params = companyId ? { companyId } : {}
    apiConnector
      .get<CompanyQuotaSummaryType>('/plans/my-quota', params)
      .then(res => {
        if (mounted && !(res as any)?.isSuperAdmin) {
          setSummary(res)
        }
      })
      .catch(() => {
        if (mounted) setSummary(null)
      })

    return () => {
      mounted = false
    }
  }, [companyId, refreshTrigger])

  if (!summary) return null

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent sx={{ py: '16px !important' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Icon icon='tabler:users' fontSize={20} />
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Cupo de Usuarios de su Plan:
            </Typography>
            {summary.plan && (
              <Chip
                label={`Plan ${summary.plan.name}`}
                color={(summary.plan.badgeColor || 'primary') as any}
                size='small'
              />
            )}
          </Box>
          <Box sx={{ minWidth: { xs: '100%', sm: 320 }, flex: { sm: '0 1 380px' } }}>
            <QuotaProgressBar
              label='Usuarios activos'
              current={summary.users.current}
              max={summary.users.max}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default UserQuotaBanner

