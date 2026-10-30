// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'


// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'
import authService from 'src/services/auth.service'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'

// ** Styled Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 600,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  companyName: yup.string().required('El nombre de la empresa es obligatorio'),
  companyCuit: yup.string().required('El CUIT es obligatorio'),
  companyAddress: yup.string().required('La dirección es obligatoria'),
  companyLegalName: yup.string(),
  email: yup.string().email('Debe ser un email válido').required('El email es obligatorio'),
  phone: yup.string().required('El teléfono es obligatorio'),
  password: yup.string().min(6, 'Debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirmar contraseña es obligatorio'),
  terms: yup.boolean().oneOf([true], 'Debe aceptar los términos y condiciones')
})

const defaultValues = {
  companyName: '',
  companyCuit: '',
  companyAddress: '',
  companyLegalName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  terms: false
}

const RegisterForm = () => {
  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()
  const auth = useAuth()

  // ** Form
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // ** Vars
  const { skin } = settings
  const imageSource = skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration'

  const onSubmit = async (data: any) => {
    try {
      const response = await authService.register({
        companyName: data.companyName,
        companyCuit: data.companyCuit,
        companyAddress: data.companyAddress,
        companyPhone: data.phone,
        companyLegalName: data.companyLegalName,
        companyEmail: data.email,
        name: data.companyName,
        lastName: data.companyName,
        email: data.email,
        phone: data.phone,
        password: data.password
      })

      if (response && response.accessToken) {
        toast.success('Empresa creada correctamente. ¡Bienvenido!')
        auth.setUser(response.user)
        router.replace('/dashboards')
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al crear la cuenta')
    }
  }

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <RegisterIllustration
            alt='register-illustration'
            src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
          />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                fill={theme.palette.primary.main}
                d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
              />
              <path
                fill='#161616'
                opacity={0.06}
                fillRule='evenodd'
                clipRule='evenodd'
                d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
              />
              <path
                fill='#161616'
                opacity={0.06}
                fillRule='evenodd'
                clipRule='evenodd'
                d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                fill={theme.palette.primary.main}
                d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
              />
            </svg>
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                Crea tu Empresa 🚀
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>¡Gestiona todo desde un solo lugar!</Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name='companyName'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    autoFocus
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Nombre de la Empresa'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.companyName)}
                    {...(errors.companyName && { helperText: errors.companyName.message })}
                  />
                )}
              />

              <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
                <Controller
                  name='companyCuit'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='CUIT'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.companyCuit)}
                      {...(errors.companyCuit && { helperText: errors.companyCuit.message })}
                    />
                  )}
                />

                <Controller
                  name='companyLegalName'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Razón Social'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.companyLegalName)}
                      {...(errors.companyLegalName && { helperText: errors.companyLegalName.message })}
                    />
                  )}
                />
              </Box>

              <Controller
                name='companyAddress'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Dirección de la Empresa'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.companyAddress)}
                    {...(errors.companyAddress && { helperText: errors.companyAddress.message })}
                  />
                )}
              />

              <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Correo Electrónico'
                      placeholder='admin@empresa.com'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      {...(errors.email && { helperText: errors.email.message })}
                    />
                  )}
                />

                <Controller
                  name='phone'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Teléfono'
                      placeholder='+123456789'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.phone)}
                      {...(errors.phone && { helperText: errors.phone.message })}
                    />
                  )}
                />
              </Box>



              <Controller
                name='password'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Contraseña'
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.password)}
                    {...(errors.password && { helperText: errors.password.message })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={e => e.preventDefault()}
                          >
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
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Confirmar Contraseña'
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.confirmPassword)}
                    {...(errors.confirmPassword && { helperText: errors.confirmPassword.message })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <Icon fontSize='1.25rem' icon={showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />

              <Box sx={{ mb: 4 }}>
                <Controller
                  name='terms'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      control={<Checkbox checked={value} onChange={onChange} />}
                      sx={{ mt: 0, mb: 0, '& .MuiFormControlLabel-label': { fontSize: theme.typography.body2.fontSize } }}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <Typography sx={{ color: 'text.secondary' }}>Acepto la</Typography>
                          <Typography component={LinkStyled} href='/' onClick={e => e.preventDefault()} sx={{ ml: 1 }}>
                            política de privacidad y términos
                          </Typography>
                        </Box>
                      }
                    />
                  )}
                />
                {errors.terms && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-terms'>
                    {errors.terms.message}
                  </FormHelperText>
                )}
              </Box>

              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                Crear Empresa
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>¿Ya tienes una cuenta?</Typography>
                <Typography component={LinkStyled} href='/login'>
                  Inicia sesión en su lugar
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

export default RegisterForm
