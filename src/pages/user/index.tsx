// ** React Imports
import UserListView from 'src/views/apps/user/list/UserListView'

const UserList = () => {
  return <UserListView />
}

UserList.acl = {
  action: 'read',
  subject: 'users'
}

export default UserList
