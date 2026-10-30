// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Icons Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { SidebarLeftType, CalendarFiltersType } from 'src/types/apps/calendarTypes'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

export type CalendarFilterPanelProps = SidebarLeftType

export const CalendarFilterPanel = (props: CalendarFilterPanelProps) => {
  const {
    store,
    dispatch,
    calendarApi,
    calendarsColor,
    handleSelectEvent,
    handleAllCalendars,
    handleCalendarsUpdate,
    handleAddEventSidebarToggle
  } = props

  const colorsArr = calendarsColor ? Object.entries(calendarsColor) : []

  const handleOpenAddModal = () => {
    handleAddEventSidebarToggle()
    dispatch(handleSelectEvent(null))
  }

  const renderFilters = colorsArr.length
    ? colorsArr.map(([key, value]: string[]) => {
        return (
          <FormControlLabel
            key={key}
            label={key}
            sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary', fontSize: '0.875rem' } }}
            control={
              <Checkbox
                color={value as ThemeColor}
                checked={store.selectedCalendars.includes(key as CalendarFiltersType)}
                onChange={() => dispatch(handleCalendarsUpdate(key as CalendarFiltersType))}
              />
            }
          />
        )
      })
    : null

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
        <Button
          fullWidth
          variant='contained'
          startIcon={<Icon icon='tabler:plus' fontSize='1.125rem' />}
          onClick={handleOpenAddModal}
        >
          Nuevo Evento
        </Button>
      </CardContent>

      <Divider sx={{ m: '0 !important' }} />

      <Box sx={{ p: 2 }}>
        <DatePickerWrapper
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            '& .react-datepicker': { boxShadow: 'none !important', border: 'none !important' }
          }}
        >
          <DatePicker inline onChange={date => calendarApi?.gotoDate(date)} />
        </DatePickerWrapper>
      </Box>

      <Divider sx={{ m: '0 !important' }} />

      <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant='caption' sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>
          Filtros de Calendario
        </Typography>

        <FormControlLabel
          label='Ver Todos'
          sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary', fontWeight: 600, fontSize: '0.875rem' } }}
          control={
            <Checkbox
              checked={store.selectedCalendars.length === colorsArr.length}
              onChange={e => dispatch(handleAllCalendars(e.target.checked))}
            />
          }
        />

        {renderFilters}
      </CardContent>
    </Card>
  )
}

export default CalendarFilterPanel
