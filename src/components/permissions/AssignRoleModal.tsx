import React, { useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'

// ** Custom Components Imports
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const schema = yup.object().shape({
  displayName: yup.string().required('El nombre del permiso es obligatorio'),
  description: yup.string().required('La descripción es obligatoria'),
  roleIds: yup.array().of(yup.number().required()).required()
})

export type AssignRoleFormData = yup.InferType<typeof schema>

export interface AssignRoleModalProps {
  open: boolean
  onClose: () => void
  permission: any | null
  roles: any[]
  loadingRoles: boolean
  isUpdating: boolean
  onSubmit: (permissionId: number, data: { displayName: string; description: string; roleIds: number[] }) => void
}

const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
  open,
  onClose,
  permission,
  roles,
  loadingRoles,
  isUpdating,
  onSubmit
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AssignRoleFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      displayName: '',
      description: '',
      roleIds: []
    }
  })

  const watchRoleIds = watch('roleIds') || []

  useEffect(() => {
    if (open && permission) {
      const currentRoleIds = permission.roles ? permission.roles.map((r: any) => Number(r.id)) : []
      reset({
        displayName: permission.displayName || '',
        description: permission.description || '',
        roleIds: currentRoleIds
      })
    } else if (!open) {
      reset({
        displayName: '',
        description: '',
        roleIds: []
      })
    }
  }, [open, permission, reset])

  const handleRoleToggle = (roleId: any) => {
    const currentId = Number(roleId)
    const currentRoleIds = [...watchRoleIds]
    if (currentRoleIds.includes(currentId)) {
      setValue('roleIds', currentRoleIds.filter(id => id !== currentId), { shouldValidate: true })
    } else {
      setValue('roleIds', [...currentRoleIds, currentId], { shouldValidate: true })
    }
  }

  const handleFormSubmit = (data: AssignRoleFormData) => {
    if (permission) {
      onSubmit(permission.id, {
        displayName: data.displayName,
        description: data.description,
        roleIds: data.roleIds
      })
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog maxWidth='sm' fullWidth onClose={handleClose} open={open}>
      <DialogTitle
        sx={{
          textAlign: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Typography variant='h5' component='span' sx={{ mb: 2 }}>
          Asignar Roles a Permiso
        </Typography>
        <Typography variant='body2'>Selecciona los roles que tendrán este permiso habilitado.</Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Box component='form' sx={{ mt: 4 }} onSubmit={handleSubmit(handleFormSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='displayName'
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  label='Nombre del Permiso'
                  placeholder='Ej: Crear Usuarios'
                  error={Boolean(errors.displayName)}
                  helperText={errors.displayName?.message}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  label='Descripción'
                  placeholder='Descripción del permiso'
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                />
              )}
            />
          </FormControl>

          <Typography variant='h6' sx={{ mb: 2 }}>
            Roles:
          </Typography>

          {loadingRoles ? (
            <CircularProgress size={30} />
          ) : (
            <FormGroup sx={{ mb: 4 }}>
              {roles.map(role => (
                <FormControlLabel
                  key={role.id}
                  control={
                    <Checkbox
                      checked={watchRoleIds.includes(Number(role.id))}
                      onChange={() => handleRoleToggle(role.id)}
                    />
                  }
                  label={role.name}
                />
              ))}
            </FormGroup>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3, mt: 4 }}>
            <Button color='secondary' variant='tonal' onClick={handleClose}>
              Cancelar
            </Button>
            <Button type='submit' variant='contained' disabled={isUpdating}>
              {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default AssignRoleModal
