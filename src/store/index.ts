// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import notifications from 'src/store/apps/notifications'
import documents from 'src/store/apps/documents'

export const store = configureStore({
  reducer: {
    user,
    chat,
    calendar,
    permissions,
    notifications,
    documents
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
