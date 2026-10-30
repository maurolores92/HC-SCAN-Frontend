// ** MUI Imports
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

interface TableHeaderProps {
  value: string
  moduleValue: string
  modules: string[]
  handleFilter: (val: string) => void
  handleModuleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, moduleValue, modules, handleFilter, handleModuleFilter } = props

  return (
    <>
      <Box
        sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <CustomTextField
            value={value}
            sx={{ mr: 4, mb: 2 }}
            placeholder='Buscar permiso'
            onChange={e => handleFilter(e.target.value)}
          />

          <FormControl size='small' sx={{ mb: 2, minWidth: 200 }}>
            <InputLabel id='module-select-label'>Módulo</InputLabel>
            <Select
              labelId='module-select-label'
              id='module-select'
              value={moduleValue}
              label='Módulo'
              onChange={e => handleModuleFilter(e.target.value as string)}
            >
              <MenuItem value=''>
                <em>Todos los módulos</em>
              </MenuItem>
              {modules.map(module => (
                <MenuItem key={module} value={module} sx={{ textTransform: 'capitalize' }}>
                  {module}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </>
  )
}

export default TableHeader
