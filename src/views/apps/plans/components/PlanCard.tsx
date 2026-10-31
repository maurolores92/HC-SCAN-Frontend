import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Icon from 'src/@core/components/icon'
import { PlanType } from 'src/types/apps/planTypes'
import { formatStorageMb } from 'src/components/common/QuotaProgressBar'

interface PlanCardProps {
  plan: PlanType
  onEdit: (plan: PlanType) => void
  onDelete: (plan: PlanType) => void
}

const renderLimitText = (value: number | null, suffix: string, formatter?: (n: number) => string) => {
  if (value === null || value === undefined) return 'Ilimitado'
  if (formatter) return formatter(value)

  return `${value.toLocaleString('es-AR')} ${suffix}`
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onEdit, onDelete }) => {
  const chipColor = (plan.badgeColor || 'primary') as
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'error'

  const companiesCount = plan.companiesCount ?? 0

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: 1,
        borderColor: plan.isDefault ? 'primary.main' : 'divider',
        opacity: plan.isActive ? 1 : 0.72
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={plan.name} color={chipColor} size='small' sx={{ fontWeight: 700 }} />
            {plan.isDefault && (
              <Chip label='Predeterminado' color='primary' variant='outlined' size='small' />
            )}
            {!plan.isActive && <Chip label='Inactivo' color='error' size='small' />}
          </Box>
          <Typography variant='caption' sx={{ color: 'text.disabled' }}>
            /{plan.slug}
          </Typography>
        </Box>

        <Box sx={{ my: 2 }}>
          <Typography variant='h4' sx={{ fontWeight: 700 }}>
            USD {Number(plan.priceMonthly || 0).toLocaleString('es-AR')}
            <Typography component='span' variant='body2' sx={{ color: 'text.secondary', ml: 1 }}>
              / mes (ref.)
            </Typography>
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1, minHeight: 40 }}>
            {plan.description || 'Sin descripción comercial configurada.'}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Icon icon='tabler:users' fontSize={19} />
              <Typography variant='body2'>Usuarios activos</Typography>
            </Box>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              {renderLimitText(plan.maxUsers, 'usuarios')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Icon icon='tabler:files' fontSize={19} />
              <Typography variant='body2'>Documentos PDF</Typography>
            </Box>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              {renderLimitText(plan.maxDocuments, 'archivos')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Icon icon='tabler:database' fontSize={19} />
              <Typography variant='body2'>Storage en disco</Typography>
            </Box>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              {renderLimitText(plan.maxStorageMb, 'MB', formatStorageMb)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Icon icon='tabler:sparkles' fontSize={19} />
              <Typography variant='body2'>Consultas IA / mes</Typography>
            </Box>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              {renderLimitText(plan.maxAiQueriesMonthly, 'consultas')}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Chip
            icon={<Icon icon='tabler:building-community' fontSize={16} />}
            label={`${companiesCount} compañía(s)`}
            size='small'
            variant='outlined'
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size='small'
              variant='outlined'
              startIcon={<Icon icon='tabler:edit' fontSize={16} />}
              onClick={() => onEdit(plan)}
            >
              Editar
            </Button>
            <Tooltip
              title={
                companiesCount > 0
                  ? 'Reasigne las compañías asociadas antes de eliminar'
                  : 'Eliminar plan'
              }
            >
              <span>
                <IconButton
                  size='small'
                  color='error'
                  disabled={companiesCount > 0}
                  onClick={() => onDelete(plan)}
                >
                  <Icon icon='tabler:trash' fontSize={18} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PlanCard

