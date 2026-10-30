import React, { useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import { useForm, Controller } from 'react-hook-form'
import useApi from 'src/hooks/useApi'
import toast from 'react-hot-toast'
import CompanyAdminFormSection from './CompanyAdminFormSection'
import CompanyModulesSelector from './CompanyModulesSelector'

interface CompanyModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  companyData: any | null
}

interface FormData {
  name: string
  slug: string
  legalName?: string
  taxId?: string
  address?: string
  phone?: string
  email?: string
  maxUsers?: number
  enabledModules?: string[]
  adminName?: string
  adminLastName?: string
  adminEmail?: string
  adminPassword?: string
}

const DEFAULT_MODULES = ['documents', 'users', 'roles', 'audit', 'notifications']

export const CompanyModal: React.FC<CompanyModalProps> = ({
  open,
  onClose,
  onSuccess,
  companyData
}) => {
  const isEdit = Boolean(companyData)
  const api = useApi('companies')

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      slug: '',
      legalName: '',
      taxId: '',
      address: '',
      phone: '',
      email: '',
      maxUsers: 10,
      enabledModules: DEFAULT_MODULES,
      adminName: '',
      adminLastName: '',
      adminEmail: '',
      adminPassword: ''
    }
  })

  useEffect(() => {
    if (open) {
      if (companyData) {
        reset({
          name: companyData.name || '',
          slug: companyData.slug || '',
          legalName: companyData.legalName || '',
          taxId: companyData.taxId || companyData.cuit || '',
          address: companyData.address || '',
          phone: companyData.phone || '',
          email: companyData.email || '',
          maxUsers: companyData.maxUsers || 10,
          enabledModules: companyData.enabledModules || DEFAULT_MODULES
        })
      } else {
        reset({
          name: '',
          slug: '',
          legalName: '',
          taxId: '',
          address: '',
          phone: '',
          email: '',
          maxUsers: 10,
          enabledModules: DEFAULT_MODULES,
          adminName: '',
          adminLastName: '',
          adminEmail: '',
          adminPassword: ''
        })
      }
    }
  }, [open, companyData, reset])

  const handleNameChange = (val: string, onChange: (val: string) => void) => {
    onChange(val)
    if (!isEdit) {
      const generatedSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', generatedSlug)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit) {
        const patchData = {
          name: data.name,
          legalName: data.legalName,
          taxId: data.taxId,
          address: data.address,
          phone: data.phone,
          email: data.email,
          maxUsers: Number(data.maxUsers) || 10,
          enabledModules: data.enabledModules
        }
        await api.patch(companyData.id, patchData)
        toast.success('Compañía actualizada correctamente')
      } else {
        const payload: any = {
          ...data,
          maxUsers: Number(data.maxUsers) || 10
        }
        await api.create(payload)
        toast.success('Compañía y Administrador creados exitosamente')
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Error al guardar la compañía')
    }
  }

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
                rules={{ required: 'El nombre es obligatorio' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoFocus
                    fullWidth
                    label='Nombre Fantasía'
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
                rules={{
                  required: 'El slug identificador es obligatorio',
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: 'Solo minúsculas, números y guiones'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    disabled={isEdit}
                    label='Slug Identificador (Ruta / Tenant)'
                    placeholder='ej: helpcopies-scan'
                    error={Boolean(errors.slug)}
                    helperText={errors.slug?.message || 'Identificador único para carpetas y almacenamiento'}
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
                render={({ field }) => <TextField {...field} fullWidth label='CUIT / Identificación Fiscal' />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => <TextField {...field} fullWidth label='Correo de Contacto' type='email' />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => <TextField {...field} fullWidth label='Teléfono' />}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <Controller
                name='address'
                control={control}
                render={({ field }) => <TextField {...field} fullWidth label='Dirección Comercial' />}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name='maxUsers'
                control={control}
                rules={{
                  required: 'Indique el cupo de usuarios',
                  min: { value: 1, message: 'Mínimo 1' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Cupo Máx. Usuarios'
                    type='number'
                    error={Boolean(errors.maxUsers)}
                    helperText={errors.maxUsers?.message}
                  />
                )}
              />
            </Grid>

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
