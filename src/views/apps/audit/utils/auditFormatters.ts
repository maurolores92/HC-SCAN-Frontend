export const actionColors: Record<string, string> = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'error',
  UPLOAD: 'info',
  PROCESS_DOCUMENT: 'success',
  AI_QUERY: 'primary',
  LOGIN: 'info',
  LOGOUT: 'secondary',
  READ: 'secondary',
  STATUS_CHANGE: 'primary'
}

export const actionLabels: Record<string, string> = {
  CREATE: 'Creación',
  UPDATE: 'Actualización',
  DELETE: 'Eliminación',
  UPLOAD: 'Carga de PDF',
  PROCESS_DOCUMENT: 'Extracción IA',
  AI_QUERY: 'Consulta IA',
  LOGIN: 'Inicio de sesión',
  LOGOUT: 'Cierre de sesión',
  READ: 'Consulta',
  STATUS_CHANGE: 'Cambio de estado'
}

export const formatEntityCategory = (entity?: string): string => {
  if (!entity) return '-'
  const normalized = entity.toLowerCase().trim()

  const map: Record<string, string> = {
    document: 'Documentos PDF',
    documents: 'Documentos PDF',
    user: 'Usuarios',
    users: 'Usuarios',
    role: 'Roles',
    roles: 'Roles',
    permission: 'Permisos',
    permissions: 'Permisos',
    company: 'Empresas',
    companies: 'Empresas',
    plan: 'Planes y Cupos',
    plans: 'Planes y Cupos',
    notification: 'Notificaciones',
    notifications: 'Notificaciones',
    auth: 'Autenticación',
    session: 'Sesión'
  }

  if (map[normalized]) {
    return map[normalized]
  }

  return entity
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

export const splitDateAndTime = (dateStr?: string | Date): { date: string; time: string } => {
  if (!dateStr) return { date: '-', time: '-' }
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return { date: '-', time: '-' }

    const date = d.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    const time = `${d.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })} hs`

    return { date, time }
  } catch {
    return { date: '-', time: '-' }
  }
}
