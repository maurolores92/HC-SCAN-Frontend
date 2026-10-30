// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Custom Component Import
import TableSearchInput from 'src/components/common/TableSearchInput'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

interface TableHeaderProps {
  value: string
  toggle: () => void
  handleFilter: (val: string) => void
  showDeleted: boolean
  toggleShowDeleted: () => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value, showDeleted, toggleShowDeleted } = props
  const ability = useContext(AbilityContext)
  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'superadmin'
  const canCreate = ability?.can('create', 'users') || isSuperAdmin

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TableSearchInput
          value={value}
          sx={{ mr: 4, minWidth: 260 }}
          placeholder='Buscar usuario...'
          onChange={handleFilter}
        />

        {canCreate && (
          <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
            <Icon fontSize='1.125rem' icon='tabler:plus' />
            Nuevo Usuario
          </Button>
        )}

        <Tooltip title={showDeleted ? 'Mostrar activos' : 'Mostrar inactivos'}>
          <IconButton onClick={toggleShowDeleted} color={showDeleted ? 'primary' : 'warning'} sx={{ ml: 2 }}>
            <Icon icon={showDeleted ? 'tabler:users' : 'tabler:ban'} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default TableHeader
