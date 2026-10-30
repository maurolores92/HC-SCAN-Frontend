// ** React Imports
import React from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

// ** Auth Hook
import { useAuth } from 'src/hooks/useAuth'

// ** General Dashboard Component
import AdminDashboard from 'src/views/apps/dashboards/admin/AdminDashboard'

const GeneralDashboardPage = () => {
  const { user, loading } = useAuth()

  if (loading && !user) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return <AdminDashboard />
}

GeneralDashboardPage.acl = {
  action: 'read',
  subject: 'dashboard',
}

export default GeneralDashboardPage

