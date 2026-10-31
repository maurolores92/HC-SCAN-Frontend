/**
 * Determina la ruta inicial según el rol y permisos del usuario autenticado.
 */
const getHomeRoute = (role: string, permissions: string[] = []) => {
  if (role === 'client') return '/acl'

  if (role === 'superadmin') {
    return '/dashboards'
  }

  if (
    permissions.includes('VIEW_DASHBOARD') ||
    role === 'admin' ||
    role === 'company_admin'
  ) {
    return '/dashboards'
  }

  if (permissions.includes('VIEW_DOCUMENTS')) {
    return '/documents'
  }

  if (permissions.includes('VIEW_USERS')) {
    return '/user'
  }

  return '/myprofile'
}

export default getHomeRoute
