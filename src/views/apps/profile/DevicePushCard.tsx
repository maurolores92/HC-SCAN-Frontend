// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Tooltip from '@mui/material/Tooltip'

// ** Core Components & Icons
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'

// ** Hook
import useWebPush from 'src/hooks/useWebPush'

const DevicePushCard = () => {
  const {
    isSupported,
    isInsecureContext,
    permission,
    isSubscribed,
    loading,
    testing,
    isPwaInstalled,
    canInstallPwa,
    subscribe,
    unsubscribe,
    sendTestPush,
    installPwa
  } = useWebPush()

  const [isIos, setIsIos] = useState<boolean>(false)

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || ''
      setIsIos(/iPhone|iPad|iPod/.test(ua) && !(window as any).MSStream)
    }
  }, [])

  const handleTogglePush = async () => {
    if (isSubscribed) {
      await unsubscribe()
    } else {
      await subscribe()
    }
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon='tabler:device-mobile-message' fontSize='1.5rem' />
            <Typography variant='h6'>Notificaciones y Dispositivo</Typography>
          </Box>
        }
        subheader='Alertas Web Push en tiempo real y acceso rápido PWA'
      />
      <CardContent sx={{ pt: 1 }}>
        {/* ========================================================= */}
        {/* SECCIÓN 1: NOTIFICACIONES WEB PUSH */}
        {/* ========================================================= */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: 2
            }}
          >
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon icon='tabler:bell-ringing' fontSize='1.2rem' />
                Notificaciones Push en este Dispositivo
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary', mt: 0.5 }}>
                Recibe avisos inmediatos en tu celular o PC incluso con la app cerrada.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {loading && <CircularProgress size={20} />}
              <Switch
                checked={isSubscribed}
                onChange={handleTogglePush}
                disabled={loading || !isSupported || permission === 'denied'}
                color='primary'
                inputProps={{ 'aria-label': 'Activar notificaciones push' }}
              />
            </Box>
          </Box>

          {/* Badges de Estado */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
            {!isSupported && (
              <CustomChip
                size='small'
                label='No compatible con este navegador'
                color='error'
                icon={<Icon icon='tabler:alert-triangle' />}
              />
            )}

            {isSupported && permission === 'denied' && (
              <CustomChip
                size='small'
                label='Bloqueado en el navegador'
                color='error'
                icon={<Icon icon='tabler:bell-off' />}
              />
            )}

            {isSupported && permission !== 'denied' && isSubscribed && (
              <CustomChip
                size='small'
                label='Activas en este dispositivo'
                color='success'
                icon={<Icon icon='tabler:bell-check' />}
              />
            )}

            {isSupported && permission !== 'denied' && !isSubscribed && (
              <CustomChip
                size='small'
                label='Desactivadas'
                color='secondary'
                icon={<Icon icon='tabler:bell-x' />}
              />
            )}
          </Box>

          {/* Advertencia si la conexión no es segura (HTTP en móvil) */}
          {isInsecureContext && (
            <Alert severity='info' icon={<Icon icon='tabler:shield-lock' />} sx={{ mb: 2 }}>
              <Typography variant='caption' component='div' sx={{ fontWeight: 600 }}>
                Conexión no cifrada (HTTP)
              </Typography>
              <Typography variant='caption'>
                Los navegadores móviles requieren HTTPS para activar notificaciones push. Para probarlas en tu celular en entorno de desarrollo, accede mediante un túnel seguro (HTTPS) o prueba directamente en computadora en <strong>localhost:3000</strong>.
              </Typography>
            </Alert>
          )}

          {/* Advertencia si el navegador tiene el permiso bloqueado */}
          {permission === 'denied' && (
            <Alert severity='warning' sx={{ mb: 2 }}>
              <Typography variant='caption' component='div' sx={{ fontWeight: 600, mb: 0.5 }}>
                El permiso de notificaciones fue bloqueado en este navegador.
              </Typography>
              <Typography variant='caption' component='div'>
                <strong>📱 En celular (Chrome / Android):</strong> Toca el icono de ajustes/deslizadores <strong>🎚️</strong> justo a la izquierda de la dirección web (o el menú <strong>⋮</strong> arriba a la derecha &gt; <em>Configuración</em> &gt; <em>Configuración de sitios</em> &gt; <em>Notificaciones</em>) y cámbialo a <strong>Permitir</strong>.
              </Typography>
              {isIos ? (
                <Typography variant='caption' component='div' sx={{ mt: 0.5 }}>
                  <strong>🍎 En iPhone (iOS):</strong> Abre <em>Ajustes del iPhone</em> &gt; busca <em>HelpCopies</em> o <em>Safari</em> &gt; <em>Notificaciones</em> y activa <strong>Permitir notificaciones</strong>. Recuerda abrir la app desde la pantalla de inicio.
                </Typography>
              ) : (
                <Typography variant='caption' component='div' sx={{ mt: 0.5 }}>
                  <strong>💻 En computadora:</strong> Haz clic en el icono del candado o ajustes a la izquierda de la URL y activa el permiso de Notificaciones.
                </Typography>
              )}
            </Alert>
          )}

          {/* Botón de prueba push */}
          {isSubscribed && (
            <Box sx={{ mt: 2 }}>
              <Tooltip title='Envía una alerta push instantánea desde el servidor para comprobar la recepción'>
                <span>
                  <Button
                    size='small'
                    variant='outlined'
                    color='primary'
                    onClick={sendTestPush}
                    disabled={testing || loading}
                    startIcon={
                      testing ? <CircularProgress size={16} color='inherit' /> : <Icon icon='tabler:send' />
                    }
                  >
                    {testing ? 'Enviando prueba...' : 'Probar Notificación Push'}
                  </Button>
                </span>
              </Tooltip>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ========================================================= */}
        {/* SECCIÓN 2: APLICACIÓN WEB PROGRESIVA (PWA) */}
        {/* ========================================================= */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: 2
            }}
          >
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon icon='tabler:device-mobile' fontSize='1.2rem' />
                Aplicación HelpCopies ERP (PWA)
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary', mt: 0.5 }}>
                Instala HelpCopies como aplicación nativa en tu pantalla de inicio o escritorio sin ocupar memoria extra.
              </Typography>
            </Box>

            <Box>
              {isPwaInstalled ? (
                <CustomChip
                  size='small'
                  label='Instalada en este equipo'
                  color='success'
                  icon={<Icon icon='tabler:circle-check' />}
                />
              ) : canInstallPwa ? (
                <CustomChip
                  size='small'
                  label='Lista para instalar'
                  color='info'
                  icon={<Icon icon='tabler:download' />}
                />
              ) : (
                <CustomChip
                  size='small'
                  label='Modo Navegador Web'
                  color='secondary'
                  icon={<Icon icon='tabler:browser' />}
                />
              )}
            </Box>
          </Box>

          {/* Botón de instalación nativa (Android / Chrome / Edge) */}
          {canInstallPwa && !isPwaInstalled && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant='contained'
                color='primary'
                size='small'
                onClick={installPwa}
                startIcon={<Icon icon='tabler:download' />}
              >
                Instalar Aplicación en este Dispositivo
              </Button>
            </Box>
          )}

          {/* Guía para dispositivos iOS (iPhone / iPad) */}
          {isIos && !isPwaInstalled && (
            <Alert severity='info' icon={<Icon icon='tabler:brand-apple' />} sx={{ mt: 2 }}>
              <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                Cómo instalar en iPhone / iPad:
              </Typography>
              <Typography variant='caption' component='div' sx={{ mt: 0.5 }}>
                1. Toca el botón <strong>Compartir</strong> (el cuadrado con la flecha hacia arriba) en Safari.
                <br />
                2. Desplázate hacia abajo y selecciona <strong>«Agregar al inicio»</strong>.
              </Typography>
            </Alert>
          )}

          {isPwaInstalled && (
            <Typography variant='caption' sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Icon icon='tabler:check' fontSize='1rem' />
              Estás navegando desde la aplicación instalada con soporte de ejecución en pantalla completa y segundo plano.
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default DevicePushCard

