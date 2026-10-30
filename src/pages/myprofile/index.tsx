// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Components
import UserProfileHeader from 'src/views/apps/profile/UserProfileHeader'
import AboutOverivew from 'src/views/apps/profile/AboutOverivew'
import ProfileSignature from 'src/views/apps/profile/ProfileSignature'
import DevicePushCard from 'src/views/apps/profile/DevicePushCard'
import ActivityTimeline from 'src/views/apps/profile/ActivityTimeline'
import ProjectsTable from 'src/views/apps/profile/ProjectsTable'

const ProfileTab = () => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid item xs={12}>
        <UserProfileHeader />
      </Grid>

      {/* Columna izquierda: About + Firma */}
      <Grid item lg={4} md={5} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <AboutOverivew user={user} />
          </Grid>
          <Grid item xs={12}>
            <ProfileSignature />
          </Grid>
          <Grid item xs={12}>
            <DevicePushCard />
          </Grid>
        </Grid>
      </Grid>

      {/* Columna derecha: Activity + Projects */}
      <Grid item lg={8} md={7} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ActivityTimeline userId={user.id} />
          </Grid>
          <Grid item xs={12}>
            <ProjectsTable />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

ProfileTab.acl = {
  action: 'read',
  subject: 'myprofile'
}

export default ProfileTab
