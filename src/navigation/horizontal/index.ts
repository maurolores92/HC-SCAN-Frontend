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
      title: 'Chat IA Documental',
      icon: 'tabler:messages',
      path: '/chat',
      action: 'read',
      subject: 'ai_queries'
    },
    {
      title: 'Plataforma',
      icon: 'tabler:building-community',
      action: 'manage',
      subject: 'companies',
      children: [
        {
          title: 'Compañías',
          icon: 'tabler:building-community',
          path: '/companies',
          action: 'manage',
          subject: 'companies'
        },
        {
          title: 'Planes y Cupos',
          icon: 'tabler:award',
          path: '/plans',
          action: 'manage',
          subject: 'plans'
        },
        {
          title: 'Permisos Globales',
          icon: 'tabler:lock',
          path: '/permissions',
          action: 'manage',
          subject: 'permissions'
        },
        {
          title: 'Notificaciones',
          icon: 'tabler:bell',
          path: '/notifications',
          action: 'manage',
          subject: 'notifications'
        },
        {
          title: 'Auditoría Global',
          icon: 'tabler:clipboard-list',
          path: '/audit',
          action: 'manage',
          subject: 'companies'
        }
      ]
    },
    {
      title: 'Administración',
      icon: 'tabler:settings',
      action: 'read',
      subject: 'admin_section',
      children: [
        {
          title: 'Usuarios',
          icon: 'tabler:users',
          path: '/user',
          action: 'read',
          subject: 'users'
        },
        {
          title: 'Roles',
          icon: 'tabler:shield-lock',
          path: '/roles',
          action: 'read',
          subject: 'roles'
        },
        {
          title: 'Auditoría',
          icon: 'tabler:clipboard-list',
          path: '/audit',
          action: 'read',
          subject: 'audits'
        }
      ]
    }
  ]
}

export default navigation
