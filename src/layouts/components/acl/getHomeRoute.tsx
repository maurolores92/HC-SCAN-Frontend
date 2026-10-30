/**
 *  Set Home URL based on User Roles and Permissions
 */
const getHomeRoute = (role: string, permissions: string[] = []) => {
  if (role === 'client') return '/acl'

  // Si tiene permiso para ver el Dashboard General, es la página de inicio principal
  if (permissions.includes('VIEW_DASHBOARD') || role === 'superadmin' || role === 'admin') {
    return '/dashboards'
  }

  // Si no tiene dashboard general pero sí dashboard de Gerente de Soporte
  if (permissions.includes('VIEW_SUPPORT_MANAGER_DASHBOARD') || role === 'gerente_soporte_tecnico') {
    return '/dashboards/support-manager'
  }

  // Si no tiene dashboard general pero sí dashboard Técnico
  if (permissions.includes('VIEW_TECHNICIAN_DASHBOARD') || role === 'tecnico') {
    return '/dashboards/technician'
  }

  // Fallbacks si no tiene acceso a dashboards
  if (permissions.includes('VIEW_SERVICE_ORDERS')) {
    return '/service-orders'
  }
  if (permissions.includes('VIEW_CLIENTS')) {
    return '/clients'
  }

  return '/dashboards'
}

export default getHomeRoute
