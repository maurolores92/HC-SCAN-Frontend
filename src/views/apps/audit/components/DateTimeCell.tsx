// ** React Imports
import React from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Utils Import
import { splitDateAndTime } from '../utils/auditFormatters'

interface Props {
  value?: string | Date
}

export const DateTimeCell = ({ value }: Props) => {
  const { date, time } = splitDateAndTime(value)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Typography
        variant='body2'
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          lineHeight: 1.25,
          fontSize: '0.8125rem',
          whiteSpace: 'nowrap',
        }}
      >
        {date}
      </Typography>
      <Typography
        variant='caption'
        sx={{
          color: 'text.secondary',
          lineHeight: 1.2,
          fontSize: '0.72rem',
          whiteSpace: 'nowrap',
        }}
      >
        {time}
      </Typography>
    </Box>
  )
}

export default DateTimeCell
