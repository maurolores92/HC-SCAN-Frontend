// ** MUI Imports
import Box from '@mui/material/Box'

// ** Custom Component Import
import TableSearchInput from 'src/components/common/TableSearchInput'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, value } = props

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TableSearchInput
          value={value}
          sx={{ mr: 4, mb: 2, minWidth: 260 }}
          placeholder='Buscar usuario...'
          onChange={handleFilter}
        />
      </Box>
    </Box>
  )
}

export default TableHeader
