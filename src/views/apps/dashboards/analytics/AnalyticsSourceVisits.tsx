// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface AuditItem {
  id: number
  action: string
  actionLabel: string
  entityName: string
  entityId: string | number
  userName: string
  createdAt: string
}

interface Props {
  data?: AuditItem[]
}

const AnalyticsSourceVisits = ({ data }: Props) => {
  const logs: AuditItem[] = data && data.length > 0 ? data : [
    {
      id: 1,
      action: 'ITEM_RETURNED',
      actionLabel: 'Repuesto devuelto',
      entityName: 'Stock',
      entityId: 'STA11',
      userName: 'Carlos Técnico',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      action: 'UPDATE',
      actionLabel: 'Actualizar',
      entityName: 'Orden de Servicio',
      entityId: '#1042',
      userName: 'Admin HelpCopies',
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      action: 'TECHNICIAN_ASSIGNMENT',
      actionLabel: 'Asignación de técnico',
      entityName: 'Orden de Servicio',
      entityId: '#1045',
      userName: 'Admin HelpCopies',
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      action: 'STATUS_CHANGE',
      actionLabel: 'Cambio de estado',
      entityName: 'Equipo',
      entityId: 'MP301',
      userName: 'Jefe Depósito',
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      action: 'CREATE',
      actionLabel: 'Crear',
      entityName: 'Orden de Servicio',
      entityId: '#1048',
      userName: 'Mesa de Entrada',
      createdAt: new Date().toISOString()
    }
  ]

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'tabler:plus'
      case 'UPDATE':
      case 'STATUS_CHANGE':
        return 'tabler:edit'
      case 'DELETE':
        return 'tabler:trash'
      case 'ITEM_RETURNED':
      case 'ITEM_REMOVED':
        return 'tabler:package'
      case 'TECHNICIAN_ASSIGNMENT':
        return 'tabler:user-check'
      default:
        return 'tabler:activity'
    }
  }

  const cleanEntityName = (name: string) => {
    if (!name) return 'Servicio Técnico'
    const lower = name.toLowerCase()
    if (lower.includes('service_order') || lower.includes('serviceorder')) return 'Servicio Técnico'
    if (lower.includes('machine_location')) return 'Movimiento de Equipo'
    if (lower.includes('machine')) return 'Equipo'
    if (lower.includes('stock')) return 'Pañol / Stock'
    if (lower.includes('user')) return 'Usuario'
    if (lower.includes('role')) return 'Rol'
    if (lower.includes('client')) return 'Cliente'

    return name.replace(/_/g, ' ')
  }

  const formatTimeAgo = (dateStr: string) => {
    try {
      const d = new Date(dateStr)

      return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return 'Reciente'
    }
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title='Movimientos de Auditoría'
        subheader='Últimas 5 acciones registradas'
        action={
          <OptionsMenu
            options={['Ver Auditoría Completa']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
        {logs.map((item: AuditItem, index: number) => {
          return (
            <Box
              key={item.id || index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: index !== logs.length - 1 ? [4, 4, 4, 4] : undefined
              }}
            >
              <Avatar
                variant='rounded'
                sx={{
                  mr: 4,
                  width: 36,
                  height: 36,
                  backgroundColor: 'action.hover',
                  color: 'primary.main'
                }}
              >
                <Icon icon={getActionIcon(item.action)} fontSize='1.25rem' />
              </Avatar>
              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant='h6' sx={{ fontSize: '0.875rem' }}>
                    {item.actionLabel} ({cleanEntityName(item.entityName)})
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
                    Por {item.userName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomChip
                    rounded
                    size='small'
                    skin='light'
                    sx={{ lineHeight: 1, fontSize: '0.75rem' }}
                    color='info'
                    label={formatTimeAgo(item.createdAt)}
                  />
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default AnalyticsSourceVisits
