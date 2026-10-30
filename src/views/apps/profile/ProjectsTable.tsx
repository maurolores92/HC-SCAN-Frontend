// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useState } from 'react'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Types
export interface ProjectRow {
  id: number
  name: string
  date: string
  leader: string
  status: number // 0-100
  avatar?: string
  avatarColor?: ThemeColor
}

interface CellType {
  row: ProjectRow
}

// ** Render name column
const renderName = (row: ProjectRow) => {
  if (row.avatar) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  }

  return (
    <CustomAvatar
      skin='light'
      color={(row.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
      sx={{ mr: 2.5, width: 38, height: 38, fontSize: theme => theme.typography.body1.fontSize }}
    >
      {getInitials(row.name || 'Proyecto')}
    </CustomAvatar>
  )
}

const columns: GridColDef[] = [
  {
    flex: 0.25,
    field: 'name',
    minWidth: 220,
    headerName: 'Proyecto',
    renderCell: ({ row }: CellType) => {
      const { name, date } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderName(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {name}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled', textTransform: 'capitalize' }}>
              {date}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: 'leader',
    headerName: 'Líder',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.leader}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 150,
    field: 'status',
    headerName: 'Progreso',
    renderCell: ({ row }: CellType) => (
      <>
        <LinearProgress
          color='primary'
          value={row.status}
          variant='determinate'
          sx={{ mr: 3, height: 8, width: '100%' }}
        />
        <Typography sx={{ color: 'text.secondary', minWidth: 38 }}>{`${row.status}%`}</Typography>
      </>
    )
  }
]

const ProfileTable = () => {
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })

  // Tabla vacía por ahora — se conectará al endpoint de proyectos cuando esté disponible
  const rows: ProjectRow[] = []

  return (
    <Card>
      <CardHeader
        title='Proyectos'
        action={
          <CustomTextField
            value={value}
            placeholder='Buscar proyecto'
            onChange={e => setValue(e.target.value)}
          />
        }
      />
      {rows.length === 0 && !value ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 12,
            gap: 2,
            color: 'text.secondary'
          }}
        >
          <Icon fontSize='2.5rem' icon='tabler:folder-off' />
          <Typography variant='body2'>No hay proyectos asignados</Typography>
        </Box>
      ) : (
        <DataGrid
          autoHeight
          pagination
          rows={rows}
          rowHeight={60}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          pageSizeOptions={[5, 7, 10]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      )}
    </Card>
  )
}

export default ProfileTable
