// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** API Connector
import apiConnector from 'src/services/api.service'

interface DataParams {
  q: string
}

// ** Fetch Permissions
export const fetchData = createAsyncThunk('appPermissions/fetchData', async (params: DataParams) => {
  // Cambiar a ruta real del backend cuando exista el controlador de permisos, ej: '/permissions'
  try {
    const response = await apiConnector.get<any>('/permissions')

    // El backend devuelve un array directamente
    let data = Array.isArray(response) ? response : (response?.data || [])
    
    if (params.q) {
      const queryLower = params.q.toLowerCase()
      data = data.filter((item: any) => 
        (item.displayName && item.displayName.toLowerCase().includes(queryLower)) ||
        (item.description && item.description.toLowerCase().includes(queryLower))
      )
    }

    return {
      permissions: data,
      params,
      allData: data,
      total: data.length
    }
  } catch (error) {
    // Fallback temporal si no existe el endpoint en backend
    return { permissions: [], params, allData: [], total: 0 }
  }
})

export const appPermissionsSlice = createSlice({
  name: 'appPermissions',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.permissions
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export default appPermissionsSlice.reducer
