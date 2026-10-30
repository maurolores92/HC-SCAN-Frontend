// ** Utilidades de formateo para el módulo de auditoría

export const actionColors: Record<string, string> = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'error',
  LOGIN: 'info',
  LOGOUT: 'secondary',
  READ: 'secondary',
  STATUS_CHANGE: 'primary',
  CATEGORY_CHANGE: 'info',
  PRIORITY_CHANGE: 'warning',
  TECHNICIAN_ASSIGNMENT: 'primary',
  ITEM_ADDED: 'success',
  ITEM_REMOVED: 'error',
  ITEM_RETURNED: 'info',
  MACHINE_LOCATION_CHANGE: 'warning',
}

export const actionLabels: Record<string, string> = {
  CREATE: 'Creación',
  UPDATE: 'Actualización',
  DELETE: 'Eliminación',
  LOGIN: 'Inicio de sesión',
  LOGOUT: 'Cierre de sesión',
  READ: 'Consulta',
  STATUS_CHANGE: 'Cambio de estado',
  CATEGORY_CHANGE: 'Cambio de categoría',
  PRIORITY_CHANGE: 'Cambio de prioridad',
  TECHNICIAN_ASSIGNMENT: 'Asignación técnica',
  ITEM_ADDED: 'Repuesto agregado',
  ITEM_REMOVED: 'Repuesto eliminado',
  ITEM_RETURNED: 'Repuesto devuelto',
  MACHINE_LOCATION_CHANGE: 'Movimiento de equipo',
}

/**
 * Traduce nombres técnicos de entidades y tablas a categorías legibles en español.
 */
export const formatEntityCategory = (entity?: string): string => {
  if (!entity) return '-'
  const normalized = entity.toLowerCase().trim()

  const map: Record<string, string> = {
    // Órdenes de Servicio
    serviceorder: 'Órdenes de servicio',
    serviceorders: 'Órdenes de servicio',
    service_orders: 'Órdenes de servicio',
    service_order: 'Órdenes de servicio',
    'órdenes de servicio': 'Órdenes de servicio',
    orden_servicio: 'Órdenes de servicio',

    // Usuarios y Accesos
    user: 'Usuarios',
    users: 'Usuarios',
    role: 'Roles',
    roles: 'Roles',
    permission: 'Permisos',
    permissions: 'Permisos',

    // Equipos y Máquinas
    machine: 'Equipos',
    machines: 'Equipos',
    machinelocation: 'Movimientos de equipo',
    machine_location: 'Movimientos de equipo',
    machine_locations: 'Movimientos de equipo',
    machinetype: 'Tipos de equipo',
    devicemodel: 'Modelos de equipo',
    brand: 'Marcas',

    // Clientes y Empresas
    client: 'Clientes',
    clients: 'Clientes',
    company: 'Empresas',
    companies: 'Empresas',
    branch: 'Sucursales',
    branches: 'Sucursales',

    // Repuestos e Inventario
    item: 'Repuestos',
    items: 'Repuestos',
    inventory: 'Inventario',
    stock: 'Inventario',
    warehouse: 'Depósito',

    // Sistema y Notificaciones
    notification: 'Notificaciones',
    notifications: 'Notificaciones',
    notificationpreference: 'Preferencias de notificación',
    problem: 'Problemas técnicos',
    auth: 'Autenticación',
    session: 'Sesión',
  }

  if (map[normalized]) {
    return map[normalized]
  }

  // Fallback: Limpiar, reemplazar guiones bajos por espacios y capitalizar
  return entity
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Divide una fecha ISO en Fecha y Hora formateadas para Argentina (es-AR)
 */
export const splitDateAndTime = (dateStr?: string | Date): { date: string; time: string } => {
  if (!dateStr) return { date: '-', time: '-' }
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return { date: '-', time: '-' }

    const date = d.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

    const time = `${d.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })} hs`

    return { date, time }
  } catch {
    return { date: '-', time: '-' }
  }
}
