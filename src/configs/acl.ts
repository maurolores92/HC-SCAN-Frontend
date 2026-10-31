import { AbilityBuilder, Ability } from '@casl/ability'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete' | string

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Subjects exclusivos del Super Administrador de la plataforma.
 * Ningún usuario ni administrador de compañía puede acceder a sus páginas ni administrar estos módulos.
 */
const PLATFORM_ONLY_SUBJECTS = ['companies', 'plans', 'permissions', 'notifications']

/**
 * Subjects operativos exclusivos de las Compañías (Tenants).
 * El Super Administrador NO es una compañía: no sube documentos ni gestiona usuarios o roles internos.
 */
const TENANT_ONLY_SUBJECTS = ['documents', 'users', 'users_menu', 'roles', 'admin_section', 'ai_queries']

const restrictSubjects = (cannot: any, subjects: string[]) => {
  subjects.forEach(subj => {
    cannot('manage', subj)
    cannot('read', subj)
    cannot('create', subj)
    cannot('update', subj)
    cannot('delete', subj)
  })
}

const isPlatformOnlyPermission = (upperPerm: string): boolean => {
  return (
    upperPerm.includes('COMPAN') ||
    upperPerm.includes('_PLAN') ||
    upperPerm.includes('PERMISSION') ||
    upperPerm.includes('NOTIFICATION')
  )
}

/**
 * Define reglas CASL separando estrictamente al Super Admin de Plataforma de las Compañías (Tenants).
 */
const defineRulesFor = (role: string, _subject: string, permissions: string[] = []) => {
  const { can, cannot, rules } = new AbilityBuilder(AppAbility)

  if (role === 'superadmin') {
    can('read', 'dashboard')
    can('read', 'dashboards')
    can('manage', 'companies')
    can('manage', 'plans')
    can('manage', 'permissions')
    can('manage', 'notifications')
    can('read', 'audits')
    can('manage', 'audits')
    can('read', 'myprofile')
    restrictSubjects(cannot, TENANT_ONLY_SUBJECTS)

    return rules
  }

  restrictSubjects(cannot, PLATFORM_ONLY_SUBJECTS)

  if (role === 'admin' || role === 'company_admin') {
    can('manage', 'all')
    can('read', 'admin_section')
    restrictSubjects(cannot, PLATFORM_ONLY_SUBJECTS)
  }

  permissions.forEach(permission => {
    const upperPerm = permission.toUpperCase()
    if (isPlatformOnlyPermission(upperPerm)) {
      return
    }

    can(permission, 'all')

    const [actionMatch, ...subjectParts] = permission.toLowerCase().split('_')
    let action = actionMatch
    if (action === 'view') action = 'read'

    let subjectName = subjectParts.join('_')
    if (subjectName && !subjectName.endsWith('s') && subjectName !== 'dashboard') {
      subjectName += 's'
    }

    if (action && subjectName) {
      can(action, subjectName)

      if (action === 'read' && subjectName === 'users') {
        can('read', 'users_menu')
      }
      if (action === 'read' && ['users', 'roles', 'audits'].includes(subjectName)) {
        can('read', 'admin_section')
      }
    }

    if (permission === 'VIEW_DASHBOARD') {
      can('read', 'dashboard')
      can('read', 'dashboards')
    }
    if (permission === 'VIEW_DOCUMENTS' || permission === 'READ_DOCUMENTS') {
      can('read', 'documents')
    }
    if (permission === 'QUERY_AI_DOCUMENTS') {
      can('read', 'ai_queries')
    }
  })

  restrictSubjects(cannot, PLATFORM_ONLY_SUBJECTS)
  can('read', 'myprofile')

  return rules
}

export const buildAbilityFor = (role: string, subject: string, permissions: string[] = []): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject, permissions), {
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
