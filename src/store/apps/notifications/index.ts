// ** Redux Imports
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// ** API
import apiConnector from 'src/services/api.service'

// ** Types
import { NotificationType, NotificationPreferenceType } from 'src/types/apps/notificationTypes'

interface NotificationsState {
  notifications: NotificationType[]
  total: number
  unreadCount: number
  preferences: NotificationPreferenceType[]
  loading: boolean
  preferencesLoading: boolean
}

const initialState: NotificationsState = {
  notifications: [],
  total: 0,
  unreadCount: 0,
  preferences: [],
  loading: false,
  preferencesLoading: false,
}

// ** Fetch notifications (historial)
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (params: { page?: number; pageSize?: number } = {}) => {
    const response = await apiConnector.get<any>('/notifications', {
      page: params.page ?? 0,
      pageSize: params.pageSize ?? 20,
    })

    return response
  }
)

// ** Mark one as read
export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id: number, { dispatch }) => {
    await apiConnector.patch(`/notifications/${id}/read`, {})

    dispatch(fetchUnreadCount())

    return id
  }
)

// ** Mark all as read
export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { dispatch }) => {
    await apiConnector.patch('/notifications/read-all', {})
    dispatch(fetchUnreadCount())
  }
)

// ** Delete notification
export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id: number, { dispatch }) => {

    await apiConnector.remove(`/notifications/${id}`)
    dispatch(fetchUnreadCount())

    return id
  }
)

// ** Get unread count
export const fetchUnreadCount = createAsyncThunk(

  'notifications/unreadCount',
  async () => {
    const response = await apiConnector.get<{ count: number }>('/notifications/unread-count')

    return response
  }
)

// ** Fetch preferences

export const fetchNotificationPreferences = createAsyncThunk(
  'notifications/fetchPreferences',
  async () => {
    const response = await apiConnector.get<NotificationPreferenceType[]>('/notifications/preferences')

    return response
  }
)

// ** Update preferences

export const updateNotificationPreferences = createAsyncThunk(
  'notifications/updatePreferences',
  async (preferences: { notificationType: string; inApp: boolean }[]) => {
    const response = await apiConnector.patch('/notifications/preferences', { preferences })

    return response
  }
)

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {

    /** Llamado desde el WebSocket cuando llega una notificación nueva */
    addNotification: (state, action: PayloadAction<NotificationType>) => {
      state.notifications.unshift(action.payload)
      state.total += 1
      state.unreadCount += 1
    },

    /** Actualiza el contador de no leídas directamente */
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, state => {
        state.loading = true
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload.data
        state.total = action.payload.total
        state.unreadCount = action.payload.unreadCount
      })
      .addCase(fetchNotifications.rejected, state => {
        state.loading = false
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notif = state.notifications.find(n => n.id === action.payload)
        if (notif && !notif.read) {
          notif.read = true
          notif.readAt = new Date().toISOString()
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, state => {
        state.notifications.forEach(n => {
          n.read = true
          n.readAt = new Date().toISOString()
        })
        state.unreadCount = 0
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n.id !== action.payload)
        state.total -= 1
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = (action.payload as any).count ?? 0
      })
      .addCase(fetchNotificationPreferences.pending, state => {
        state.preferencesLoading = true
      })
      .addCase(fetchNotificationPreferences.fulfilled, (state, action) => {
        state.preferencesLoading = false
        state.preferences = action.payload as any
      })
      .addCase(fetchNotificationPreferences.rejected, state => {
        state.preferencesLoading = false
      })
      .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
        state.preferences = action.payload as any
      })
  },
})

export const { addNotification, setUnreadCount } = notificationsSlice.actions
export default notificationsSlice.reducer
