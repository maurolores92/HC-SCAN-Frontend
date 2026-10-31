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
    // 2. GESTIÓN DOCUMENTAL (EXCLUSIVO COMPAÑÍAS)
    // ==========================================
    {
      sectionTitle: 'GESTIÓN DOCUMENTAL',
      action: 'read',
      subject: 'documents'
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

    // ==========================================
    // 3. PLATAFORMA (EXCLUSIVO SUPER ADMIN)
    // ==========================================
    {
      sectionTitle: 'PLATAFORMA',
      action: 'manage',
      subject: 'companies'
    },
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

    // ==========================================
    // 4. ADMINISTRACIÓN DE COMPAÑÍA & AUDITORÍA
    // ==========================================
    {
      sectionTitle: 'ADMINISTRACIÓN',
      action: 'read',
      subject: 'admin_section'
    },
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

export default navigation
