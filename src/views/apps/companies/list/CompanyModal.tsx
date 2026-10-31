import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import { Controller } from 'react-hook-form'
import CompanyAdminFormSection from './CompanyAdminFormSection'
import CompanyModulesSelector from './CompanyModulesSelector'
import CompanyPlanLimitsSection from './CompanyPlanLimitsSection'
import { useCompanyModalForm } from './hooks/useCompanyModalForm'

interface CompanyModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  companyData: any | null
}

export const CompanyModal: React.FC<CompanyModalProps> = ({
  open,
  onClose,
  onSuccess,
  companyData
}) => {
  const {
    isEdit,
    plans,
    control,
    handleSubmit,
    setValue,
    watch,
    handleNameChange,
    onSubmit,
    formState: { errors, isSubmitting }
  } = useCompanyModalForm(open, companyData, onSuccess, onClose)

  const watchedPlanId = watch('planId')
  const watchedUseCustomLimits = watch('useCustomLimits')

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {isEdit ? 'Editar Compañía' : 'Nueva Compañía Tenant'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoFocus
                    fullWidth
                    label='Nombre Fantasía'
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message as string}
                    onChange={e => handleNameChange(e.target.value, field.onChange)}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='slug'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    disabled={isEdit}
                    label='Slug Identificador (Ruta / Tenant)'
                    placeholder='ej: helpcopies-scan'
                    error={Boolean(errors.slug)}
                    helperText={
                      (errors.slug?.message as string) ||
                      'Identificador único para carpetas y almacenamiento'
                    }
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='legalName'
                control={control}
                render={({ field }) => <TextField {...field} fullWidth label='Razón Social' />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='taxId'
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label='CUIT / Identificación Fiscal' />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Correo de Contacto'
                    type='email'
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message as string}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => <TextField {...field} fullWidth label='Teléfono' />}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label='Dirección Comercial' />
                )}
              />
            </Grid>

            <CompanyPlanLimitsSection
              control={control}
              errors={errors}
              plans={plans}
              selectedPlanId={watchedPlanId}
              useCustomLimits={Boolean(watchedUseCustomLimits)}
              setValue={setValue}
            />

            <CompanyModulesSelector control={control} />

            {!isEdit && <CompanyAdminFormSection control={control} errors={errors} />}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 4 }}>
          <Button variant='outlined' color='secondary' onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type='submit' variant='contained' disabled={isSubmitting}>
            {isSubmitting ? (
              <CircularProgress size={24} color='inherit' />
            ) : isEdit ? (
              'Actualizar Compañía'
            ) : (
              'Crear Compañía'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CompanyModal
