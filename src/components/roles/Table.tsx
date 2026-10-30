// ** React Imports
import { useEffect, useCallback, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/user'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'

// ** Custom Components Imports
import UserRolesTable from 'src/components/users/UserRolesTable'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import ChangeUserRoleModal from 'src/components/roles/ChangeUserRoleModal'
import { UsersType } from 'src/types/apps/userTypes'

const UserList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [changeRoleModalOpen, setChangeRoleModalOpen] = useState<boolean>(false)
  const [userForRoleChange, setUserForRoleChange] = useState<UsersType | null>(null)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)

  const reloadUsers = useCallback(() => {
    dispatch(
      fetchData({
        role: '',
        q: value,
        status: '',
        currentPlan: ''
      })
    )
  }, [dispatch, value])

  useEffect(() => {
    reloadUsers()
  }, [reloadUsers])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleChangeRole = (row: UsersType) => {
    setUserForRoleChange(row)
    setChangeRoleModalOpen(true)
  }

  const handleCloseChangeRoleModal = () => {
    setChangeRoleModalOpen(false)
    setUserForRoleChange(null)
  }

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserRolesTable
          data={store.data}
          value={value}
          handleFilter={handleFilter}
          onAssignRole={handleChangeRole}
          onChangeRole={handleChangeRole}
        />
        <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
        <ChangeUserRoleModal
          open={changeRoleModalOpen}
          onClose={handleCloseChangeRoleModal}
          user={userForRoleChange}
          onSuccess={reloadUsers}
        />
      </Grid>
    </Grid>
  )
}

export default UserList
