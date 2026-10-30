// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Services
import apiConnector from 'src/services/api.service'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

// ** Types
type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'READ'

interface AuditLogEntry {
  id: number
  entity: string
  entityId: string | null
  action: AuditAction
  actionLabel: string | null
  description: string | null
  payload: any
  ipAddress: string | null
  userName: string | null
  companyId: number | null
  branchId: number | null
  userId: number
  createdAt: string
}

interface Props {
  userId: number
}

// ** Map action → timeline dot color
const actionColorMap: Record<AuditAction, 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary'> = {
  CREATE: 'success',
  UPDATE: 'primary',
  DELETE: 'error',
  LOGIN: 'info',
  LOGOUT: 'secondary',
  READ: 'warning'
}

// ** Map action → icon
const actionIconMap: Record<AuditAction, string> = {
  CREATE: 'tabler:plus',
  UPDATE: 'tabler:pencil',
  DELETE: 'tabler:trash',
  LOGIN: 'tabler:login',
  LOGOUT: 'tabler:logout',
  READ: 'tabler:eye'
}

// ** Label for action
const actionLabelMap: Record<AuditAction, string> = {
  CREATE: 'Creó',
  UPDATE: 'Actualizó',
  DELETE: 'Eliminó',
  LOGIN: 'Inició sesión',
  LOGOUT: 'Cerró sesión',
  READ: 'Consultó'
}

const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`

  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const buildTitle = (entry: AuditLogEntry): string => {
  const actionLabel = actionLabelMap[entry.action] ?? entry.action
  if (entry.entity) {
    return `${actionLabel} ${entry.entity}${entry.entityId ? ` #${entry.entityId}` : ''}`
  }

  return actionLabel
}

const ActivityTimeline = ({ userId }: Props) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    apiConnector
      .get<{ data: AuditLogEntry[]; total: number }>('/audit', { userId, limit: 20 })
      .then((res: any) => {
        setLogs(res?.data ?? [])
      })
      .catch(() => {
        setLogs([])
      })
      .finally(() => setLoading(false))
  }, [userId])

  return (
    <Card>
      <CardHeader
        title='Actividad reciente'
        sx={{ '& .MuiCardHeader-avatar': { mr: 3 } }}
        titleTypographyProps={{ sx: { color: 'text.primary' } }}
        avatar={<Icon fontSize='1.25rem' icon='tabler:list-details' />}
      />
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={32} />
          </Box>
        ) : logs.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
            <Icon fontSize='2.5rem' icon='tabler:timeline' />
            <Typography variant='body2' color='text.secondary'>
              Sin actividad registrada
            </Typography>
          </Box>
        ) : (
          <Timeline>
            {logs.map((entry, index) => {
              const isLast = index === logs.length - 1
              const color = actionColorMap[entry.action] ?? 'primary'

              return (
                <TimelineItem key={entry.id}>
                  <TimelineSeparator>
                    <TimelineDot color={color} />
                    {!isLast && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent sx={{ mt: 0, mb: isLast ? 0 : theme => `${theme.spacing(2.5)} !important` }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        justifyContent: 'space-between'
                      }}
                    >
                      {/* Izquierda: chip + descripción + entidad */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
                        <Chip
                          size='small'
                          icon={<Icon icon={actionIconMap[entry.action]} fontSize='0.875rem' />}
                          label={entry.actionLabel ?? entry.action}
                          color={color}
                          variant='outlined'
                          sx={{ height: 22, fontSize: '0.72rem', fontWeight: 600, flexShrink: 0 }}
                        />
                        <Typography
                          variant='body2'
                          sx={{ color: 'text.primary', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {entry.description ?? buildTitle(entry)}
                        </Typography>
                        {entry.entity && (
                          <Typography variant='caption' sx={{ color: 'text.disabled', flexShrink: 0 }}>
                            {entry.entity}{entry.entityId ? ` #${entry.entityId}` : ''}
                          </Typography>
                        )}
                      </Box>

                      {/* Derecha: tiempo */}
                      <Typography variant='caption' sx={{ color: 'text.disabled', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {formatRelativeTime(entry.createdAt)}
                      </Typography>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              )
            })}
          </Timeline>
        )}
      </CardContent>
    </Card>
  )
}

export default ActivityTimeline
