import React from 'react'
import PermissionsListView from 'src/views/apps/permissions/PermissionsListView'

const PermissionsPage = () => {
  return <PermissionsListView />
}

PermissionsPage.acl = {
  action: 'manage',
  subject: 'permissions'
}

export default PermissionsPage
