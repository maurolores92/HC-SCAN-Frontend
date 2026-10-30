import NotificationHistoryView from 'src/views/apps/notifications/NotificationHistoryView'

const NotificationsPage = () => {
  return <NotificationHistoryView />
}

NotificationsPage.acl = {
  action: 'read',
  subject: 'notifications',
}

export default NotificationsPage
