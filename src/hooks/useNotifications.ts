// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/store'
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from 'src/store/apps/notifications'

export const useNotifications = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { notifications, total, unreadCount, preferences, loading, preferencesLoading } =
    useSelector((state: RootState) => state.notifications)

  const loadNotifications = (page = 0, pageSize = 20) =>
    dispatch(fetchNotifications({ page, pageSize }))

  const markAsRead = (id: number) => dispatch(markNotificationRead(id))

  const markAllAsRead = () => dispatch(markAllNotificationsRead())

  const removeNotification = (id: number) => dispatch(deleteNotification(id))

  const loadPreferences = () => dispatch(fetchNotificationPreferences())

  const savePreferences = (prefs: { notificationType: string; inApp: boolean }[]) =>
    dispatch(updateNotificationPreferences(prefs))

  return {
    notifications,
    total,
    unreadCount,
    preferences,
    loading,
    preferencesLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    loadPreferences,
    savePreferences,
  }
}
