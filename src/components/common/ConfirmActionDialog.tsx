import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'

interface ConfirmActionDialogProps {
  open: boolean
  title: string
  content: string
  confirmText?: string
  cancelText?: string
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  icon?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmActionDialog: React.FC<ConfirmActionDialogProps> = ({
  open,
  title,
  content,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  color = 'primary',
  icon = 'tabler:alert-triangle',
  loading = false,
  onConfirm,
  onCancel
}) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      aria-labelledby='confirm-dialog-title'
      maxWidth='xs'
      fullWidth
    >
      <DialogTitle id='confirm-dialog-title' sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
            borderRadius: '50%',
            backgroundColor: `${color}.light`,
            color: `${color}.main`
          }}
        >
          <Icon icon={icon} fontSize={24} />
        </Box>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.secondary' }}>{content}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={onCancel} color='secondary' variant='outlined' disabled={loading}>
          {cancelText}
        </Button>
        <LoadingButton
          onClick={onConfirm}
          color={color}
          variant='contained'
          loading={loading}
          autoFocus
        >
          {confirmText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmActionDialog

