// ** React Imports
import { useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'

// ** Icons
import Icon from 'src/@core/components/icon'

// ** Components
import NotificationItem from './NotificationItem'

// ** Hook
import { useNotifications } from 'src/hooks/useNotifications'

interface Props {
  open: boolean
  onClose: () => void
}

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(4, 5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}))

const EmptyState = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 12,
      px: 4,
      gap: 2,
    }}
  >
    <Box
      sx={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        backgroundColor: 'action.hover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon icon='tabler:bell-off' fontSize='1.8rem' />
    </Box>
    <Typography variant='body2' color='text.secondary' align='center'>
      No tenés notificaciones pendientes
    </Typography>
  </Box>
)

const NotificationDrawer = ({ open, onClose }: Props) => {
  const {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications()

  useEffect(() => {
    if (open) {
      loadNotifications(0, 10)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleMarkAllRead = async () => {
    await markAllAsRead()
  }

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 380 },
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <DrawerHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Icon icon='tabler:bell' fontSize='1.25rem' />
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            Notificaciones
          </Typography>
          {unreadCount > 0 && (
            <Box
              sx={{
                px: 1.5,
                py: 0.25,
                borderRadius: '12px',
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                fontSize: '0.7rem',
                fontWeight: 700,
                lineHeight: 1.6,
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {unreadCount > 0 && (
            <Button
              size='small'
              variant='text'
              onClick={handleMarkAllRead}
              sx={{ fontSize: '0.75rem', py: 0.5 }}
            >
              Marcar todas
            </Button>
          )}
          <IconButton size='small' onClick={onClose}>
            <Icon icon='tabler:x' fontSize='1.1rem' />
          </IconButton>
        </Box>
      </DrawerHeader>

      {/* Lista */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={32} />
          </Box>
        ) : notifications.length === 0 ? (
          <EmptyState />
        ) : (
          notifications.map((notif, index) => (
            <Box key={notif.id}>
              <NotificationItem notification={notif} onMarkAsRead={markAsRead} />
              {index < notifications.length - 1 && <Divider sx={{ mx: 4 }} />}
            </Box>
          ))
        )}
      </Box>
    </Drawer>
  )
}

export default NotificationDrawer
