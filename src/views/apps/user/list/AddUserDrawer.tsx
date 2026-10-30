// ** React Imports
import { useState, useEffect, useMemo } from 'react'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch } from 'react-redux'
import { addUser, updateUser, changeUserPassword } from 'src/store/apps/user'
import { AppDispatch } from 'src/store'
import { UsersType } from 'src/types/apps/userTypes'
import apiConnector from 'src/services/api.service'
import { useAuth } from 'src/hooks/useAuth'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
  editData?: UsersType | null
  isPasswordMode?: boolean
  onUserUpdated?: (user: UsersType) => void
}

interface UserData {
  name: string
  lastName: string
  username: string
  email: string
  phone: string
  roleId: number | string
  password?: string
  confirmPassword?: string
  clave?: string
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 90,
  height: 90,
  borderRadius: '50%',
  objectFit: 'cover',
  border: `2px solid ${theme.palette.divider}`
}))

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const isSuperAdminUser = (data?: UsersType | null, auth?: any): boolean => {
  if (!data) return false
  if (data.username?.toLowerCase() === 'superadmin') return true
  if (typeof data.role === 'string') {
    const r = data.role.toLowerCase()
    if (r === 'superadmin' || r === 'super admin' || r === 'super_admin') return true
  }
  if (typeof data.role === 'object' && data.role !== null) {
    const slug = (((data.role as any).slug || (data.role as any).name || '') as string).toLowerCase()
    if (slug === 'superadmin' || slug === 'super admin' || slug === 'super_admin') return true
  }
  if (auth && auth.id === data.id) {
    const authRole = typeof auth.role === 'string' ? auth.role : (auth.role?.slug || auth.role?.name || '')
    if (authRole?.toLowerCase() === 'superadmin') return true
  }

  return false
}

const getSchema = (isEdit: boolean, isPasswordMode: boolean, isSuperAdmin = false) => {
  if (isPasswordMode) {
    return yup.object().shape({
      password: yup.string().required('Password is required').min(5, 'Must be at least 5 characters'),
      confirmPassword: yup
        .string()
        .required('Confirm Password is required')
        .oneOf([yup.ref('password'), ''], 'Passwords must match')
    })
  }

  return yup.object().shape({
    name: yup.string().required('Name is required'),
    lastName: yup.string().required('Last Name is required'),
    username: yup.string().required('Username is required'),
    email: yup.string().email().required('Email is required'),
    phone: yup.string(),
    roleId: isSuperAdmin
      ? yup.mixed().notRequired()
      : yup
          .mixed()
          .test('role-is-required', 'Role is required', function (value) {
            if (isSuperAdmin) return true
            if (value === undefined || value === null || value === '') return false

            return !isNaN(Number(value))
          }),
    clave: yup
      .string()
      .test('clave-min-max', 'La clave debe ser de exactamente 4 dígitos numéricos', val => {
        if (!val || val.trim() === '') return true

        return /^\d{4}$/.test(val.trim())
      }),
    password: isEdit ? yup.string() : yup.string().required('Password is required').min(5, 'Must be at least 5 characters'),
    confirmPassword: isEdit ? yup.string() : yup.string().required('Confirm Password is required').oneOf([yup.ref('password'), ''], 'Passwords must match')
  })
}

const defaultValues = {
  name: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  roleId: '',
  clave: '',
  password: '',
  confirmPassword: ''
}

