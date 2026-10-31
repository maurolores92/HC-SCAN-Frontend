import { useCallback, useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import ConfirmDialog from 'src/@core/components/dialogs/ConfirmDialog'
import { fetchData, deleteUser, updateUser } from 'src/store/apps/user'
import { RootState, AppDispatch } from 'src/store'
import { UsersType } from 'src/types/apps/userTypes'
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import SignatureModal from 'src/views/apps/user/list/SignatureModal'
import UserQuotaBanner from 'src/views/apps/user/list/UserQuotaBanner'
import { getColumns } from 'src/views/apps/user/list/UserListColumns'

const UserListView = ({ companyId }: { companyId?: number }) => {
  const [value, setValue] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [isPasswordMode, setIsPasswordMode] = useState<boolean>(false)
  const [editData, setEditData] = useState<UsersType | null>(null)
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
  const [userIdToDelete, setUserIdToDelete] = useState<number | string | null>(null)
  const [signatureOpen, setSignatureOpen] = useState<boolean>(false)
  const [showDeleted, setShowDeleted] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)

  useEffect(() => {
    dispatch(
      fetchData({
        role: '',
        status: showDeleted ? 'INACTIVE' : '',
        q: value,
        currentPlan: '',
        companyId
      })
    )
  }, [dispatch, value, companyId, showDeleted])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => {
    if (addUserOpen) {
      setEditData(null)
      setIsPasswordMode(false)
    }
    setAddUserOpen(!addUserOpen)
  }

  const handleEditClick = (row: UsersType) => {
    setEditData(row)
    setIsPasswordMode(false)
    setAddUserOpen(true)
  }

  const handleChangePasswordClick = (row: UsersType) => {
    setEditData(row)
    setIsPasswordMode(true)
    setAddUserOpen(true)
  }

  const handleSignatureClick = (row: UsersType) => {
    setEditData(row)
    setSignatureOpen(true)
  }

  const toggleSignatureModal = () => setSignatureOpen(!signatureOpen)

  const handleDeleteClick = (id: number | string) => {
    setUserIdToDelete(id)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (userIdToDelete !== null) {
      try {
        await dispatch(deleteUser(userIdToDelete)).unwrap()
        toast.success('Usuario inactivado correctamente')
      } catch (error: any) {
        toast.error(error.message || 'Error inactivando el usuario')
      }
    }
    setConfirmOpen(false)
    setUserIdToDelete(null)
  }

  const handleActivateClick = async (id: number | string) => {
    try {
      await dispatch(updateUser({ id, data: { status: 'ACTIVE' } })).unwrap()
      toast.success('Usuario activado correctamente')
    } catch (error: any) {
      toast.error(error.message || 'Error activando el usuario')
    }
  }

  const handleCancelDelete = () => {
    setConfirmOpen(false)
    setUserIdToDelete(null)
  }

  const columns = getColumns(
    handleEditClick,
    handleChangePasswordClick,
    handleSignatureClick,
    handleDeleteClick,
    handleActivateClick
  )

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <UserQuotaBanner companyId={companyId} refreshTrigger={store.total} />
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddUserDrawer}
            showDeleted={showDeleted}
            toggleShowDeleted={() => setShowDeleted(!showDeleted)}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={store.data}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <AddUserDrawer
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
        editData={editData}
        isPasswordMode={isPasswordMode}
      />

      <ConfirmDialog
        open={confirmOpen}
        title='Confirmar inactivación'
        content='¿Estás seguro que deseas inactivar este usuario? Ya no podrá acceder al sistema.'
        confirmText='Inactivar'
        cancelText='Cancelar'
        color='error'
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <SignatureModal
        open={signatureOpen}
        toggle={toggleSignatureModal}
        userId={editData ? Number(editData.id) : null}
        existingSignature={editData?.signature || null}
      />
    </Grid>
  )
}

export default UserListView
