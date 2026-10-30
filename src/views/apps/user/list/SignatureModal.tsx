import React, { useRef, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import SignatureCanvas from 'react-signature-canvas'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { updateUserSignature } from 'src/store/apps/user'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'

interface SignatureModalProps {
  open: boolean
  toggle: () => void
  userId: number | null
  existingSignature: string | null
}

const SignatureModal = ({ open, toggle, userId, existingSignature }: SignatureModalProps) => {
  const { user: authUser, setUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [canvasWidth, setCanvasWidth] = useState(480)
  const containerRef = useRef<HTMLDivElement>(null)
  const sigCanvas = useRef<SignatureCanvas>(null)
  const dispatch = useDispatch<AppDispatch>()

  const handleEntered = () => {
    if (containerRef.current) {
      const w = containerRef.current.clientWidth
      if (w > 0) setCanvasWidth(w)
    }
    setTimeout(() => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth
        if (w > 0) setCanvasWidth(w)
      }
      if (sigCanvas.current) {
        if (existingSignature) {
          sigCanvas.current.fromDataURL(existingSignature)
        } else {
          sigCanvas.current.clear()
        }
      }
    }, 50)
  }

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear()
    }
  }

  const handleSave = async () => {
    if (userId) {
      setLoading(true)
      let dataToSave = null
      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        dataToSave = sigCanvas.current.getCanvas().toDataURL('image/png')
      }

      try {
        await dispatch(updateUserSignature({ id: userId, data: { signature: dataToSave } })).unwrap()

        // Sincronizar en AuthContext y localStorage para que la firma esté disponible inmediatamente
        if (authUser && Number(authUser.id) === Number(userId)) {
          const updated = { ...authUser, signature: dataToSave }
          setUser(updated)
          window.localStorage.setItem('userData', JSON.stringify(updated))
        }

        toast.success('Firma guardada correctamente')
        toggle()
      } catch (error: any) {
        console.error('Error guardando la firma', error)
        toast.error(error.message || 'Error al guardar la firma')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleClose = () => {
    toggle()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth TransitionProps={{ onEntered: handleEntered }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Registrar Firma
        <IconButton size="small" onClick={handleClose}>
          <Icon icon="tabler:x" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Box
          ref={containerRef}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, backgroundColor: 'background.paper', position: 'relative' }}
        >
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              width: canvasWidth || 480,
              height: 200,
              style: { width: '100%', height: '200px', cursor: 'crosshair', backgroundColor: '#f8f9fa', touchAction: 'none' }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 4 }}>
        <Button variant="outlined" color="secondary" onClick={handleClear} startIcon={<Icon icon="tabler:eraser" />}>
          Limpiar
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" color="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading} startIcon={<Icon icon="tabler:check" />}>
          {loading ? 'Guardando...' : 'Guardar Firma'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SignatureModal
