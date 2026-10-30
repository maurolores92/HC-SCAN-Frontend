/* eslint-disable lines-around-comment */
// ** React Imports
import { useRef, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Signature Canvas
import SignatureCanvas from 'react-signature-canvas'

// ** Store
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { updateUserSignature } from 'src/store/apps/user'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Toast
import toast from 'react-hot-toast'

const ProfileSignature = () => {
  const { user, setUser } = useAuth()
  const dispatch = useDispatch<AppDispatch>()

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [canvasWidth, setCanvasWidth] = useState<number>(0)
  const sigCanvas = useRef<SignatureCanvas>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const signature = user?.signature

  // Sincroniza el ancho del canvas con el contenedor real para que el trazo táctil no se desfase
  useEffect(() => {
    if (!user || !editing) return

    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth
        if (w > 0) {
          setCanvasWidth(w)
        }
      }
    }

    updateWidth()

    // Timeout para asegurar que el contenedor esté medido y se restaure la firma existente si la hay
    const timer = setTimeout(() => {
      updateWidth()
      if (sigCanvas.current && signature) {
        sigCanvas.current.fromDataURL(signature)
      }
    }, 60)

    window.addEventListener('resize', updateWidth)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateWidth)
    }
  }, [editing, signature])

  // Inicializa el modo edición
  const handleStartEdit = () => {
    setEditing(true)
  }

  const handleClear = () => {
    sigCanvas.current?.clear()
  }

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    let dataToSave: string | null = null

    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      dataToSave = sigCanvas.current.getCanvas().toDataURL('image/png')
    }

    try {
      await dispatch(updateUserSignature({ id: user.id, data: { signature: dataToSave } })).unwrap()
      // Actualizar el user en el contexto local y en localStorage
      const updatedUser = { ...user, signature: dataToSave }
      setUser(updatedUser as any)
      localStorage.setItem('userData', JSON.stringify(updatedUser))
      toast.success('Firma guardada correctamente')
      setEditing(false)
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar la firma')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!user) return
    setLoading(true)
    try {
      await dispatch(updateUserSignature({ id: user.id, data: { signature: null } })).unwrap()
      const updatedUser = { ...user, signature: null }
      setUser(updatedUser as any)
      localStorage.setItem('userData', JSON.stringify(updatedUser))
      toast.success('Firma eliminada')
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar la firma')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
  }

  if (!user) return null

  return (
    <Card>
      <CardHeader
        title='Firma'
        avatar={<Icon fontSize='1.25rem' icon='tabler:signature' />}
        titleTypographyProps={{ sx: { color: 'text.primary' } }}
        sx={{ '& .MuiCardHeader-avatar': { mr: 3 } }}
        action={
          !editing && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                size='small'
                variant='outlined'
                startIcon={<Icon icon='tabler:pencil' fontSize='0.9rem' />}
                onClick={handleStartEdit}
              >
                {signature ? 'Editar' : 'Crear firma'}
              </Button>
              {signature && (
                <Button
                  size='small'
                  variant='outlined'
                  color='error'
                  disabled={loading}
                  startIcon={<Icon icon='tabler:trash' fontSize='0.9rem' />}
                  onClick={handleDelete}
                >
                  {loading ? <CircularProgress size={16} /> : 'Eliminar'}
                </Button>
              )}
            </Box>
          )
        }
      />

      <Divider />

      <CardContent>
        {editing ? (
          /* ── Modo edición: canvas dibujable ── */
          <>
            <Box
              ref={containerRef}
              sx={{
                width: '100%',
                border: '1.5px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
                mb: 1.5,
                bgcolor: '#ffffff',
                touchAction: 'none'
              }}
            >
              <SignatureCanvas
                ref={sigCanvas}
                penColor='black'
                canvasProps={{
                  width: canvasWidth || 600,
                  height: 240,
                  style: {
                    width: '100%',
                    height: '240px',
                    cursor: 'crosshair',
                    display: 'block',
                    touchAction: 'none'
                  }
                }}
              />
            </Box>

            <Typography
              variant='caption'
              sx={{
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mb: 4
              }}
            >
              <Icon icon='tabler:hand-finger' fontSize='0.95rem' />
              Firme dentro del recuadro usando su dedo, stylus o mouse
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant='outlined'
                color='secondary'
                size='small'
                startIcon={<Icon icon='tabler:eraser' />}
                onClick={handleClear}
              >
                Limpiar
              </Button>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant='outlined' color='secondary' size='small' onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button
                  variant='contained'
                  size='small'
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} color='inherit' /> : <Icon icon='tabler:check' />}
                  onClick={handleSave}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
              </Box>
            </Box>
          </>
        ) : signature ? (
          /* ── Vista de firma existente ── */
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 3,
              bgcolor: '#ffffff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 180,
              width: '100%'
            }}
          >
            <img
              src={signature}
              alt='Firma del usuario'
              style={{ maxWidth: '100%', maxHeight: 220, objectFit: 'contain' }}
            />
          </Box>
        ) : (
          /* ── Sin firma ── */
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              gap: 2,
              color: 'text.secondary',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1
            }}
          >
            <Icon fontSize='2.5rem' icon='tabler:signature-off' />
            <Typography variant='body2'>No hay firma registrada</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default ProfileSignature
