// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'
import Head from 'next/head'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme, alpha } from '@mui/material/styles'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Contexts
import { useSettings } from 'src/@core/hooks/useSettings'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

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

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(6, 8),
  [theme.breakpoints.up('md')]: {
    maxWidth: 500,
    padding: theme.spacing(8, 12)
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize,
  fontWeight: 500,
  '&:hover': { textDecoration: 'underline' }
}))

const ForgotPassword = () => {
  const theme = useTheme()
  const { settings, saveSettings } = useSettings()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <>
      <Head>
        <title>Recuperar Contraseña | HC-SCAN</title>
        <meta
          name='description'
          content='Recupera el acceso a tu cuenta de HC-SCAN con tu correo electrónico.'
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

        {!isMobile && (
          <HeroWrapper>
            <Box sx={{ maxWidth: 460, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                  mb: 4
                }}
              >
                <Icon icon='tabler:key' fontSize={36} />
              </Box>
              <Typography variant='h4' sx={{ fontWeight: 800, mb: 2 }}>
                Seguridad de Cuentas
              </Typography>
              <Typography variant='body1' sx={{ color: 'text.secondary' }}>
                Protegemos la información corporativa de tu organización mediante autenticación cifrada y validación de tokens seguros.
              </Typography>
            </Box>
          </HeroWrapper>
        )}

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
          <RightWrapper>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h4' sx={{ mb: 1.5, fontWeight: 700, letterSpacing: '-0.5px' }}>
                ¿Olvidaste tu contraseña? 🔒
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Ingresa tu correo electrónico registrado y te enviaremos las instrucciones de recuperación.
              </Typography>
            </Box>

            <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
              <CustomTextField
                fullWidth
                autoFocus
                type='email'
                label='Correo Electrónico'
                placeholder='tu-email@empresa.com'
                sx={{ display: 'flex', mb: 4 }}
              />
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 4, py: 3, borderRadius: 2 }}>
                Enviar enlace de recuperación
              </Button>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LinkStyled href='/login'>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' style={{ marginRight: '0.5rem' }} />
                  <span>Volver al inicio de sesión</span>
                </LinkStyled>
              </Typography>
            </form>
          </RightWrapper>
        </Box>
      </Box>
    </>
  )
}

ForgotPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
ForgotPassword.guestGuard = true

export default ForgotPassword
