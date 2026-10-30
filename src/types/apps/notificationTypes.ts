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
    key: 'service_orders',
    label: 'Órdenes de Servicio',
    icon: 'tabler:clipboard-text',
    color: '#7367F0',
    types: [
      {
        key: 'service_order.created',
        label: 'Nueva orden de servicio',
        description: 'Cuando se crea una nueva orden de servicio en el sistema',
        emoji: '📋',
      },
      {
        key: 'service_order.assigned',
        label: 'Orden asignada a técnico',
        description: 'Cuando se asigna o reasigna una orden de servicio a un técnico',
        emoji: '📋',
      },
      {
        key: 'service_order.unassigned',
        label: 'Orden desasignada de ruta',
        description: 'Cuando se retira una orden de servicio de la ruta de un técnico',
        emoji: '↩️',
      },
      {
        key: 'service_order.status_en_route',
        label: 'Técnico en camino',
        description: 'Cuando el técnico inicia viaje hacia el domicilio del cliente',
        emoji: '🛵',
      },
      {
        key: 'service_order.status_in_progress',
        label: 'Orden en proceso / atención iniciada',
        description: 'Cuando el técnico llega al lugar e inicia los trabajos de servicio',
        emoji: '📍',
      },
      {
        key: 'service_order.status_completed',
        label: 'Orden finalizada por técnico',
        description: 'Cuando el técnico completa la intervención técnica y firma el cliente',
        emoji: '✅',
      },
      {
        key: 'service_order.status_on_hold',
        label: 'Orden puesta en espera',
        description: 'Cuando una orden se suspende temporalmente por repuestos o ausencia',
        emoji: '⏸️',
      },
      {
        key: 'service_order.status_closed',
        label: 'Orden cerrada administrativamente',
        description: 'Cuando una orden finalizada es revisada y cerrada definitivamente',
        emoji: '🔒',
      },
      {
        key: 'service_order.status_cancelled',
        label: 'Orden cancelada',
        description: 'Cuando una orden de servicio es cancelada',
        emoji: '❌',
      },
      {
        key: 'service_order.route_reordered',
        label: 'Ruta de técnico modificada',
        description: 'Cuando un técnico reorganiza el orden de sus servicios en su ruta de trabajo',
        emoji: '🔄',
      },
      {
        key: 'service_order.item_added',
        label: 'Repuesto agregado a la orden',
        description: 'Cuando se agrega un artículo o repuesto a una orden de servicio',
        emoji: '⚙️',
      },
      {
        key: 'service_order.item_removed',
        label: 'Repuesto retirado de la orden',
        description: 'Cuando se remueve un repuesto asignado a una orden',
        emoji: '🗑️',
      },
      {
        key: 'service_order.updated',
        label: 'Orden de servicio modificada',
        description: 'Cuando se modifican datos generales o prioridad de una orden',
        emoji: '📝',
      },
    ],
  },
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
