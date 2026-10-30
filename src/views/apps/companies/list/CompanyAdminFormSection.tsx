import React from 'react'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Control, Controller, FieldErrors } from 'react-hook-form'

interface CompanyAdminFormSectionProps {
  control: Control<any>
  errors: FieldErrors<any>
}

export const CompanyAdminFormSection: React.FC<CompanyAdminFormSectionProps> = ({
  control,
  errors
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ mt: 2, fontWeight: 600 }}>
          Cuenta del Administrador Inicial
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          Se creará automáticamente el usuario con rol de Administrador de esta compañía.
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name='adminName'
          control={control}
          rules={{ required: 'El nombre del administrador es obligatorio' }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label='Nombre Administrador'
              error={Boolean(errors.adminName)}
              helperText={errors.adminName?.message as string}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name='adminLastName'
          control={control}
          render={({ field }) => (
            <TextField {...field} fullWidth label='Apellido Administrador' />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name='adminEmail'
          control={control}
          rules={{
            required: 'El correo del administrador es obligatorio',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Correo inválido'
            }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label='Correo Electrónico'
              type='email'
              error={Boolean(errors.adminEmail)}
              helperText={errors.adminEmail?.message as string}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name='adminPassword'
          control={control}
          rules={{
            required: 'La contraseña es obligatoria',
            minLength: { value: 6, message: 'Mínimo 6 caracteres' }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label='Contraseña Inicial'
              type='password'
              error={Boolean(errors.adminPassword)}
              helperText={errors.adminPassword?.message as string}
            />
          )}
        />
      </Grid>
    </>
  )
}

export default CompanyAdminFormSection

