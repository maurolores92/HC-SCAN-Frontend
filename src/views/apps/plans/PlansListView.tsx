import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { AppDispatch, RootState } from 'src/store'
import { deletePlan, fetchPlans } from 'src/store/apps/plans'
import { PlanType } from 'src/types/apps/planTypes'
import ConfirmActionDialog from 'src/components/common/ConfirmActionDialog'
import PlanCard from './components/PlanCard'
import PlanFormDrawer from './PlanFormDrawer'

export const PlansListView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data: plans, loading } = useSelector((state: RootState) => state.plans)

  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const [planToDelete, setPlanToDelete] = useState<PlanType | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    dispatch(fetchPlans({ search, includeInactive: true }))
  }, [dispatch, search])

  const handleOpenCreate = () => {
    setSelectedPlan(null)
    setDrawerOpen(true)
  }

  const handleOpenEdit = (plan: PlanType) => {
    setSelectedPlan(plan)
    setDrawerOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!planToDelete) return
    try {
      setDeleting(true)
      await dispatch(deletePlan(planToDelete.id)).unwrap()
      toast.success(`Plan '${planToDelete.name}' eliminado correctamente`)
      setPlanToDelete(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'No se pudo eliminar el plan')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Planes de Suscripción y Cuotas Operativas'
            subheader='Defina los topes de usuarios, cantidad de PDFs, almacenamiento físico y consultas mensuales de IA para sus clientes'
          />
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              <TextField
                size='small'
                placeholder='Buscar plan por nombre o slug...'
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ minWidth: 300 }}
              />
              <Button
                variant='contained'
                startIcon={<Icon icon='tabler:plus' />}
                onClick={handleOpenCreate}
              >
                Nuevo Plan
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {loading ? (
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Grid>
      ) : plans.length === 0 ? (
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant='h6' sx={{ mb: 1 }}>
                No se encontraron planes configurados
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Cree su primer plan para estandarizar los límites de uso de las compañías.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ) : (
        plans.map(plan => (
          <Grid item xs={12} md={6} lg={4} key={plan.id}>
            <PlanCard
              plan={plan}
              onEdit={handleOpenEdit}
              onDelete={target => setPlanToDelete(target)}
            />
          </Grid>
        ))
      )}

      <PlanFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editPlan={selectedPlan}
      />

      <ConfirmActionDialog
        open={Boolean(planToDelete)}
        loading={deleting}
        title='¿Eliminar plan de suscripción?'
        content={`¿Está seguro de eliminar el plan "${planToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText='Sí, eliminar plan'
        cancelText='Cancelar'
        color='error'
        onConfirm={handleConfirmDelete}
        onCancel={() => setPlanToDelete(null)}
      />
    </Grid>
  )
}

export default PlansListView

