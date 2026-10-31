import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiConnector from 'src/services/api.service'
import { CompanyQuotaSummaryType, PlanType } from 'src/types/apps/planTypes'

interface ReduxContext {
  getState: any
  dispatch: Dispatch<any>
}

export const fetchPlans = createAsyncThunk(
  'appPlans/fetchPlans',
  async (params: { search?: string; includeInactive?: boolean } = {}) => {
    const queryParams = {
      ...(params.search ? { search: params.search } : {}),
      includeInactive: params.includeInactive !== false ? 'true' : 'false'
    }
    const response: any = await apiConnector.get('/plans', queryParams)
    const list: PlanType[] = Array.isArray(response) ? response : response?.data || []

    return {
      data: list,
      total: response?.total ?? list.length,
      params
    }
  }
)

export const fetchMyCompanyQuota = createAsyncThunk(
  'appPlans/fetchMyCompanyQuota',
  async (companyId?: number) => {
    const params = companyId ? { companyId } : {}
    const response = await apiConnector.get<CompanyQuotaSummaryType>('/plans/my-quota', params)

    return response
  }
)

export const createPlan = createAsyncThunk(
  'appPlans/createPlan',
  async (payload: Partial<PlanType>, { getState, dispatch }: ReduxContext) => {
    const response = await apiConnector.post('/plans', payload)
    await dispatch(fetchPlans(getState().plans.params))

    return response
  }
)

export const updatePlan = createAsyncThunk(
  'appPlans/updatePlan',
  async (
    { id, data }: { id: number; data: Partial<PlanType> },
    { getState, dispatch }: ReduxContext
  ) => {
    const response = await apiConnector.patch(`/plans/${id}`, data)
    await dispatch(fetchPlans(getState().plans.params))

    return response
  }
)

export const deletePlan = createAsyncThunk(
  'appPlans/deletePlan',
  async (id: number, { getState, dispatch }: ReduxContext) => {
    const response = await apiConnector.remove(`/plans/${id}`)
    await dispatch(fetchPlans(getState().plans.params))

    return response
  }
)

interface PlansState {
  data: PlanType[]
  total: number
  loading: boolean
  quotaLoading: boolean
  myQuota: CompanyQuotaSummaryType | null
  params: Record<string, any>
}

const initialState: PlansState = {
  data: [],
  total: 0,
  loading: false,
  quotaLoading: false,
  myQuota: null,
  params: { includeInactive: true }
}

export const appPlansSlice = createSlice({
  name: 'appPlans',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPlans.pending, state => {
        state.loading = true
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.data
        state.total = action.payload.total
        state.params = action.payload.params
      })
      .addCase(fetchPlans.rejected, state => {
        state.loading = false
      })
      .addCase(fetchMyCompanyQuota.pending, state => {
        state.quotaLoading = true
      })
      .addCase(fetchMyCompanyQuota.fulfilled, (state, action) => {
        state.quotaLoading = false
        state.myQuota = action.payload
      })
      .addCase(fetchMyCompanyQuota.rejected, state => {
        state.quotaLoading = false
      })
  }
})

export default appPlansSlice.reducer

