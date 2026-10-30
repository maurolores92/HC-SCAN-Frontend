import React, { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const schema = yup.object().shape({
  roleName: yup.string().required('El nombre del rol es obligatorio'),
  selectedPermissionIds: yup.array().of(yup.number().required()).min(1, 'Debes seleccionar al menos un permiso').required()
})

export type RoleFormData = yup.InferType<typeof schema>

export interface RoleEditModalProps {
  open: boolean
  onClose: () => void
  role: any | null // Si es null, es modo Agregar
  permissionsList: any[]
  isSaving: boolean
  onSubmit: (mode: 'Agregar' | 'Editar', roleId: number | null, payload: any) => void
}

const RoleEditModal: React.FC<RoleEditModalProps> = ({
  open,
  onClose,
  role,
  permissionsList,
  isSaving,
  onSubmit
}) => {
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState<boolean>(false)

  const dialogTitle = role ? 'Editar' : 'Agregar'

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RoleFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      roleName: '',
      selectedPermissionIds: []
    }
  })

  useEffect(() => {
    if (open) {
      if (role) {
        const currentPermIds = role.permissions ? role.permissions.map((p: any) => Number(p.id)) : []
        reset({
          roleName: role.name || '',
          selectedPermissionIds: currentPermIds
        })
      } else {
        reset({
          roleName: '',
          selectedPermissionIds: []
        })
      }
    }
  }, [open, role, reset])

  const watchPermissionIds = watch('selectedPermissionIds') || []
  const selectedCount = watchPermissionIds.length
  const totalCount = permissionsList.length

  useEffect(() => {
    if (selectedCount > 0 && selectedCount < totalCount) {
      setIsIndeterminateCheckbox(true)
    } else {
      setIsIndeterminateCheckbox(false)
    }
  }, [selectedCount, totalCount])

  const togglePermission = (id: number) => {
    const currentIds = [...watchPermissionIds]
    if (currentIds.includes(id)) {
      setValue('selectedPermissionIds', currentIds.filter(pid => pid !== id), { shouldValidate: true })
    } else {
      setValue('selectedPermissionIds', [...currentIds, id], { shouldValidate: true })
    }
  }

  const handleSelectAllCheckbox = () => {
    if (isIndeterminateCheckbox || watchPermissionIds.length === permissionsList.length) {
      setValue('selectedPermissionIds', [], { shouldValidate: true })
    } else {
      setValue('selectedPermissionIds', permissionsList.map(p => Number(p.id)), { shouldValidate: true })
    }
  }

  const isSystemRole = Boolean(role && ['superadmin', 'admin', 'tecnico', 'jefe_deposito', 'gerente_soporte_tecnico'].includes(role.slug))

  const handleFormSubmit = (data: RoleFormData) => {
    const payload: any = {
      name: isSystemRole ? role.name : data.roleName,
      permissions: data.selectedPermissionIds
    }
    if (!isSystemRole) {
      payload.slug = data.roleName.toLowerCase().replace(/\s+/g, '-')
      payload.color = 'primary'
    }

    onSubmit(dialogTitle, role?.id || null, payload)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  // Agrupar permisos por categoría
  const groupedPermissions = permissionsList.reduce((acc: any, perm: any) => {
    const category = perm.categoria || 'GENERAL'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(perm)
    
return acc
  }, {})

  const categories = Object.keys(groupedPermissions)

  return (
    <Dialog fullWidth maxWidth='md' scroll='body' onClose={handleClose} open={open}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{`${dialogTitle} Rol`}</Typography>
          <Typography color='text.secondary'>
            {isSystemRole 
              ? 'Rol del sistema: solo se permite modificar y configurar los permisos asignados' 
              : 'Configura los permisos del rol'}
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <Controller
                name='roleName'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    label='Nombre del Rol'
                    placeholder='Ej: Editor'
                    value={value}
                    onChange={onChange}
                    disabled={isSystemRole}
                    helperText={isSystemRole ? 'El nombre de los roles del sistema no se puede modificar' : errors.roleName?.message}
                    error={Boolean(errors.roleName)}
                  />
                )}
              />
            </FormControl>
          </Box>
          <Typography variant='h4'>Permisos del Rol</Typography>
          {errors.selectedPermissionIds && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {errors.selectedPermissionIds.message}
            </FormHelperText>
          )}
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: '0 !important' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        whiteSpace: 'nowrap',
                        alignItems: 'center',
                        textTransform: 'capitalize',
                        '& svg': { ml: 1, cursor: 'pointer' },
                        color: theme => theme.palette.text.secondary,
                        fontSize: theme => theme.typography.h6.fontSize
                      }}
                    >
                      Permisos Disponibles
                      <Tooltip placement='top' title='Selecciona los accesos para este rol'>
                        <Box sx={{ display: 'flex' }}>
                          <Icon icon='tabler:info-circle' fontSize='1.25rem' />
                        </Box>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell align='right'>
                    <FormControlLabel
                      label='Seleccionar Todos'
                      sx={{ '& .MuiTypography-root': { textTransform: 'capitalize', color: 'text.secondary' } }}
                      control={
                        <Checkbox
                          size='small'
                          onChange={handleSelectAllCheckbox}
                          indeterminate={isIndeterminateCheckbox}
                          checked={permissionsList.length > 0 && watchPermissionIds.length === permissionsList.length}
                        />
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <React.Fragment key={category}>
                    <TableRow>
                      <TableCell colSpan={2} sx={{ py: 3, backgroundColor: 'action.hover' }}>
                        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                          {category.replace(/_/g, ' ')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {groupedPermissions[category].map((perm: any) => (
                      <TableRow key={perm.id} sx={{ '& .MuiTableCell-root:first-of-type': { pl: '1rem !important' } }}>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            fontSize: theme => theme.typography.h6.fontSize
                          }}
                        >
                          {perm.displayName || perm.name}
                          <Typography variant='body2' sx={{ color: 'text.secondary', fontWeight: 'normal' }}>
                            {perm.description}
                          </Typography>
                        </TableCell>
                        <TableCell align='right'>
                          <Checkbox
                            size='small'
                            id={`perm-${perm.id}`}
                            onChange={() => togglePermission(Number(perm.id))}
                            checked={watchPermissionIds.includes(Number(perm.id))}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box className='demo-space-x'>
            <Button type='submit' variant='contained' disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button color='secondary' variant='tonal' onClick={handleClose}>
              Cancelar
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RoleEditModal
