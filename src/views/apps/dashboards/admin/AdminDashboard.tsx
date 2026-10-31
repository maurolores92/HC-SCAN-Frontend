import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import apiConnector from 'src/services/api.service'
import { useAuth } from 'src/hooks/useAuth'
import TenantPlanUsageCard from 'src/components/common/TenantPlanUsageCard'
import AdminStatsCards, { DashboardStats } from './AdminStatsCards'

export const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    pendingDocuments: 0,
    processedDocuments: 0,
    errorDocuments: 0
  })

  useEffect(() => {
    apiConnector
      .get<any>('/documents', { limit: 100 })
      .then(res => {
        const items = res?.data || []
        const total = res?.meta?.totalItems ?? items.length
        const pending = items.filter(
          (d: any) => d.status === 'PENDING' || d.status === 'PROCESSING'
        ).length
        const processed = items.filter((d: any) => d.status === 'PROCESSED').length
        const error = items.filter((d: any) => d.status === 'ERROR').length

        setStats({
          totalDocuments: total,
          pendingDocuments: pending,
          processedDocuments: processed,
          errorDocuments: error
        })
      })
      .catch(() => {})
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card
          sx={{
            background: theme =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'common.white'
          }}
        >
          <CardContent sx={{ p: { xs: 4, sm: 6 } }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 3
              }}
            >
              <Box>
                <Typography variant='h4' sx={{ color: 'common.white', fontWeight: 700, mb: 1 }}>
                  Bienvenido a HC-SCAN 👋
                </Typography>
                <Typography variant='body1' sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 600 }}>
                  Sistema Multicompañía de Ingesta Inteligente de Documentos PDF y Extracción Automatizada con Inteligencia Artificial.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  component={Link}
                  href='/documents'
                  variant='contained'
                  sx={{
                    backgroundColor: 'common.white',
                    color: 'primary.main',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                  }}
                  startIcon={<Icon icon='tabler:files' />}
                >
                  Ver Documentos
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <AdminStatsCards stats={stats} />

      <Grid item xs={12}>
        <TenantPlanUsageCard />
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title='Canales de Ingesta Documental'
            subheader='Formatos y accesos directos de subida'
          />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'primary.light',
                    color: 'primary.main'
                  }}
                >
                  <Icon icon='tabler:upload' fontSize={22} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    Carga Directa Web (Drag & Drop)
                  </Typography>
                  <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                    Sube archivos PDF validados contra el cupo de almacenamiento de tu plan.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'secondary.light',
                    color: 'secondary.main'
                  }}
                >
                  <Icon icon='tabler:server' fontSize={22} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    Sincronización Automatizada FTP
                  </Typography>
                  <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                    Ingesta masiva desde la carpeta aislada del tenant en storage/tenancy.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardHeader
            title='Información de Sesión'
            subheader='Aislamiento y contexto actual de la compañía'
          />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: 1,
                  borderColor: 'divider',
                  pb: 1
                }}
              >
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  Usuario:
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {user?.name || user?.username || 'Usuario'}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: 1,
                  borderColor: 'divider',
                  pb: 1
                }}
              >
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  Rol Activo:
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                >
                  {user?.role || 'user'}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: 1,
                  borderColor: 'divider',
                  pb: 1
                }}
              >
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  Compañía Tenant:
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {(typeof user?.company === 'object' ? user?.company?.name : user?.company) ||
                    (user?.companyId ? `Compañía #${user.companyId}` : 'Super Administrador (Global)')}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AdminDashboard
