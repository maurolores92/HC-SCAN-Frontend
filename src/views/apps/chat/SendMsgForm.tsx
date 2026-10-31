// ** React Imports
import { useState, SyntheticEvent } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { SendMsgComponentType } from 'src/types/apps/chatTypes'

// ** Styled Components
const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2.5),
  boxShadow: theme.shadows[1],
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper
}))

const Form = styled('form')(({ theme }) => ({
  padding: theme.spacing(0, 5, 5)
}))

const GENERAL_SUGGESTIONS = [
  '¿Cuáles son las facturas con mayor importe?',
  '¿Qué documentos se cargaron recientemente?',
  'Resumen de gastos por proveedor',
  '¿Hay comprobantes pendientes de pago?'
]

const DOCUMENT_SUGGESTIONS = [
  '¿Cuál es el monto total y la fecha?',
  '¿Quién es el emisor y el destinatario?',
  '¿Qué conceptos o ítems incluye este documento?'
]

const SendMsgForm = (props: SendMsgComponentType) => {
  // ** Props
  const { store, dispatch, sendMsg } = props

  // ** State
  const [msg, setMsg] = useState<string>('')

  const isGeneral = !store?.selectedChat || store.selectedChat.contact.id === 0
  const suggestions = isGeneral ? GENERAL_SUGGESTIONS : DOCUMENT_SUGGESTIONS
  const isLoading = Boolean(store?.isLoadingAi)

  const handleSendWithText = (text: string) => {
    if (store && store.selectedChat && text.trim().length && !isLoading) {
      dispatch(sendMsg({ ...store.selectedChat, message: text.trim() }))
      setMsg('')
    }
  }

  const handleSendMsg = (e: SyntheticEvent) => {
    e.preventDefault()
    handleSendWithText(msg)
  }

  return (
    <Form onSubmit={handleSendMsg}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
        {suggestions.map((suggestion, idx) => (
          <Chip
            key={idx}
            size='small'
            label={suggestion}
            clickable
            disabled={isLoading}
            onClick={() => handleSendWithText(suggestion)}
            icon={<Icon icon='tabler:sparkles' fontSize='0.875rem' />}
            sx={{
              backgroundColor: 'action.hover',
              '&:hover': { backgroundColor: 'action.selected' }
            }}
          />
        ))}
      </Box>
      <ChatFormWrapper>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <CustomTextField
            fullWidth
            value={msg}
            disabled={isLoading}
            placeholder={
              isGeneral
                ? 'Haz una pregunta sobre los documentos de tu empresa (ej: montos, proveedores, fechas)...'
                : 'Pregunta cualquier dato sobre este documento específico...'
            }
            onChange={e => setMsg(e.target.value)}
            sx={{
              '& .Mui-focused': { boxShadow: 'none !important' },
              '& .MuiInputBase-input:not(textarea).MuiInputBase-inputSizeSmall': {
                p: theme => theme.spacing(1.875, 2.5)
              },
              '& .MuiInputBase-root': { border: '0 !important' }
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <Button
            type='submit'
            variant='contained'
            disabled={isLoading || !msg.trim().length}
            startIcon={
              isLoading ? (
                <CircularProgress size={16} color='inherit' />
              ) : (
                <Icon icon='tabler:send' />
              )
            }
          >
            {isLoading ? 'Consultando...' : 'Enviar'}
          </Button>
        </Box>
      </ChatFormWrapper>
    </Form>
  )
}

export default SendMsgForm
