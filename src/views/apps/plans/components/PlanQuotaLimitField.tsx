import React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { Control, Controller } from 'react-hook-form'

interface PlanQuotaLimitFieldProps {
  name: string
  label: string
  helperText?: string
  defaultNumericValue: number
  allowZero?: boolean
  control: Control<any>
  errorMessage?: string
}

export const PlanQuotaLimitField: React.FC<PlanQuotaLimitFieldProps> = ({
  name,
  label,
  helperText,
  defaultNumericValue,
  allowZero = false,
  control,
  errorMessage
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const isUnlimited = field.value === null || field.value === undefined

        const handleToggleUnlimited = (checked: boolean) => {
          if (checked) {
            field.onChange(null)
          } else {
            field.onChange(defaultNumericValue)
          }
        }

        return (
          <Box
            sx={{
              p: 2.5,
              borderRadius: 1.5,
              border: 1,
              borderColor: errorMessage ? 'error.main' : 'divider',
              backgroundColor: 'background.paper'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: isUnlimited ? 0 : 1.5
              }}
            >
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                {label}
              </Typography>
              <FormControlLabel
                sx={{ mr: 0 }}
                control={
                  <Switch
                    size='small'
                    color='success'
                    checked={isUnlimited}
                    onChange={e => handleToggleUnlimited(e.target.checked)}
                  />
                }
                label={
                  <Typography variant='caption' sx={{ fontWeight: 600 }}>
                    Ilimitado
                  </Typography>
                }
              />
            </Box>

            {!isUnlimited && (
              <TextField
                fullWidth
                size='small'
                type='number'
                value={field.value ?? ''}
                onChange={e => {
                  const raw = e.target.value
                  field.onChange(raw === '' ? '' : Number(raw))
                }}
                inputProps={{ min: allowZero ? 0 : 1 }}
                error={Boolean(errorMessage)}
                helperText={errorMessage || helperText}
              />
            )}
          </Box>
        )
      }}
    />
  )
}

export default PlanQuotaLimitField

