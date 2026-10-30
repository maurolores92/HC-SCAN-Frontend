// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'

// ** Icon
import Icon from 'src/@core/components/icon'

// ** Types
import { NotificationType, getCategoryByType, getTypeEmoji } from 'src/types/apps/notificationTypes'

interface Props {
  notification: NotificationType
  onMarkAsRead?: (id: number) => void
}

const formatTimeAgo = (dateStr: string): string => {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Ahora mismo'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays === 1) return 'Ayer'

  return `Hace ${diffDays} días`
}

const NotificationItem = ({ notification, onMarkAsRead }: Props) => {
  const theme = useTheme()
  const category = getCategoryByType(notification.type)
  const emoji = notification.data?.emoji || getTypeEmoji(notification.type)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 3,
        px: 4,
        py: 3,
        cursor: 'default',
        borderLeft: notification.read ? 'none' : `3px solid ${theme.palette.primary.main}`,
        backgroundColor: notification.read
          ? 'transparent'
          : theme.palette.mode === 'dark'
            ? 'rgba(102, 108, 255, 0.08)'
            : 'rgba(102, 108, 255, 0.04)',
      }}
    >
      {/* Avatar con emoji o icono de categoría */}
      <Avatar
        sx={{
          width: 38,
          height: 38,
          flexShrink: 0,
          backgroundColor: category ? `${category.color}20` : theme.palette.action.hover,
          color: category?.color ?? theme.palette.text.secondary,
          fontSize: '1.2rem',
        }}
      >
        {emoji ? (
          <Typography component='span' sx={{ fontSize: '1.2rem', lineHeight: 1 }}>
            {emoji}
          </Typography>
        ) : (
          <Icon icon={category?.icon ?? 'tabler:bell'} fontSize='1.1rem' />
        )}
      </Avatar>

      {/* Contenido */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography
            variant='body2'
            sx={{
              fontWeight: notification.read ? 400 : 600,
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {notification.title}
          </Typography>
          {!notification.read && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                }}
              />
              {onMarkAsRead && (
                <Tooltip title='Marcar como leída'>
                  <IconButton
                    size='small'
                    onClick={() => onMarkAsRead(notification.id)}
                    sx={{ p: 0.25, color: 'text.secondary' }}
                  >
                    <Icon icon='tabler:check' fontSize='0.85rem' />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </Box>

        <Typography
          variant='caption'
          sx={{
            color: 'text.secondary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
            mt: 0.5,
          }}
        >
          {notification.body}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          {category && (
            <Chip
              label={category.label}
              size='small'
              sx={{
                height: 18,
                fontSize: '0.65rem',
                backgroundColor: `${category.color}20`,
                color: category.color,
                fontWeight: 600,
                '& .MuiChip-label': { px: 1 },
              }}
            />
          )}
          <Typography variant='caption' sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
            {formatTimeAgo(notification.createdAt)}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default NotificationItem
