// ** React Imports
import { useState, ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'
import Head from 'next/head'

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme, alpha } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Hooks & Context
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'

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
    maxWidth: 520,
    padding: theme.spacing(8, 12)
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 580,
    padding: theme.spacing(10, 14)
  }
}))

const FeatureCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(3, 4),
  borderRadius: 16,
  backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.6 : 0.85),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
  transition: 'transform 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    borderColor: alpha(theme.palette.primary.main, 0.4)
  }
}))

const schema = yup.object().shape({
  username: yup.string().required('El usuario o correo es obligatorio'),
  password: yup
    .string()
    .min(5, 'La contraseña debe tener al menos 5 caracteres')
    .required('La contraseña es obligatoria')
})

const defaultValues = {
  password: '',
  username: ''
}

interface FormData {
  username: string
  password: string
}

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const { settings, saveSettings } = useSettings()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    const { username, password } = data
    setLoading(true)

    auth.login({ username, password, rememberMe }, (err: any) => {
      setLoading(false)
      const errorMsg = err?.response?.data?.message || 'Usuario o contraseña inválida'
      toast.error(errorMsg, { position: 'top-right' })
      setError('username', {
        type: 'manual',
        message: errorMsg
      })
    })
  }

  return (
    <>
      <Head>
        <title>Iniciar Sesión | HC-SCAN - Inteligencia Documental</title>
        <meta
          name='description'
          content='Acceso seguro a HC-SCAN. Gestión multitenant de PDFs, escaneo inteligente e ingesta con IA.'
        />
      </Head>

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          backgroundColor: 'background.default',
          position: 'relative'
        }}
      >
        {/* Switcher de Modo Claro / Oscuro superior */}
        <Box
          sx={{
            position: 'absolute',
            top: 24,
            right: 24,
            zIndex: 10
          }}
        >
          <ModeToggler settings={settings} saveSettings={saveSettings} />
        </Box>

        {/* Sección Izquierda: Hero & Branding */}
        {!isMobile && (
          <HeroWrapper>
            <Box sx={{ maxWidth: 520, zIndex: 2 }}>
              {/* Badge Logo */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`,
                    color: 'common.white',
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`
                  }}
                >
                  <Icon icon='tabler:scan' fontSize={30} />
                </Box>
                <Box>
                  <Typography variant='h4' sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                    HC-SCAN
                  </Typography>
                  <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.5px' }}>
                    INTELLIGENT DOCUMENT AI
                  </Typography>
                </Box>
              </Box>

              <Typography variant='h3' sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
                Gestión y Extracción Inteligente de Documentos PDF
              </Typography>

              <Typography variant='body1' sx={{ color: 'text.secondary', mb: 6, fontSize: '1.05rem', lineHeight: 1.6 }}>
                Almacenamiento corporativo multitenant, ingesta mediante Web y FTP automatizado, y lectura estructurada con Inteligencia Artificial.
              </Typography>

              {/* Tarjetas de Features */}
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
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      color: 'primary.main'
                    }}
                  >
                    <Icon icon='tabler:files' fontSize={24} />
                  </Box>
                  <Box>
                    <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                      Ingesta Dual de Archivos
                    </Typography>
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                      Carga directa por aplicación web y sincronización por FTP con hash SHA256.
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
                      backgroundColor: alpha(theme.palette.info.main, 0.12),
                      color: 'info.main'
                    }}
                  >
                    <Icon icon='tabler:cpu' fontSize={24} />
                  </Box>
                  <Box>
                    <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                      Extracción Asistida por IA
                    </Typography>
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                      Reconocimiento de campos clave y consulta estructurada en base de datos.
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
                      backgroundColor: alpha(theme.palette.success.main, 0.12),
                      color: 'success.main'
                    }}
                  >
                    <Icon icon='tabler:shield-lock' fontSize={24} />
                  </Box>
                  <Box>
                    <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                      Seguridad y Multitenancy
                    </Typography>
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                      Aislamiento absoluto por tenant, control estricto de cupos y permisos CASL.
                    </Typography>
                  </Box>
                </FeatureCard>
              </Stack>
            </Box>
          </HeroWrapper>
        )}

        {/* Sección Derecha: Formulario de Login */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper',
            p: 4
          }}
        >
          <FormWrapper>
            {/* Header Móvil */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'primary.main',
                    color: 'common.white'
                  }}
                >
                  <Icon icon='tabler:scan' fontSize={26} />
                </Box>
                <Typography variant='h5' sx={{ fontWeight: 800 }}>
                  HC-SCAN
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 5 }}>
              <Typography variant='h4' sx={{ fontWeight: 700, mb: 1, letterSpacing: '-0.5px' }}>
                Bienvenido de nuevo 👋
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Ingresa tus credenciales para acceder a la plataforma
              </Typography>
            </Box>

            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='username'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label='Usuario o Correo Electrónico'
                      placeholder='ej: admin@empresa.com'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.username)}
                      {...(errors.username && { helperText: errors.username.message })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='tabler:user' fontSize={20} />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label='Contraseña'
                      placeholder='••••••••'
                      onChange={onChange}
                      error={Boolean(errors.password)}
                      {...(errors.password && { helperText: errors.password.message })}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='tabler:lock' fontSize={20} />
                          </InputAdornment>
                        ),
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

              <Box
                sx={{
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <FormControlLabel
                  label='Recordar sesión'
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      color='primary'
                    />
                  }
                />
                <Typography
                  variant='body2'
                  component={Link}
                  href='/forgot-password'
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Typography>
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
                {loading ? <CircularProgress size={24} color='inherit' /> : 'Ingresar a la Plataforma'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                ¿Tu empresa aún no tiene cuenta?{' '}
                <Typography
                  component={Link}
                  href='/register'
                  variant='body2'
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Probar 6 días gratis
                </Typography>
              </Typography>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                HC-SCAN © {new Date().getFullYear()} • Plataforma SaaS Multitenant
              </Typography>
            </Box>
          </FormWrapper>
        </Box>
      </Box>
    </>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
