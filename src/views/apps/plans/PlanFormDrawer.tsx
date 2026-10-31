import React from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import { Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { PlanType } from 'src/types/apps/planTypes'
import CompanyModulesSelector from 'src/views/apps/companies/list/CompanyModulesSelector'
import PlanQuotaLimitField from './components/PlanQuotaLimitField'
import { usePlanForm } from './hooks/usePlanForm'

interface PlanFormDrawerProps {
  open: boolean
  onClose: () => void
  editPlan: PlanType | null
}

export const PlanFormDrawer: React.FC<PlanFormDrawerProps> = ({ open, onClose, editPlan }) => {
  const {
    isEdit,
    control,
    handleSubmit,
    handleNameChange,
    onSubmit,
    formState: { errors, isSubmitting }
  } = usePlanForm(open, editPlan, onClose)

  return (
    <Drawer
      open={open}
      anchor='right'
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 520 } } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 5 }}>
        <Typography variant='h6' sx={{ fontWeight: 700 }}>
          {isEdit ? `Editar Plan: ${editPlan?.name}` : 'Nuevo Plan de Suscripción'}
        </Typography>
        <IconButton onClick={onClose}>
          <Icon icon='tabler:x' />
        </IconButton>
      </Box>
      <Divider />

      <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ p: 5 }}>
        <Grid container spacing={3.5}>
          <Grid item xs={12} sm={6}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Nombre del Plan'
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
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
                  label='Identificador (Slug)'
                  error={Boolean(errors.slug)}
                  helperText={errors.slug?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name='priceMonthly'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type='number'
                  label='Precio Mensual Ref. (USD)'
                  error={Boolean(errors.priceMonthly)}
                  helperText={errors.priceMonthly?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name='badgeColor'
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label='Color Distintivo'>
                  <MenuItem value='primary'>Azul Principal</MenuItem>
                  <MenuItem value='info'>Celeste Info</MenuItem>
                  <MenuItem value='success'>Verde Corporativo</MenuItem>
                  <MenuItem value='warning'>Ámbar Destacado</MenuItem>
                  <MenuItem value='secondary'>Gris Secundario</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth multiline rows={2} label='Descripción Comercial' />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant='subtitle1' sx={{ fontWeight: 700, mt: 1 }}>
              Límites Operativos del Plan
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <PlanQuotaLimitField
              name='maxUsers'
              label='Máx. Usuarios'
              defaultNumericValue={10}
              control={control}
              errorMessage={errors.maxUsers?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <PlanQuotaLimitField
              name='maxDocuments'
              label='Máx. Documentos PDF'
              defaultNumericValue={1000}
              control={control}
              errorMessage={errors.maxDocuments?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <PlanQuotaLimitField
              name='maxStorageMb'
              label='Storage en Disco (MB)'
              helperText='Ej: 2048 MB = 2 GB'
              defaultNumericValue={5120}
              control={control}
              errorMessage={errors.maxStorageMb?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <PlanQuotaLimitField
              name='maxAiQueriesMonthly'
              label='Consultas IA / Mes'
              helperText='0 deshabilita consultas IA'
              defaultNumericValue={500}
              allowZero
              control={control}
              errorMessage={errors.maxAiQueriesMonthly?.message}
            />
          </Grid>

          <CompanyModulesSelector
            control={control}
            fieldName='includedModules'
            title='Módulos Incluidos en el Plan'
            subtitle='Se asignarán por defecto al asociar este plan a una compañía:'
          />

          <Grid item xs={12} sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Controller
              name='isDefault'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={e => field.onChange(e.target.checked)} />}
                  label='Plan predeterminado para altas'
                />
              )}
            />
            <Controller
              name='isActive'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={e => field.onChange(e.target.checked)} />}
                  label='Plan activo'
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button variant='outlined' color='secondary' onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type='submit' variant='contained' disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={22} color='inherit' /> : 'Guardar Plan'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  )
}

export default PlanFormDrawer
