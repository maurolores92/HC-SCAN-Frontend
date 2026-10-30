// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import { getInitials } from 'src/@core/utils/get-initials'

export interface CriticalOrderRow {
  id: number
  orderNumber: string
  date: string
  status: string
  priority: string
  client: string
  equipment: string
  technician: string
}

interface CellType {
  row: CriticalOrderRow
}

const statusColors: Record<string, 'success' | 'info' | 'warning' | 'error' | 'secondary'> = {
  COMPLETED: 'success',
  IN_PROGRESS: 'info',
  PENDING: 'warning',
  CANCELLED: 'error',
  DELIVERED: 'secondary'
}

const statusLabels: Record<string, string> = {
  COMPLETED: 'Completada',
  IN_PROGRESS: 'En Proceso',
  PENDING: 'En Espera',
  CANCELLED: 'Cancelada',
  DELIVERED: 'Entregada'
}

const priorityColors: Record<string, 'error' | 'warning' | 'info' | 'secondary'> = {
  URGENT: 'error',
  HIGH: 'warning',
  MEDIUM: 'info',
  LOW: 'secondary'
}

const columns: GridColDef[] = [
  {
    flex: 0.15,
    field: 'client',
    minWidth: 200,
    headerName: 'Cliente',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography noWrap sx={{ color: 'text.primary', fontWeight: 600 }}>
            {row.client}
          </Typography>
          <Typography noWrap variant='caption' sx={{ color: 'text.disabled' }}>
            Orden #{row.orderNumber || row.id}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 200,
    field: 'equipment',
    headerName: 'Equipo / Serie',
    renderCell: ({ row }: CellType) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Icon icon='tabler:printer' fontSize='1.25rem' />
        <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {row.equipment}
        </Typography>
      </Box>
    )
  },
  {
    flex: 0.15,
    field: 'technician',
    minWidth: 160,
    headerName: 'Técnico Asignado',
    renderCell: ({ row }: CellType) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CustomAvatar skin='light' color='info' sx={{ width: 30, height: 30, fontSize: '0.75rem' }}>
          {getInitials(row.technician || 'Sin Asignar')}
        </CustomAvatar>
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.technician}
        </Typography>
      </Box>
    )
  },
  {
    flex: 0.1,
    minWidth: 120,
    field: 'priority',
    headerName: 'Prioridad',
    renderCell: ({ row }: CellType) => (
      <CustomChip
        size='small'
        color={priorityColors[row.priority] || 'secondary'}
        label={row.priority}
      />
    )
  },
  {
    flex: 0.1,
    minWidth: 130,
    field: 'status',
    headerName: 'Estado',
    renderCell: ({ row }: CellType) => (
      <CustomChip
        size='small'
        color={statusColors[row.status] || 'secondary'}
        label={statusLabels[row.status] || row.status}
      />
    )
  },
  {
    flex: 0.08,
    minWidth: 80,
    sortable: false,
    field: 'actions',
    headerName: 'Ver',
    renderCell: ({ row }: CellType) => (
      <IconButton
        size='small'
        component={Link}
        href={`/servicio-tecnico/ordenes/view/${row.id}`}
        sx={{ color: 'primary.main' }}
      >
        <Icon icon='tabler:eye' fontSize='1.25rem' />
      </IconButton>
    )
  }
]

interface Props {
  data?: CriticalOrderRow[]
}

const AnalyticsProject = ({ data }: Props) => {
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const fallbackData: CriticalOrderRow[] = [
    {
      id: 1045,
      orderNumber: 'OS-1045',
      date: '2026-10-15',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      client: 'Estudio Jurídico Central',
      equipment: 'Ricoh MP 301 (SN: 928374)',
      technician: 'Carlos Gómez'
    },
    {
      id: 1046,
      orderNumber: 'OS-1046',
      date: '2026-10-14',
      status: 'PENDING',
      priority: 'HIGH',
      client: 'Distribuidora del Litoral',
      equipment: 'HP LaserJet M428 (SN: HP8821)',
      technician: 'Marcos Ruiz'
    },
    {
      id: 1047,
      orderNumber: 'OS-1047',
      date: '2026-10-13',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      client: 'Clínica San Martín',
      equipment: 'Brother MFC-L8900 (SN: BR-4491)',
      technician: 'Sin asignar'
    }
  ]

  const rawRows = data && data.length > 0 ? data : fallbackData
  const filteredRows = rawRows.filter(
    item =>
      item.client.toLowerCase().includes(value.toLowerCase()) ||
      item.equipment.toLowerCase().includes(value.toLowerCase()) ||
      item.technician.toLowerCase().includes(value.toLowerCase())
  )

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title='Últimas Órdenes de Servicio Creadas'
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        subheader='Monitoreo de las 10 intervenciones técnicas más recientes'
        action={<CustomTextField value={value} placeholder='Buscar orden, cliente...' onChange={e => setValue(e.target.value)} />}
        sx={{
          py: 4,
          flexDirection: ['column', 'row'],
          '& .MuiCardHeader-action': { m: 0 },
          alignItems: ['flex-start', 'center']
        }}
      />
      <DataGrid
        autoHeight
        pagination
        rows={filteredRows}
        rowHeight={62}
        columns={columns}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sx={{ flex: 1 }}
      />
    </Card>
  )
}

export default AnalyticsProject
