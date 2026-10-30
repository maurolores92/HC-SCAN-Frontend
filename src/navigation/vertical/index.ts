// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    // ==========================================
    // 1. GENERAL / PRINCIPAL
    // ==========================================
    {
      title: 'Dashboard',
      icon: 'tabler:layout-dashboard',
      path: '/dashboards',
      action: 'read',
      subject: 'dashboard'
    },

    // ==========================================
    // 2. GESTIÓN DOCUMENTAL
    // ==========================================
    { sectionTitle: 'GESTIÓN DOCUMENTAL' },
    {
      title: 'Documentos PDF',
      icon: 'tabler:file-text',
      path: '/documents',
      action: 'read',
      subject: 'documents'
    },

    // ==========================================
    // 3. PLATAFORMA (SUPER ADMIN ONLY)
    // ==========================================
    {
      title: 'Compañías',
      icon: 'tabler:building-community',
      path: '/companies',
      action: 'manage',
      subject: 'companies'
    },

    // ==========================================
    // 4. ADMINISTRACIÓN & SEGURIDAD
    // ==========================================
    { sectionTitle: 'ADMINISTRACIÓN' },
    {
      title: 'Usuarios',
      icon: 'tabler:users',
      path: '/user/list',
      action: 'read',
      subject: 'users'
    },
    {
      title: 'Roles y Permisos',
      icon: 'tabler:shield-lock',
      children: [
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
        }
      ]
    },
    {
      title: 'Auditoría',
      icon: 'tabler:clipboard-list',
      path: '/audit',
      action: 'read',
      subject: 'audits'
    },

    // ==========================================
    // 5. COMUNICACIONES
    // ==========================================
    { sectionTitle: 'COMUNICACIONES' },
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
