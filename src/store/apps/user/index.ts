// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** API Connector
import apiConnector from 'src/services/api.service'

interface DataParams {
  q: string
  role: string
  status: string
  currentPlan: string
  companyId?: number
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appUsers/fetchData', async (params: DataParams) => {
  // El backend en /users procesa paginación: { page, pageSize, search, roleId }
  const apiParams: any = {
    page: 0,
    pageSize: 100, // Ajustar según paginación
  }
  
  if (params.q) apiParams.search = params.q
  if (params.role) apiParams.roleId = params.role
  if (params.status) apiParams.status = params.status
  if (params.companyId) apiParams.companyId = params.companyId

  const response = await apiConnector.get<any>('/users', apiParams)
  
  const usersData = response?.data || []

  return {
    users: usersData,
    total: response?.total || 0,
    params,
    allData: usersData
  }
})

// ** Add User
export const addUser = createAsyncThunk(
  'appUsers/addUser',
  async (data: any, { getState, dispatch }: Redux) => {
    const response = await apiConnector.post('/users', data)
    dispatch(fetchData(getState().user.params))

    return response
  }
)

// ** Update User
export const updateUser = createAsyncThunk(
  'appUsers/updateUser',
  async ({ id, data }: { id: number | string; data: any }, { getState, dispatch }: Redux) => {
    const response = await apiConnector.put(`/users/${id}`, data)
    dispatch(fetchData(getState().user.params))

    return response
  }
)

// ** Change User Password
export const changeUserPassword = createAsyncThunk(
  'appUsers/changeUserPassword',
  async ({ id, data }: { id: number | string; data: any }, { getState, dispatch }: Redux) => {
    const response = await apiConnector.put(`/users/${id}/change-password`, data)
    dispatch(fetchData(getState().user.params))

    return response
  }
)


// ** Update User Signature
export const updateUserSignature = createAsyncThunk(
  'appUsers/updateUserSignature',
  async ({ id, data }: { id: number | string; data: { signature: string | null } }, { getState, dispatch }: Redux) => {
    const response = await apiConnector.put(`/users/${id}/signature`, data)

    // Solo recargar la lista general si el usuario está en el módulo de gestión de usuarios
    const userState = getState()?.user
    if (userState && Array.isArray(userState.data) && userState.data.length > 0) {
      try {
        dispatch(fetchData(userState.params))
      } catch (e) {}
    }

    return response
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await apiConnector.remove(`/users/${id}`)
    dispatch(fetchData(getState().user.params))

    return response
  }
)

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.users
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appUsersSlice.reducer
