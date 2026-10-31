import React, { useState, useEffect, SyntheticEvent, useCallback } from 'react'
import { useRouter } from 'next/router'
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
import Chip from '@mui/material/Chip'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import useApi from 'src/hooks/useApi'
import CompanyModulesView from './CompanyModulesView'
import CompanyPlanQuotaView from './CompanyPlanQuotaView'

export const CompanyDetailView: React.FC = () => {
  const router = useRouter()
  const { id } = router.query

  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>('plan')

  const api = useApi('companies')

  const fetchCompany = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      const data = await api.getById(Number(id))
      setCompany(data)
    } catch {
      setCompany(null)
    } finally {
      setLoading(false)
    }
  }, [api, id])

  useEffect(() => {
    fetchCompany()
  }, [fetchCompany])

  const handleTabChange = (_event: SyntheticEvent, value: string) => {
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

  if (!company) {
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

        <Card
          sx={{
            p: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 3,
            mb: 4
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar
              skin='light'
              color='primary'
              sx={{ mr: 4, width: 68, height: 68, fontSize: '1.8rem', fontWeight: 600 }}
            >
              {getInitials(company.name || 'Empresa')}
            </CustomAvatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant='h5' sx={{ fontWeight: 600 }}>
                  {company.name}
                </Typography>
                {company.plan && (
                  <Chip
                    label={`Plan ${company.plan.name}`}
                    color={(company.plan.badgeColor || 'primary') as any}
                    size='small'
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>
              <Typography sx={{ color: 'text.secondary' }}>
                {company.legalName ? `${company.legalName} • ` : ''}
                {company.taxId ? `CUIT: ${company.taxId}` : 'Sin CUIT registrado'}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <TabList
            onChange={handleTabChange}
            aria-label='company detail tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}`, mb: 4 }}
          >
            <Tab
              value='plan'
              label='Plan y Límites de Consumo'
              icon={<Icon icon='tabler:award' />}
              iconPosition='start'
            />
            <Tab
              value='modules'
              label='Módulos Habilitados'
              icon={<Icon icon='tabler:box' />}
              iconPosition='start'
            />
          </TabList>

          <TabPanel value='plan' sx={{ p: 0 }}>
            <CompanyPlanQuotaView company={company} onCompanyUpdated={fetchCompany} />
          </TabPanel>
          <TabPanel value='modules' sx={{ p: 0 }}>
            <CompanyModulesView companyId={Number(id)} />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default CompanyDetailView
