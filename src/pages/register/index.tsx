// ** React Imports
import { useState, ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme, alpha } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Services
import authService from 'src/services/auth.service'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Styled Components
const HeroWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  flex: 1,
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(8),
  margin: theme.spacing(4, 0, 4, 4),
  borderRadius: 24,
  overflow: 'hidden',
  background:
    theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.55)} 0%, #0F172A 60%, #020617 100%)`
      : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, #F1F5F9 50%, ${alpha(
          theme.palette.info.light,
          0.18
        )} 100%)`,
  border: `1px solid ${theme.palette.divider}`
}))

const FormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(6, 8),
  [theme.breakpoints.up('md')]: {
    maxWidth: 540,
    padding: theme.spacing(8, 10)
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600,
    padding: theme.spacing(8, 12)
  }
}))

const FeatureCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(3.5, 4),
  borderRadius: 16,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.paper, 0.4)
      : alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  boxShadow: theme.shadows[2],
  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[6]
  }
}))

interface FormData {
  fullName: string
  companyName: string
  email: string
  phone: string
  password: string
}

const schema = yup.object().shape({
  fullName: yup.string().required('El nombre y apellido son obligatorios'),
  companyName: yup.string().required('El nombre de la empresa es obligatorio'),
  email: yup.string().email('Debe ingresar un email válido').required('El email es obligatorio'),
  phone: yup.string().required('El teléfono de contacto es obligatorio para coordinar la prueba'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria')
})

const defaultValues: FormData = {
  fullName: '',
  companyName: '',
  email: '',
  phone: '',
  password: ''
}

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<any | null>(null)

  const theme = useTheme()
  const router = useRouter()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'))

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues,
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await authService.register(data)
      setSuccessData(response)
      toast.success('¡Cuenta y empresa creadas con éxito! Prueba de 6 días activa.')
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al crear la cuenta'
      const finalMsg = Array.isArray(msg) ? msg.join(', ') : msg
      setErrorMessage(finalMsg)
      toast.error(finalMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>HC-SCAN • Prueba Gratuita de 6 Días</title>
      </Head>

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          backgroundColor: 'background.default'
        }}
      >
        {isLargeScreen && (
          <HeroWrapper>
            <Box sx={{ width: '100%', maxWidth: 540 }}>
              <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.4)}`
                    }}
                  >
                    <Icon icon='tabler:scan' fontSize={26} />
                  </Box>
                  <Typography variant='h5' sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                    HC-SCAN
                  </Typography>
                </Box>

                <Typography
                  variant='h3'
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.15,
                    letterSpacing: -0.8,
                    mb: 2,
                    background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${theme.palette.primary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Digitalización Inteligente con IA
                </Typography>

                <Typography variant='body1' sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  Activa tu prueba gratuita de 6 días. Sin costos ocultos ni tarjeta de crédito. Equipamiento HP en comodato y software OCR inteligente.
                </Typography>
              </Box>

              <Stack spacing={3}>
                <FeatureCard elevation={0}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: alpha(theme.palette.success.main, 0.15),
                      color: 'success.main'
                    }}
                  >
                    <Icon icon='tabler:clock-bolt' fontSize={24} />
                  </Box>
                  <Box>
                    <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
                      6 Días de Prueba Completa
                    </Typography>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                      Acceso total a digitalización de comprobantes y consultas IA.
                    </Typography>
                  </Box>
                </FeatureCard>

                <FeatureCard elevation={0}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                      color: 'primary.main'
                    }}
                  >
                    <Icon icon='tabler:shield-check' fontSize={24} />
                  </Box>
                  <Box>
                    <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
                      Aislamiento por Empresa
                    </Typography>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                      Bóveda cifrada y privacidad documental estricta para tu compañía.
                    </Typography>
                  </Box>
                </FeatureCard>
              </Stack>
            </Box>
          </HeroWrapper>
        )}

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 4, sm: 6, md: 8 }
          }}
        >
          <FormWrapper>
            <Box sx={{ mb: 4 }}>
              <Typography variant='h4' sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
                Crear Cuenta de Prueba
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Comienza hoy tus 6 días de prueba gratuita en HC-Scan.
              </Typography>
            </Box>

            {errorMessage && (
              <Alert severity='error' sx={{ mb: 4 }}>
                {errorMessage}
              </Alert>
            )}

            {successData ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.success.main, 0.15),
                    color: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <Icon icon='tabler:check' fontSize={36} />
                </Box>
                <Typography variant='h5' sx={{ fontWeight: 700, mb: 2 }}>
                  ¡Bienvenido a HC-SCAN!
                </Typography>
                <Typography variant='body1' sx={{ color: 'text.secondary', mb: 4 }}>
                  Tu empresa <strong>{successData.company?.name}</strong> está lista y tu período de prueba de 6 días está activo.
                </Typography>
                <Button
                  fullWidth
                  size='large'
                  variant='contained'
                  onClick={() => router.push('/dashboards')}
                  sx={{ py: 3, fontWeight: 600 }}
                >
                  Ir al Panel de Control
                </Button>
              </Box>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Box sx={{ mb: 3 }}>
                  <Controller
                    name='fullName'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        label='Nombre y Apellido *'
                        placeholder='Juan Pérez'
                        error={Boolean(errors.fullName)}
                        {...(errors.fullName && { helperText: errors.fullName.message })}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Controller
                    name='companyName'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        label='Empresa / Razón Social *'
                        placeholder='Logística Austral S.A.'
                        error={Boolean(errors.companyName)}
                        {...(errors.companyName && { helperText: errors.companyName.message })}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Controller
                    name='email'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        type='email'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        label='Correo Electrónico Corporativo *'
                        placeholder='juan@tuempresa.com'
                        error={Boolean(errors.email)}
                        {...(errors.email && { helperText: errors.email.message })}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Controller
                    name='phone'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        label='Teléfono de Contacto / WhatsApp *'
                        placeholder='+54 11 4567-8900'
                        helperText={errors.phone ? errors.phone.message : 'Obligatorio para que podamos contactarte y coordinar el escáner.'}
                        error={Boolean(errors.phone)}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Controller
                    name='password'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onBlur={onBlur}
                        label='Contraseña *'
                        placeholder='••••••••'
                        onChange={onChange}
                        error={Boolean(errors.password)}
                        {...(errors.password && { helperText: errors.password.message })}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Box>

                <Button
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  disabled={loading}
                  sx={{
                    py: 3,
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`
                  }}
                >
                  {loading ? <CircularProgress size={24} color='inherit' /> : 'Activar mi Prueba de 6 Días Gratis'}
                </Button>
              </form>
            )}

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                ¿Ya tienes una cuenta activa?{' '}
                <Typography
                  component={Link}
                  href='/login'
                  variant='body2'
                  sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Inicia sesión aquí
                </Typography>
              </Typography>
            </Box>
          </FormWrapper>
        </Box>
      </Box>
    </>
  )
}

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
RegisterPage.guestGuard = true

export default RegisterPage

