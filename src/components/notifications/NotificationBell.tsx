// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'

// ** Icons
import Icon from 'src/@core/components/icon'

// ** Hook
import { useNotifications } from 'src/hooks/useNotifications'

// ** Component
import NotificationDrawer from './NotificationDrawer'

const PulseBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    fontSize: '0.6rem',
    minWidth: 16,
    height: 16,
    padding: '0 4px',
    fontWeight: 700,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}))

const NotificationBell = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { unreadCount } = useNotifications()

  return (
    <>
      <Tooltip title={unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : 'Notificaciones'}>
        <IconButton
          color='inherit'
          aria-label='notifications'
          onClick={() => setDrawerOpen(true)}
          sx={{ position: 'relative' }}
        >
          <PulseBadge
            badgeContent={unreadCount > 99 ? '99+' : unreadCount}
            color='error'
            invisible={unreadCount === 0}
          >
            <Icon
              fontSize='1.625rem'
              icon={unreadCount > 0 ? 'tabler:bell-ringing' : 'tabler:bell'}
            />
          </PulseBadge>
        </IconButton>
      </Tooltip>

      <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}

export default NotificationBell
