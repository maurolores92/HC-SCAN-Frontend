import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'
import Tooltip from '@mui/material/Tooltip'

interface QuotaProgressBarProps {
  current: number
  max: number
  label?: string
  showPercentage?: boolean
  dense?: boolean
}

export const QuotaProgressBar: React.FC<QuotaProgressBarProps> = ({
  current,
  max,
  label = 'Cupo de usuarios',
  showPercentage = true,
  dense = false
}) => {
  const percentage = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0

  let color: LinearProgressProps['color'] = 'primary'
  if (percentage >= 100) {
    color = 'error'
  } else if (percentage >= 80) {
    color = 'warning'
  }

  const isFull = current >= max

  return (
    <Tooltip title={`${current} de ${max} asignados (${percentage}%)`} arrow>
      <Box sx={{ width: '100%', minWidth: dense ? 100 : 140 }}>
        {!dense && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {label}
            </Typography>
            <Typography
              variant='caption'
              sx={{
                fontWeight: 600,
                color: isFull ? 'error.main' : 'text.primary'
              }}
            >
              {current}/{max} {showPercentage && `(${percentage}%)`}
            </Typography>
          </Box>
        )}
        <LinearProgress
          variant='determinate'
          value={percentage}
          color={color}
          sx={{
            height: dense ? 6 : 8,
            borderRadius: 4,
            backgroundColor: 'action.hover'
          }}
        />
        {dense && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant='caption' sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>
              {current}/{max}
            </Typography>
            {showPercentage && (
              <Typography
                variant='caption'
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: isFull ? 'error.main' : 'text.secondary'
                }}
              >
                {percentage}%
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Tooltip>
  )
}

export default QuotaProgressBar

