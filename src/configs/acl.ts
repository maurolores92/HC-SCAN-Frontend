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
 * Define Ability rules according to user role and dynamic permissions
 */
const defineRulesFor = (role: string, subject: string, permissions: string[] = []) => {
  const { can, cannot, rules } = new AbilityBuilder(AppAbility)

  if (role === 'superadmin') {
    can('manage', 'all')
  } else {
    // Non-superadmins can NEVER access or view companies under any circumstances
    cannot('manage', 'companies')
    cannot('read', 'companies')
    cannot('create', 'companies')
    cannot('update', 'companies')
    cannot('delete', 'companies')

    if (role === 'admin' || role === 'company_admin') {
      can('manage', 'all')

      // Re-enforce companies blocking for company admins
      cannot('manage', 'companies')
      cannot('read', 'companies')
      cannot('create', 'companies')
      cannot('update', 'companies')
      cannot('delete', 'companies')
    }
  }

  // Dynamic permissions mapping
  permissions.forEach(permission => {
    // Block any companies permission if not superadmin
    if (role !== 'superadmin' && permission.toUpperCase().includes('COMPAN')) {
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
    }

    if (permission === 'VIEW_DASHBOARD') {
      can('read', 'dashboard')
      can('read', 'dashboards')
    }
    if (permission === 'VIEW_DOCUMENTS' || permission === 'READ_DOCUMENTS') {
      can('read', 'documents')
    }
  })

  // Mandatory re-enforcement after dynamic loop for all non-superadmins
  if (role !== 'superadmin') {
    cannot('manage', 'companies')
    cannot('read', 'companies')
    cannot('create', 'companies')
    cannot('update', 'companies')
    cannot('delete', 'companies')
  }

  // Base permissions for all authenticated users
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
