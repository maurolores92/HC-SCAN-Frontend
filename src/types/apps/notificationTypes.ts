export type NotificationType = {
  id: number
  userId: number
  type: string
  title: string
  body: string
  data?: Record<string, any> | null
  read: boolean
  readAt?: string | null
  createdAt: string
}

export type NotificationPreferenceType = {
  id: number
  userId: number
  notificationType: string
  inApp: boolean
}

export type NotificationCategoryMeta = {
  key: string
  label: string
  icon: string
  color: string
  types: NotificationTypeMeta[]
}

export type NotificationTypeMeta = {
  key: string
  label: string
  description: string
  emoji?: string
}

/** Catálogo de categorías y tipos — espejo del backend */
export const NOTIFICATION_CATEGORIES: NotificationCategoryMeta[] = [
  {
    key: 'security',
    label: 'Seguridad de la Cuenta',
    icon: 'tabler:shield-lock',
    color: '#EA5455',
    types: [
      {
        key: 'security.password_changed',
        label: 'Cambio de contraseña',
        description: 'Cuando se cambia la contraseña de acceso del usuario',
        emoji: '🔑',
      },
      {
        key: 'security.login_new_device',
        label: 'Login desde nuevo dispositivo',
        description: 'Cuando se inicia sesión desde un dispositivo o IP no reconocida',
        emoji: '🛡️',
      },
    ],
  },
  {
    key: 'system',
    label: 'Sistema y Usuarios',
    icon: 'tabler:settings',
    color: '#00CFE8',
    types: [
      {
        key: 'system.user_created',
        label: 'Nuevo usuario creado',
        description: 'Cuando se da de alta un nuevo usuario en la plataforma',
        emoji: '👤',
      },
      {
        key: 'system.user_updated',
        label: 'Usuario modificado',
        description: 'Cuando se modifican los datos personales o permisos de un usuario',
        emoji: '✏️',
      },
      {
        key: 'system.role_changed',
        label: 'Rol de usuario modificado',
        description: 'Cuando se cambia el rol asignado a un usuario',
        emoji: '🏷️',
      },
      {
        key: 'system.security_alert',
        label: 'Alerta de seguridad o nuevo rol',
        description: 'Cuando se crea un nuevo rol en roles o se alteran permisos de seguridad',
        emoji: '🚨',
      },
    ],
  },
]

/** Obtiene el ícono de categoría según el tipo de notificación */
export const getCategoryByType = (type: string): NotificationCategoryMeta | undefined =>
  NOTIFICATION_CATEGORIES.find(cat => cat.types.some(t => t.key === type))

export const getTypeLabel = (type: string): string => {
  for (const cat of NOTIFICATION_CATEGORIES) {
    const found = cat.types.find(t => t.key === type)
    if (found) return found.label
  }

  return type
}

export const getTypeEmoji = (type: string): string => {
  for (const cat of NOTIFICATION_CATEGORIES) {
    const found = cat.types.find(t => t.key === type)
    if (found?.emoji) return found.emoji
  }

  return '🔔'
}
