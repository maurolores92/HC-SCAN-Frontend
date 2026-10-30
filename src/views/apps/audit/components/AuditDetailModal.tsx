// ** React Imports
import React, { useState } from 'react'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Collapse from '@mui/material/Collapse'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import { getInitials } from 'src/@core/utils/get-initials'

// ** Utils Import
import { actionColors, actionLabels, formatEntityCategory, splitDateAndTime } from '../utils/auditFormatters'

interface Props {
  open: boolean
  onClose: () => void
  audit: any | null
}

export const AuditDetailModal = ({ open, onClose, audit }: Props) => {
  const [showRawJson, setShowRawJson] = useState<boolean>(false)

  if (!audit) return null

  const { date, time } = splitDateAndTime(audit.createdAt)
  const categoryLabel = formatEntityCategory(audit.entity)
  const actionLabel = actionLabels[audit.action] || audit.actionLabel || audit.action
  const actionColor = actionColors[audit.action] || 'primary'

  // Resolver usuario responsable
  const userName = audit.user
    ? `${audit.user.name || ''} ${audit.user.lastName || ''}`.trim()
    : audit.userName || (audit.userId ? `Usuario ID #${audit.userId}` : 'Sistema')
  const userEmail = audit.user?.email || '-'
  const userRole = audit.user?.role?.name || 'Sistema'

  // Parsear payload si viene como string
  let parsedPayload: any = null
  if (audit.payload) {
    if (typeof audit.payload === 'object') {
      parsedPayload = audit.payload
    } else if (typeof audit.payload === 'string') {
      try {
        parsedPayload = JSON.parse(audit.payload)
      } catch {
        parsedPayload = audit.payload
      }
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      {/* Header */}
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              p: 1,
              borderRadius: 2,
              backgroundColor: 'rgba(156, 39, 176, 0.12)',
              color: '#9C27B0',
            }}
          >
            <Icon icon='tabler:file-search' fontSize={24} />
          </Box>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>
              Detalle de Auditoría #{audit.id}
            </Typography>
            <Typography variant='caption' sx={{ color: 'text.secondary' }}>
              Registro de trazabilidad y tareas del sistema
            </Typography>
          </Box>
        </Box>
        <IconButton size='small' onClick={onClose}>
          <Icon icon='tabler:x' fontSize={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {/* 1. Resumen de la Operación */}
          <Grid item xs={12}>
            <Card
              variant='outlined'
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: theme =>
                  theme.palette.mode === 'light' ? 'rgba(156, 39, 176, 0.03)' : 'rgba(156, 39, 176, 0.08)',
              }}
            >
              <Grid container spacing={2} alignItems='center'>
                <Grid item xs={12} sm={3}>
                  <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    Acción Realizada
                  </Typography>
                  <CustomChip
                    rounded

                    size='small'
                    color={actionColor as any}
                    label={actionLabel}
                    sx={{ fontWeight: 700 }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    Categoría
                  </Typography>
                  <CustomChip
                    rounded

                    size='small'
                    color='secondary'
                    label={categoryLabel}
                    sx={{ fontWeight: 700 }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    ID de Registro
                  </Typography>
                  <Typography variant='body2' sx={{ fontWeight: 700 }}>
                    {audit.entityId ? `#${audit.entityId}` : 'No aplica'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    Fecha y Hora
                  </Typography>
                  <Typography variant='body2' sx={{ fontWeight: 700 }}>
                    {date} {time}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* 2. Usuario Responsable */}
          <Grid item xs={12} sm={6}>
            <Card variant='outlined' sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
              <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 700, mb: 1.5, display: 'block' }}>
                USUARIO RESPONSABLE
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CustomAvatar color='primary' sx={{ width: 44, height: 44, fontWeight: 700 }}>
                  {getInitials(userName)}
                </CustomAvatar>
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography variant='subtitle2' noWrap sx={{ fontWeight: 700 }}>
                    {userName}
                  </Typography>
                  <Typography variant='caption' noWrap sx={{ color: 'text.secondary', display: 'block' }}>
                    {userEmail}
                  </Typography>
                  <CustomChip
                    rounded
                    size='small'
                    color='info'
                    label={userRole}
                    sx={{ mt: 0.5, height: 18, fontSize: '0.68rem', fontWeight: 600 }}
                  />
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* 3. Datos de Conexión */}
          <Grid item xs={12} sm={6}>
            <Card variant='outlined' sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
              <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 700, mb: 1.5, display: 'block' }}>
                INFORMACIÓN DE CONEXIÓN
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                    Dirección IP:
                  </Typography>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    {audit.ipAddress || 'Interna / No registrada'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                    Sucursal:
                  </Typography>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    {audit.branchId ? `Sucursal #${audit.branchId}` : 'General'}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* 4. Descripción de la Tarea Realizada */}
          <Grid item xs={12}>
            <Card variant='outlined' sx={{ p: 2.5, borderRadius: 2 }}>
              <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, display: 'block' }}>
                DESCRIPCIÓN DE LA TAREA REALIZADA
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  backgroundColor: theme =>
                    theme.palette.mode === 'light' ? '#F4F5FA' : '#2F3349',
                  borderLeft: '4px solid #9C27B0',
                }}
              >
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {audit.description || 'Sin descripción detallada'}
                </Typography>
              </Box>
            </Card>
          </Grid>

          {/* 5. Carga Útil / Datos Modificados (Payload) */}
          {parsedPayload && (
            <Grid item xs={12}>
              <Card variant='outlined' sx={{ p: 2.5, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 700 }}>
                    DATOS DE LA OPERACIÓN (PAYLOAD)
                  </Typography>
                  <Button
                    size='small'
                    variant='text'
                    color='primary'
                    onClick={() => setShowRawJson(prev => !prev)}
                    startIcon={<Icon icon={showRawJson ? 'tabler:chevron-up' : 'tabler:code'} fontSize={16} />}
                  >
                    {showRawJson ? 'Ocultar JSON' : 'Ver código JSON'}
                  </Button>
                </Box>

                <Collapse in={showRawJson}>
                  <Box
                    component='pre'
                    sx={{
                      p: 2,
                      mt: 1,
                      borderRadius: 1.5,
                      backgroundColor: theme =>
                        theme.palette.mode === 'light' ? '#1E1E1E' : '#141414',
                      color: '#4AF626',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      maxHeight: 240,
                      overflowY: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                    }}
                  >
                    {typeof parsedPayload === 'object'
                      ? JSON.stringify(parsedPayload, null, 2)
                      : String(parsedPayload)}
                  </Box>
                </Collapse>

                {!showRawJson && typeof parsedPayload === 'object' && !Array.isArray(parsedPayload) && (
                  <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                    {Object.entries(parsedPayload).slice(0, 8).map(([key, val]) => (
                      <Grid item xs={12} sm={6} md={3} key={key}>
                        <Box sx={{ p: 1, borderRadius: 1, border: theme => `1px solid ${theme.palette.divider}` }}>
                          <Typography variant='caption' noWrap sx={{ color: 'text.disabled', display: 'block' }}>
                            {key}:
                          </Typography>
                          <Typography variant='body2' noWrap sx={{ fontWeight: 600 }}>
                            {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '-')}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 2.5 }}>
        <Button variant='contained' color='primary' onClick={onClose} sx={{ px: 4, fontWeight: 700 }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AuditDetailModal
