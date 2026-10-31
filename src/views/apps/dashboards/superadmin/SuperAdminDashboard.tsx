import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Icon from 'src/@core/components/icon'
import apiConnector from 'src/services/api.service'
import SuperAdminKpiCards, { SuperAdminPlatformMetrics } from './SuperAdminKpiCards'

const formatQuotaLabel = (metric?: { current?: number; max?: number | null; unlimited?: boolean }, unit = '') => {
  if (!metric) return '-'
  const currentVal = unit === 'MB' ? Number(metric.current || 0).toFixed(1) : metric.current ?? 0
  if (metric.unlimited || metric.max === null || metric.max === undefined) {
    return `${currentVal}${unit ? ` ${unit}` : ''} / Ilimitado`
  }

  return `${currentVal} / ${metric.max}${unit ? ` ${unit}` : ''}`
}

export const SuperAdminDashboard: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([])
  const [totalPlans, setTotalPlans] = useState<number>(0)

  useEffect(() => {
    apiConnector
      .get<any>('/companies', { limit: 100 })
      .then(res => {
        const rows = Array.isArray(res) ? res : res?.data || []
        setCompanies(rows)
      })
      .catch(() => {})

    apiConnector
      .get<any>('/plans')
      .then(res => {
        const list = Array.isArray(res) ? res : res?.data || []
        setTotalPlans(list.length)
      })
      .catch(() => {})
  }, [])

  const metrics: SuperAdminPlatformMetrics = useMemo(() => {
    const activeCompanies = companies.filter(c => c.status === 'ACTIVE').length
    const totalActiveUsers = companies.reduce(
      (acc, c) => acc + Number(c.quotaSummary?.users?.current || 0),
      0
    )
    const totalStorageMb = companies.reduce(
      (acc, c) => acc + Number(c.quotaSummary?.storageMb?.current || 0),
      0
    )

    return {
      totalCompanies: companies.length,
      activeCompanies,
      totalPlans,
      totalActiveUsers,
      totalStorageMb
    }
  }, [companies, totalPlans])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card
          sx={{
            background: theme =>
              `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
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
                  Administración Global de Plataforma 🛡️
                </Typography>
                <Typography variant='body1' sx={{ color: 'rgba(255,255,255,0.88)', maxWidth: 680 }}>
                  Supervisión centralizada de empresas clientes, planes comerciales, límites operativos, permisos globales y notificaciones.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href='/companies'
                  variant='contained'
                  sx={{
                    backgroundColor: 'common.white',
                    color: 'primary.main',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                  }}
                  startIcon={<Icon icon='tabler:building-community' />}
                >
                  Gestionar Compañías
                </Button>
                <Button
                  component={Link}
                  href='/plans'
                  variant='outlined'
                  sx={{
                    borderColor: 'rgba(255,255,255,0.7)',
                    color: 'common.white',
                    fontWeight: 600,
                    '&:hover': { borderColor: 'common.white', backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                  startIcon={<Icon icon='tabler:award' />}
                >
                  Planes y Límites
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <SuperAdminKpiCards metrics={metrics} />

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Planes y Consumo de Límites por Compañía'
            subheader='Monitoreo de cupos de usuarios, documentos, almacenamiento y procesamiento IA de todas las empresas'
          />
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Empresa</TableCell>
                  <TableCell>Plan Asignado</TableCell>
                  <TableCell>Usuarios</TableCell>
                  <TableCell>Documentos</TableCell>
                  <TableCell>Storage</TableCell>
                  <TableCell>Consultas IA (Mes)</TableCell>
                  <TableCell align='right'>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align='center' sx={{ py: 6 }}>
                      <Typography variant='body2' color='text.secondary'>
                        No hay compañías registradas aún.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map(comp => {
                    const q = comp.quotaSummary
                    const storagePct = Math.min(100, Number(q?.storageMb?.percentage || 0))

                    return (
                      <TableRow key={comp.id} hover>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {comp.name}
                          </Typography>
                          <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                            {comp.slug} • {comp.status === 'ACTIVE' ? 'Activa' : 'Suspendida'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size='small'
                            label={comp.plan?.name || 'Personalizado'}
                            color={(comp.plan?.badgeColor || 'primary') as any}
                          />
                        </TableCell>
                        <TableCell>{formatQuotaLabel(q?.users)}</TableCell>
                        <TableCell>{formatQuotaLabel(q?.documents)}</TableCell>
                        <TableCell sx={{ minWidth: 160 }}>
                          <Typography variant='caption' sx={{ display: 'block', mb: 0.5 }}>
                            {formatQuotaLabel(q?.storageMb, 'MB')}
                          </Typography>
                          <LinearProgress
                            variant='determinate'
                            value={storagePct}
                            color={storagePct >= 90 ? 'error' : storagePct >= 75 ? 'warning' : 'primary'}
                            sx={{ height: 5, borderRadius: 2 }}
                          />
                        </TableCell>
                        <TableCell>{formatQuotaLabel(q?.aiQueries)}</TableCell>
                        <TableCell align='right'>
                          <Button
                            size='small'
                            variant='tonal'
                            component={Link}
                            href={`/companies/${comp.id}`}
                          >
                            Ver Límites
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SuperAdminDashboard

