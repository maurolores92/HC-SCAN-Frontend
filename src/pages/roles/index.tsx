// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import Table from 'src/components/roles/Table'
import RoleCards from 'src/components/roles/RoleCards'

const RolesComponent = () => {
  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h4' sx={{ mb: 6 }}>
            Lista de Roles
          </Typography>
        }
        subtitle={
          <Typography sx={{ color: 'text.secondary' }}>
            Un rol proporciona acceso a menús y funciones predefinidos, de modo que, según el rol asignado, <br /> un administrador pueda acceder a lo que necesita.
          </Typography>
        }
      />
      <Grid item xs={12}>
        <RoleCards />
      </Grid>
      <Grid item xs={12}>
        <Table />
      </Grid>
    </Grid>
  )
}

RolesComponent.acl = {
  action: 'read',
  subject: 'roles'
}

export default RolesComponent