const SidebarAddUser = (props: SidebarAddUserType) => {
  const { open, toggle, editData, isPasswordMode } = props
  const [roles, setRoles] = useState<any[]>([])
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [imgSrc, setImgSrc] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { user: authUser, setUser: setAuthUser } = useAuth()
  const dispatch = useDispatch<AppDispatch>()

  const isSuperAdmin = useMemo(() => {
    return isSuperAdminUser(editData, authUser)
  }, [editData, authUser])

  useEffect(() => {
    if (!isPasswordMode) {
      apiConnector.get('/role?includeSuperAdmin=true').then((res: any) => {
        setRoles(res || [])
      }).catch(err => console.error(err))
    }
  }, [isPasswordMode])

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(getSchema(!!editData, !!isPasswordMode, isSuperAdmin))
  })

  useEffect(() => {
    if (editData && open) {
      setValue('name', editData.name || '')
      setValue('lastName', editData.lastName || '')
      setValue('username', (editData as any).username || '')
      setValue('email', editData.email || '')
      setValue('phone', editData.phone || '')

      let rId = '';
      if (editData.roleId) {
        rId = String(editData.roleId);
      } else if (typeof editData.role === 'object' && editData.role !== null) {
        rId = String((editData.role as any).id || '');
      } else if (typeof editData.role === 'string' && roles.length > 0) {
        const matching = roles.find(
          (r: any) =>
            (r.slug && r.slug.toLowerCase() === editData.role.toLowerCase()) ||
            (r.name && r.name.toLowerCase() === editData.role.toLowerCase())
        );
        if (matching) {
          rId = String(matching.id);
        }
      }
      setValue('roleId', rId || '')
      if (isSuperAdmin) {
        clearErrors('roleId')
      }

      setValue('clave', (editData as any).clave || '')
      setValue('password', '')
      setValue('confirmPassword', '')

      if (editData.image) {
        setImgSrc(
          editData.image.startsWith('http')
            ? editData.image
            : `${process.env.NEXT_PUBLIC_API_URL}/images/users/${editData.image}`
        )
      } else {
        setImgSrc('')
      }
      setSelectedFile(null)
    } else if (!open) {
      reset(defaultValues)
      setImgSrc('')
      setSelectedFile(null)
      setShowPassword(false)
      setShowConfirmPassword(false)
    }
  }, [editData, open, setValue, reset, isPasswordMode, isSuperAdmin, roles, clearErrors])

  const handleInputImageChange = (file: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      const fileToUpload = files[0]
      if (fileToUpload.size > 2 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 2MB')

        return
      }
      setSelectedFile(fileToUpload)
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(fileToUpload)
    }
  }

  const handleResetImage = () => {
    setImgSrc('')
    setSelectedFile(null)
  }

  const onSubmit = async (data: UserData) => {
    try {
      if (isPasswordMode && editData) {
        await dispatch(changeUserPassword({ id: editData.id, data: { password: data.password } })).unwrap()
        toast.success('Contraseña actualizada correctamente')
      } else if (editData) {
        let finalImage: string | null = editData.image || null

        if (selectedFile) {
          const formData = new FormData()
          formData.append('file', selectedFile)

          try {
            const uploadRes: any = await apiConnector.sendFile('/uploads/users', formData)
            finalImage = uploadRes.fileName
          } catch (err: any) {
            toast.error(err?.message || 'Error al subir la imagen de perfil')

            return
          }
        } else if (imgSrc === '') {
          finalImage = null
        }

        const payload: any = {
          name: data.name,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
          phone: data.phone,
          clave: data.clave && data.clave.trim() ? data.clave.trim() : null,
          image: finalImage
        }

        if (!isSuperAdmin && data.roleId && !isNaN(Number(data.roleId))) {
          payload.roleId = Number(data.roleId)
        }

        await dispatch(updateUser({ id: editData.id, data: payload })).unwrap()

        if (authUser && authUser.id === editData.id) {
          setAuthUser({
            ...authUser,
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            username: data.username,
            phone: data.phone,
            image: finalImage
          })
        }

        if (props.onUserUpdated) {
          props.onUserUpdated({ ...(editData as any), ...payload, image: finalImage })
        }

        toast.success('Usuario actualizado correctamente')
      } else {
        let finalImage: string | null = null

        if (selectedFile) {
          const formData = new FormData()
          formData.append('file', selectedFile)

          try {
            const uploadRes: any = await apiConnector.sendFile('/uploads/users', formData)
            finalImage = uploadRes.fileName
          } catch (err: any) {
            toast.error(err?.message || 'Error al subir la imagen de perfil')

            return
          }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword: _cp, ...payload } = data;
        await dispatch(addUser({
          ...payload,
          roleId: Number(data.roleId),
          clave: data.clave && data.clave.trim() ? data.clave.trim() : null,
          image: finalImage
        })).unwrap()
        toast.success('Usuario creado correctamente')
      }
      handleClose()
    } catch (error: any) {
      toast.error(error.message || 'Error procesando la solicitud')
    }
  }

  const handleClose = () => {
    toggle()
    reset(defaultValues)
    setImgSrc('')
    setSelectedFile(null)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const getTitle = () => {
    if (isPasswordMode) return 'Cambiar Contraseña'

    return editData ? 'Editar Usuario' : 'Agregar Usuario'
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='sm'
      scroll='body'
    >
      <Header>
        <Typography variant='h5'>{getTitle()}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <DialogContent sx={{ p: theme => `${theme.spacing(0, 6, 6)} !important` }}>
        <form onSubmit={handleSubmit(onSubmit)}>

          {!isPasswordMode && (
            <>
              {/* Subida de Imagen de Perfil */}
              <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                {imgSrc ? (
                  <ImgStyled src={imgSrc} alt='Foto de perfil' />
                ) : (
                  <Box
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: '50%',
                      backgroundColor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: theme => `1px dashed ${theme.palette.divider}`
                    }}
                  >
                    <Icon icon='tabler:user' fontSize='2.5rem' color='action.active' />
                  </Box>
                )}
                <Box sx={{ ml: 4 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Button component='label' variant='contained' size='small' htmlFor='user-upload-image'>
                      Subir Foto
                      <input
                        hidden
                        type='file'
                        accept='image/png, image/jpeg, image/webp'
                        onChange={handleInputImageChange}
                        id='user-upload-image'
                      />
                    </Button>
                    <Button color='secondary' variant='tonal' size='small' onClick={handleResetImage}>
                      Quitar
                    </Button>
                  </Box>
                  <Typography variant='caption' sx={{ mt: 1.5, display: 'block', color: 'text.secondary' }}>
                    Permitido JPG, PNG o WEBP. Máx 2 MB.
                  </Typography>
                </Box>
              </Box>
              <Controller
                name='name'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Nombre'
                    onChange={onChange}
                    error={Boolean(errors.name)}
                    {...(errors.name && { helperText: errors.name?.message })}
                  />
                )}
              />
              <Controller
                name='lastName'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Apellido'
                    onChange={onChange}
                    error={Boolean(errors.lastName)}
                    {...(errors.lastName && { helperText: errors.lastName?.message })}
                  />
                )}
              />
              <Controller
                name='username'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Nombre de Usuario'
                    onChange={onChange}
                    error={Boolean(errors.username)}
                    {...(errors.username && { helperText: errors.username?.message })}
                  />
                )}
              />
              <Controller
                name='email'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='email'
                    label='Correo electronico'
                    value={value}
                    sx={{ mb: 4 }}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    {...(errors.email && { helperText: errors.email?.message })}
                  />
                )}
              />
              <Controller
                name='phone'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Telefono'
                    onChange={onChange}
                    error={Boolean(errors.phone)}
                    {...(errors.phone && { helperText: errors.phone?.message })}
                  />
                )}
              />
              {!isSuperAdmin && (
                <Controller
                  name='roleId'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      value={value}
                      sx={{ mb: 4 }}
                      label='Rol'
                      onChange={onChange}
                      error={Boolean(errors.roleId)}
                      {...(errors.roleId && { helperText: errors.roleId?.message })}
                      SelectProps={{ value: value, onChange: e => onChange(e) }}
                    >
                      <MenuItem value=''>Select Role</MenuItem>
                      {roles.map((r: any) => (
                        <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              )}
              <Controller
                name='clave'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value || ''}
                    sx={{ mb: 6 }}
                    label='Clave (PIN 4 dígitos)'
                    placeholder='Ej: 1234'
                    inputProps={{
                      maxLength: 4,
                      inputMode: 'numeric'
                    }}
                    onChange={e => {
                      const numericOnly = e.target.value.replace(/\D/g, '').slice(0, 4)
                      onChange(numericOnly)
                    }}
                    error={Boolean(errors.clave)}
                    helperText={
                      errors.clave
                        ? (errors.clave.message as string)
                        : 'Clave numérica de 4 dígitos (mínimo 4 y máximo 4 dígitos) para identificar al operador'
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Icon icon='tabler:key' />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </>
          )}

          {(!editData || isPasswordMode) && (
            <>
              <Controller
                name='password'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    sx={{ mb: 4 }}
                    label='Contraseña'
                    onChange={onChange}
                    error={Boolean(errors.password)}
                    {...(errors.password && { helperText: errors.password?.message })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                            <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <Controller
                name='confirmPassword'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={value}
                    sx={{ mb: 6 }}
                    label='Confirmar Contraseña'
                    onChange={onChange}
                    error={Boolean(errors.confirmPassword)}
                    {...(errors.confirmPassword && { helperText: errors.confirmPassword?.message })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton edge='end' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Icon fontSize='1.25rem' icon={showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              {isPasswordMode || editData ? 'Editar' : 'Crear'}
            </Button>
            <Button variant='tonal' color='secondary' onClick={handleClose}>
              Cancelar
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SidebarAddUser
