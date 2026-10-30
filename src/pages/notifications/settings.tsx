import NotificationSettingsView from 'src/views/apps/notifications/NotificationSettingsView'

const NotificationSettingsPage = () => {
  return <NotificationSettingsView />
}

NotificationSettingsPage.acl = {
  action: 'read',
  subject: 'notifications',
}

export default NotificationSettingsPage
