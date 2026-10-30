import { ThemeColor } from 'src/@core/layouts/types'

export interface UserStatusType {
  [key: string]: ThemeColor
}

export const statusColors: UserStatusType = {
  ACTIVE: 'success',
  INACTIVE: 'error',
  PENDING: 'warning',
  
  // Mapeos en minúscula por si acaso
  active: 'success',
  inactive: 'error',
  pending: 'warning'
}
