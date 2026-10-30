import React, { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import TableHeader from 'src/components/permissions/TableHeader'

import CustomChip from 'src/@core/components/mui/chip'

export interface PermissionsDataGridProps {
  data: any[]
  value: string
  moduleValue: string
  modules: string[]
  handleFilter: (val: string) => void
  handleModuleFilter: (val: string) => void
  onEditPermission: (row: any) => void
}

const PermissionsDataGrid: React.FC<PermissionsDataGridProps> = ({ data, value, moduleValue, modules, handleFilter, handleModuleFilter, onEditPermission }) => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const columns: GridColDef[] = [
    {
      flex: 0.25,
      field: 'displayName',
      minWidth: 240,
      headerName: 'Permiso',
      renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>{row.displayName || row.name}</Typography>
    },
    {
      flex: 0.2,
      field: 'categoria',
      minWidth: 150,
      headerName: 'Módulo',
      renderCell: ({ row }) => (
        <CustomChip
          skin='light'
          size='small'
          label={row.categoria || 'CORE'}
          color='primary'
          sx={{ textTransform: 'capitalize' }}
        />
      )
    },
    {
      flex: 0.35,
      minWidth: 290,
      field: 'description',
      headerName: 'Description',
      renderCell: ({ row }) => (
        <Typography sx={{ color: 'text.secondary' }}>{row.description || 'No description available'}</Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => onEditPermission(row)}>
            <Icon icon='tabler:edit' />
          </IconButton>
        </Box>
      )
    }
  ]

  const filteredData = moduleValue ? data.filter(item => item.categoria === moduleValue) : data

  return (
    <Card>
      <TableHeader 
        value={value} 
        handleFilter={handleFilter} 
        moduleValue={moduleValue}
        handleModuleFilter={handleModuleFilter}
        modules={modules}
      />
      <DataGrid
        autoHeight
        rows={filteredData}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
  )
}

export default PermissionsDataGrid
