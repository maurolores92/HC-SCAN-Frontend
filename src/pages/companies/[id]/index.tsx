import { useRouter } from 'next/router'
import { useState, useEffect, SyntheticEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

// ** Icons Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import useApi from 'src/hooks/useApi'

// ** Views
import UserListView from 'src/views/apps/user/list/UserListView'
import AuditListView from 'src/views/apps/audit/AuditListView'
import CompanyModulesView from 'src/views/apps/companies/view/CompanyModulesView'

const CompanyDetail = () => {
  const router = useRouter()
  const { id } = router.query

  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>('users')

  const api = useApi('companies')

  useEffect(() => {
    if (id) {
      fetchCompany()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchCompany = async () => {
    try {
      setLoading(true)
      const data = await api.getById(Number(id))
      setCompany(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  if (loading) {
    return (
      <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Cargando datos de la empresa...</Typography>
      </Box>
    )
  }

  if (!company && !loading) {
    return <Typography>No se encontró la empresa.</Typography>
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Button
          variant='text'
          color='secondary'
          onClick={() => router.push('/companies')}
          startIcon={<Icon icon='tabler:arrow-left' />}
          sx={{ mb: 4 }}
        >
          Volver a Empresas
        </Button>
        <Card sx={{ p: 4, display: 'flex', alignItems: 'center', mb: 6 }}>
          <CustomAvatar
            skin='light'
            color='primary'
            sx={{ mr: 4, width: 70, height: 70, fontSize: '2rem', fontWeight: 500 }}
          >
            {getInitials(company.name || 'Empresa')}
          </CustomAvatar>
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 600, mb: 1 }}>
              {company.name}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {company.legalName ? `${company.legalName} • ` : ''} 
              {company.cuit ? `CUIT: ${company.cuit}` : 'Sin CUIT registrado'}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 4 }}>
              {company.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                  <Icon icon='tabler:mail' fontSize={20} style={{ marginRight: '0.5rem' }} />
                  <Typography variant='body2'>{company.email}</Typography>
                </Box>
              )}
              {company.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                  <Icon icon='tabler:phone' fontSize={20} style={{ marginRight: '0.5rem' }} />
                  <Typography variant='body2'>{company.phone}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <TabList
            onChange={handleTabChange}
            aria-label='company tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}`, mb: 4 }}
          >
            <Tab
              value='users'
              label='Usuarios'
              icon={<Icon icon='tabler:users' />}
              iconPosition='start'
            />
            <Tab
              value='audits'
              label='Auditoría'
              icon={<Icon icon='tabler:clipboard-list' />}
              iconPosition='start'
            />
            <Tab
              value='modules'
              label='Módulos'
              icon={<Icon icon='tabler:box' />}
              iconPosition='start'
            />
          </TabList>
          
          <TabPanel value='users' sx={{ p: 0 }}>
            <UserListView companyId={Number(id)} />
          </TabPanel>
          <TabPanel value='audits' sx={{ p: 0 }}>
            <AuditListView companyId={Number(id)} />
          </TabPanel>
          <TabPanel value='modules' sx={{ p: 0 }}>
            <CompanyModulesView companyId={Number(id)} />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

CompanyDetail.acl = {
  action: 'manage',
  subject: 'companies'
}

export default CompanyDetail
