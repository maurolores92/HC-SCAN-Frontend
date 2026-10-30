// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type UsersType = {
  id: number
  email: string
  status: string
  statusInfo?: {
    value: string
    label: string
    color: ThemeColor
  }
  avatar: string
  billing: string
  company: string
  country: string
  contact: string
  phone?: string
  createdAt?: string
  name: string
  lastName: string
  fullName: string
  username: string
  document?: string
  currentPlan: string
  avatarColor?: ThemeColor
  signature?: string
  image?: string | null
  clave?: string
  directPermissions?: any[]
  roleId?: number
  role?: any
}

export type ProjectListDataType = {
  id: number
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}
