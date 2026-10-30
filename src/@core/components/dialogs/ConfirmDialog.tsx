import React from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

// ** Theme Color Type
import { ThemeColor } from 'src/@core/layouts/types'

interface ConfirmDialogProps {
  open: boolean
  title?: string
  content: React.ReactNode | string
  confirmText?: string
  cancelText?: string
  color?: ThemeColor
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
  const {
    open,
    title = 'Confirm',
    content,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    color = 'primary',
    onConfirm,
    onCancel
  } = props

  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby='confirm-dialog-title' aria-describedby='confirm-dialog-description'>
      <DialogTitle id='confirm-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        {typeof content === 'string' ? (
          <DialogContentText id='confirm-dialog-description'>{content}</DialogContentText>
        ) : (
          content
        )}
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={onCancel} color='secondary'>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color={color} variant='contained'>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
