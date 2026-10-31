export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  username: string
  password: string
  rememberMe?: boolean
}

export type UserCompanyInfoType = {
  id: number
  name: string
  slug: string
  planId?: number | null
  plan?: {
    id: number
    name: string
    slug: string
    badgeColor?: string
  } | null
}

export type UserDataType = {
  id: number
  role: string
  roleId?: number | null
  email: string
  name?: string
  lastName?: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
  phone?: string | null
  status?: string
  isAdmin?: boolean
  companyId?: number | null
  company?: string | UserCompanyInfoType | null
  branchId?: number | null
  lastLoginAt?: string | null
  signature?: string | null
  image?: string | null
  permissions?: string[]
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
