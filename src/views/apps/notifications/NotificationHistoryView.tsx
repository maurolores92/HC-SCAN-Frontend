// ** React Imports
import { useEffect, useState } from 'react'

// ** Next
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import Pagination from '@mui/material/Pagination'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useTheme } from '@mui/material/styles'

// ** Icons
import Icon from 'src/@core/components/icon'

// ** Hook
import { useNotifications } from 'src/hooks/useNotifications'

// ** Types
import { NotificationType, getCategoryByType, getTypeEmoji } from 'src/types/apps/notificationTypes'

const PAGE_SIZE = 15

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const NotificationHistoryView = () => {
  const theme = useTheme()
  const router = useRouter()
  const {
    notifications,
    total,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications()

  const [page, setPage] = useState(0)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    loadNotifications(page, PAGE_SIZE)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleMarkAllRead = async () => {
    await markAllAsRead()
    loadNotifications(page, PAGE_SIZE)
  }

  const handleMarkRead = async (notif: NotificationType) => {
    if (!notif.read) await markAsRead(notif.id)
  }

  const handleDelete = async (id: number) => {
    await removeNotification(id)
  }

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 600 }}>
              Notificaciones
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButtonGroup
              size='small'
              value={filter}
              exclusive
              onChange={(_, val) => val && setFilter(val)}
            >
              <ToggleButton value='all'>Todas</ToggleButton>
              <ToggleButton value='unread'>
                Sin leer
                {unreadCount > 0 && (
                  <Chip
                    label={unreadCount}
                    size='small'
                    color='error'
                    sx={{ ml: 1, height: 18, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75 } }}
                  />
                )}
              </ToggleButton>
            </ToggleButtonGroup>
            {unreadCount > 0 && (
              <Button
                variant='outlined'
                size='small'
                startIcon={<Icon icon='tabler:checks' />}
                onClick={handleMarkAllRead}
              >
                Marcar todas como leídas
              </Button>
            )}
            <Button
              variant='tonal'
              size='small'
              startIcon={<Icon icon='tabler:settings' />}
              onClick={() => router.push('/notifications/settings')}
            >
              Configurar
            </Button>
          </Box>
        </Box>
      </Grid>

      {/* Lista */}
      <Grid item xs={12}>
        <Card>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
              <CircularProgress />
            </Box>
          ) : filteredNotifications.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 12,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  backgroundColor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon icon='tabler:bell-off' fontSize='2rem' />
              </Box>
              <Typography color='text.secondary'>
                {filter === 'unread' ? 'No tenés notificaciones sin leer' : 'No tenés notificaciones'}
              </Typography>
            </Box>
          ) : (
            filteredNotifications.map((notif, index) => {
              const category = getCategoryByType(notif.type)
              const emoji = notif.data?.emoji || getTypeEmoji(notif.type)

              return (
                <Box key={notif.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 3,
                      px: 5,
                      py: 4,
                      borderLeft: notif.read ? 'none' : `3px solid ${theme.palette.primary.main}`,
                      backgroundColor: notif.read
                        ? 'transparent'
                        : theme.palette.mode === 'dark'
                          ? 'rgba(102, 108, 255, 0.06)'
                          : 'rgba(102, 108, 255, 0.03)',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        flexShrink: 0,
                        backgroundColor: category ? `${category.color}20` : theme.palette.action.hover,
                        color: category?.color ?? theme.palette.text.secondary,
                        fontSize: '1.25rem',
                      }}
                    >
                      {emoji ? (
                        <Typography component='span' sx={{ fontSize: '1.25rem', lineHeight: 1 }}>
                          {emoji}
                        </Typography>
                      ) : (
                        <Icon icon={category?.icon ?? 'tabler:bell'} fontSize='1.1rem' />
                      )}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography
                          variant='body2'
                          sx={{ fontWeight: notif.read ? 400 : 600, color: 'text.primary' }}
                        >
                          {notif.title}
                        </Typography>
                        {!notif.read && (
                          <Chip
                            label='Nueva'
                            size='small'
                            color='primary'
                            sx={{ height: 18, fontSize: '0.6rem', '& .MuiChip-label': { px: 1 } }}
                          />
                        )}
                        {category && (
                          <Chip
                            label={category.label}
                            size='small'
                            sx={{
                              height: 18,
                              fontSize: '0.6rem',
                              backgroundColor: `${category.color}20`,
                              color: category.color,
                              fontWeight: 600,
                              '& .MuiChip-label': { px: 1 },
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                        {notif.body}
                      </Typography>
                      <Typography variant='caption' color='text.disabled' sx={{ mt: 0.5, display: 'block' }}>
                        {formatDate(notif.createdAt)}
                      </Typography>
                    </Box>

                    {/* Acciones */}
                    <Box sx={{ display: 'flex', flexShrink: 0, gap: 0.5 }}>
                      {(notif.data?.link || notif.data?.serviceOrderId) && (
                        <Tooltip title='Ir al detalle'>
                          <IconButton
                            size='small'
                            color='primary'
                            onClick={() => {
                              const targetLink = notif.data?.link || `/service-orders/${notif.data?.serviceOrderId}`
                              if (!notif.read) handleMarkRead(notif)
                              router.push(targetLink)
                            }}
                          >
                            <Icon icon='tabler:external-link' fontSize='1rem' />
                          </IconButton>
                        </Tooltip>
                      )}
                      {!notif.read && (
                        <Tooltip title='Marcar como leída'>
                          <IconButton size='small' onClick={() => handleMarkRead(notif)}>
                            <Icon icon='tabler:check' fontSize='1rem' />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title='Eliminar'>
                        <IconButton size='small' color='error' onClick={() => handleDelete(notif.id)}>
                          <Icon icon='tabler:trash' fontSize='1rem' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  {index < filteredNotifications.length - 1 && <Divider />}
                </Box>
              )
            })
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={(_, val) => setPage(val - 1)}
                  color='primary'
                  shape='rounded'
                />
              </Box>
            </>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default NotificationHistoryView
