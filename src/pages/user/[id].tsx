// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

// ** API
import apiConnector from 'src/services/api.service'

// ** Types
import { UsersType } from 'src/types/apps/userTypes'

// ** Components
import UserDetailLeft from 'src/views/apps/user/view/UserDetailLeft'
import ActivityTimeline from 'src/views/apps/profile/ActivityTimeline'
import UserPermissionsTab from 'src/views/apps/user/view/UserPermissionsTab'

const UserDetailPage = () => {
  const router = useRouter()
  const { id } = router.query

  const [user, setUser] = useState<UsersType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('actividad')

  useEffect(() => {
    if (!id) return

    setLoading(true)
    apiConnector
      .get<UsersType>(`/users/${id}`)
      .then((data: any) => {
        setUser(data)
      })
      .catch(() => {
        setError('No se pudo cargar el usuario')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <Typography color='error'>{error ?? 'Usuario no encontrado'}</Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={6}>
      {/* Panel izquierdo: datos del usuario */}
      <Grid item xs={12} md={4} lg={4}>
        <UserDetailLeft user={user} onUserUpdated={setUser} />
      </Grid>

      {/* Panel derecho: tabs (actividad, permisos) */}
      <Grid item xs={12} md={8} lg={8}>
        <TabContext value={activeTab}>
          <TabList onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab value='actividad' label='Actividad' />
            <Tab value='permisos' label='Excepciones' />
          </TabList>
          <Box sx={{ mt: 4 }}>
            <TabPanel value='actividad' sx={{ p: 0 }}>
              <ActivityTimeline userId={user.id} />
            </TabPanel>
            <TabPanel value='permisos' sx={{ p: 0 }}>
              <UserPermissionsTab 
                userId={user.id} 
                userDirectPermissions={user.directPermissions || []} 
                userRolePermissions={user.role?.permissions || []} 
              />
            </TabPanel>
          </Box>
        </TabContext>
      </Grid>
    </Grid>
  )
}

UserDetailPage.acl = {
  action: 'read',
  subject: 'users'
}

export default UserDetailPage
