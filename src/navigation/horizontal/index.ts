// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: 'tabler:layout-dashboard',
      path: '/dashboards',
      action: 'read',
      subject: 'dashboard'
    },
    {
      title: 'Documentos PDF',
      icon: 'tabler:file-text',
      path: '/documents',
      action: 'read',
      subject: 'documents'
    },
    {
      title: 'Compañías',
      icon: 'tabler:building-community',
      path: '/companies',
      action: 'manage',
      subject: 'companies'
    },
    {
      title: 'Administración',
      icon: 'tabler:settings',
      children: [
        {
          title: 'Usuarios',
          icon: 'tabler:users',
          path: '/user/list',
          action: 'read',
          subject: 'users'
        },
        {
          title: 'Roles',
          icon: 'tabler:user-check',
          path: '/roles',
          action: 'read',
          subject: 'roles'
        },
        {
          title: 'Permisos',
          icon: 'tabler:lock',
          path: '/permissions',
          action: 'read',
          subject: 'permissions'
        },
        {
          title: 'Auditoría',
          icon: 'tabler:clipboard-list',
          path: '/audit',
          action: 'read',
          subject: 'audits'
        }
      ]
    },
    {
      title: 'Notificaciones',
      icon: 'tabler:bell',
      path: '/notifications',
      action: 'read',
      subject: 'notifications'
    }
  ]
}

export default navigation
