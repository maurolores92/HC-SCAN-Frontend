import { useMemo } from 'react'
import apiConnector from 'src/services/api.service'

/**
 * Hook genérico para realizar peticiones CRUD a una ruta base del backend.
 * Encapsula apiConnector para evitar escribir la URL en cada componente/thunk.
 * 
 * @param endpoint Ruta base del controlador (ej: 'users', 'role', 'permissions')
 */
export const useApi = (endpoint: string) => {
  const api = useMemo(() => {
    // Si el endpoint no empieza con /, se lo agregamos
    const basePath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

    return {
      getAll: async <T = any>(params = {}): Promise<T> => {
        return await apiConnector.get<T>(basePath, params)
      },
      
      getById: async <T = any>(id: string | number): Promise<T> => {
        return await apiConnector.get<T>(`${basePath}/${id}`)
      },
      
      create: async <T = any>(data: any): Promise<T> => {
        return await apiConnector.post(basePath, data)
      },
      
      update: async <T = any>(id: string | number, data: any): Promise<T> => {
        return await apiConnector.put(`${basePath}/${id}`, data)
      },
      
      patch: async <T = any>(id: string | number, data: any): Promise<T> => {
        return await apiConnector.patch(`${basePath}/${id}`, data)
      },
      
      remove: async <T = any>(id: string | number): Promise<T> => {
        return await apiConnector.remove(`${basePath}/${id}`)
      }
    }
  }, [endpoint])

  return api
}

export default useApi
