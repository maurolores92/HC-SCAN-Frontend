import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'
import Tooltip from '@mui/material/Tooltip'

export const formatStorageMb = (mb: number): string => {
  if (mb >= 1024) {
    const gb = mb / 1024
    return `${Number.isInteger(gb) ? gb : gb.toFixed(1)} GB`
  }

  return `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB`
}

interface QuotaProgressBarProps {
  current: number
  max: number | null
  label?: string
  showPercentage?: boolean
  dense?: boolean
  formatValue?: (val: number) => string
}

export const QuotaProgressBar: React.FC<QuotaProgressBarProps> = ({
  current,
  max,
  label = 'Cupo de usuarios',
  showPercentage = true,
  dense = false,
  formatValue
}) => {
  const isUnlimited = max === null || max === undefined
  const formattedCurrent = formatValue ? formatValue(current) : String(current)
  const formattedMax = isUnlimited
    ? 'Ilimitado'
    : formatValue
    ? formatValue(max)
    : String(max)

  const percentage =
    !isUnlimited && max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0

  let color: LinearProgressProps['color'] = isUnlimited ? 'success' : 'primary'
  if (!isUnlimited) {
    if (percentage >= 100 || (max === 0 && current > 0)) {
      color = 'error'
    } else if (percentage >= 85) {
      color = 'warning'
    }
  }

  const isFull = !isUnlimited && current >= max
  const tooltipText = isUnlimited
    ? `${formattedCurrent} en uso (Sin límite en su plan)`
    : `${formattedCurrent} de ${formattedMax} utilizados (${percentage}%)`

  return (
    <Tooltip title={tooltipText} arrow>
      <Box sx={{ width: '100%', minWidth: dense ? 105 : 140 }}>
        {!dense && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {label}
            </Typography>
            <Typography
              variant='caption'
              sx={{
                fontWeight: 600,
                color: isUnlimited
                  ? 'success.main'
                  : isFull
                  ? 'error.main'
                  : 'text.primary'
              }}
            >
              {isUnlimited
                ? `${formattedCurrent} • Ilimitado`
                : `${formattedCurrent} / ${formattedMax}${showPercentage ? ` (${percentage}%)` : ''}`}
            </Typography>
          </Box>
        )}
        <LinearProgress
          variant='determinate'
          value={isUnlimited ? 100 : percentage}
          color={color}
          sx={{
            height: dense ? 6 : 8,
            borderRadius: 4,
            backgroundColor: 'action.hover',
            ...(isUnlimited ? { opacity: 0.45 } : {})
          }}
        />
        {dense && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant='caption' sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>
              {isUnlimited ? `${formattedCurrent} / ∞` : `${formattedCurrent}/${formattedMax}`}
            </Typography>
            {showPercentage && (
              <Typography
                variant='caption'
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: isUnlimited
                    ? 'success.main'
                    : isFull
                    ? 'error.main'
                    : 'text.secondary'
                }}
              >
                {isUnlimited ? 'Ilimitado' : `${percentage}%`}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Tooltip>
  )
}

export default QuotaProgressBar
