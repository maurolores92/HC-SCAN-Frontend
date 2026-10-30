// ** React Imports
import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'

// ** Socket.io
import { io, Socket } from 'socket.io-client'

// ** Store
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { addNotification, fetchUnreadCount } from 'src/store/apps/notifications'
import toast from 'react-hot-toast'

// ** Auth
import { useAuth } from 'src/hooks/useAuth'

// ** Config
const WS_URL = process.env.NEXT_PUBLIC_WS_URL

/**
 * Remueve emojis al inicio de una cadena para evitar que se muestren duplicados
 * cuando react-hot-toast ya renderiza el emoji en la ranura de icono.
 */
export function stripLeadingEmoji(text?: string | null): string {
  if (!text) return ''

  return text
    .replace(
      /^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|\uFE0F|\u200D|\p{Emoji_Presentation}|\p{Extended_Pictographic})+\s*/u,
      ''
    )
    .trim()
}

interface NotificationContextValue {
  socket: Socket | null
  connected: boolean
}

const NotificationContext = createContext<NotificationContextValue>({
  socket: null,
  connected: false,
})

interface Props {
  children: ReactNode
}

export const NotificationProvider = ({ children }: Props) => {
  const socketRef = useRef<Socket | null>(null)
  const { user } = useAuth()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!user) {
      // Si no hay usuario, desconectar si había socket abierto
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }

      return
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    if (!token) return

    // Conectar al namespace /notifications con el JWT
    const socket = io(`${WS_URL}/notifications`, {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    socket.on('connect', () => {
      console.log('[WS] Connected to /notifications')
      dispatch(fetchUnreadCount())
    })

    socket.on('notification', (notification: any) => {
      dispatch(addNotification(notification))
      dispatch(fetchUnreadCount())

      if (notification?.title) {
        // Extraer icono limpio: usar el emoji del backend o el primer emoji del título, o '🔔'
        const emojiFromTitle = notification.title.match(
          /^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|\uFE0F|\u200D|\p{Emoji_Presentation}|\p{Extended_Pictographic})+/u
        )?.[0]

        const icon = notification?.data?.emoji || emojiFromTitle || '🔔'
        const cleanTitle = stripLeadingEmoji(notification.title)
        const cleanBody = stripLeadingEmoji(notification.body)

        // Usar id único para deduplicar automáticamente toasts idénticos en react-hot-toast
        const toastId = notification?.id ? `notif-${notification.id}` : `notif-${cleanTitle}-${cleanBody}`

        toast(
          () => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '340px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.3 }}>
                {cleanTitle}
              </div>
              {cleanBody && cleanBody !== cleanTitle && (
                <div style={{ fontSize: '0.78rem', opacity: 0.88, lineHeight: 1.25 }}>
                  {cleanBody}
                </div>
              )}
            </div>
          ),
          {
            id: toastId,
            icon,
            duration: 6000,
            style: {
              borderRadius: '10px',
              background: '#1e1e2d',
              color: '#fff',
              border: '1px solid #7367f0',
            },
          }
        )
      }
    })

    socket.on('disconnect', () => {
      console.log('[WS] Disconnected from /notifications')
    })

    socket.on('connect_error', (err: any) => {
      console.error('[WS] Connection error:', err.message)
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  return (
    <NotificationContext.Provider
      value={{
        socket: socketRef.current,
        connected: socketRef.current?.connected ?? false,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationSocket = () => useContext(NotificationContext)
