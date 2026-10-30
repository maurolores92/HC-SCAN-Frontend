// ** React Imports
import { useState, useEffect, forwardRef, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Types
import { EventDateType, AddEventSidebarType } from 'src/types/apps/calendarTypes'

interface PickerProps {
  label?: string
  error?: boolean
  registername?: string
}

interface DefaultStateType {
  url: string
  title: string
  allDay: boolean
  calendar: string
  description: string
  endDate: Date | string
  startDate: Date | string
  guests: string[] | string | undefined
}

const capitalize = (string: string) => string && string[0].toUpperCase() + string.slice(1)

const defaultState: DefaultStateType = {
  url: '',
  title: '',
  guests: [],
  allDay: true,
  description: '',
  endDate: new Date(),
  calendar: 'Business',
  startDate: new Date()
}

export type EventModalProps = AddEventSidebarType

export const AddEventModal = (props: EventModalProps) => {
  // ** Props
  const {
    store,
    dispatch,
    addEvent,
    updateEvent,
    calendarApi,
    deleteEvent,
    handleSelectEvent,
    addEventSidebarOpen,
    handleAddEventSidebarToggle
  } = props

  // ** States
  const [values, setValues] = useState<DefaultStateType>(defaultState)

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { title: '' } })

  const isEditing = store.selectedEvent !== null && Boolean(store.selectedEvent.title?.length)

  const handleModalClose = useCallback(() => {
    setValues(defaultState)
    clearErrors()
    dispatch(handleSelectEvent(null))
    handleAddEventSidebarToggle()
  }, [clearErrors, dispatch, handleSelectEvent, handleAddEventSidebarToggle])

  const onSubmit = (data: { title: string }) => {
    const modifiedEvent = {
      url: values.url,
      display: 'block',
      title: data.title,
      end: values.endDate,
      allDay: values.allDay,
      start: values.startDate,
      extendedProps: {
        calendar: capitalize(values.calendar),
        guests: values.guests && values.guests.length ? values.guests : undefined,
        description: values.description?.length ? values.description : undefined
      }
    }
    if (!isEditing) {
      dispatch(addEvent(modifiedEvent))
    } else {
      dispatch(updateEvent({ id: store.selectedEvent!.id, ...modifiedEvent }))
    }
    calendarApi?.refetchEvents()
    handleModalClose()
  }

  const handleDeleteEvent = () => {
    if (store.selectedEvent) {
      dispatch(deleteEvent(store.selectedEvent.id))
    }
    handleModalClose()
  }

  const resetToStoredValues = useCallback(() => {
    if (store.selectedEvent !== null) {
      const event = store.selectedEvent
      setValue('title', event.title || '')
      setValues({
        url: event.url || '',
        title: event.title || '',
        allDay: event.allDay,
        guests: event.extendedProps.guests || [],
        description: event.extendedProps.description || '',
        calendar: event.extendedProps.calendar || 'Business',
        endDate: event.end !== null ? event.end : event.start,
        startDate: event.start !== null ? event.start : new Date()
      })
    }
  }, [setValue, store.selectedEvent])

  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValues(defaultState)
  }, [setValue])

  useEffect(() => {
    if (store.selectedEvent !== null) {
      resetToStoredValues()
    } else {
      resetToEmptyValues()
    }
  }, [addEventSidebarOpen, resetToStoredValues, resetToEmptyValues, store.selectedEvent])

  const PickersComponent = forwardRef(({ ...pickerProps }: PickerProps, ref) => {
    return (
      <CustomTextField
        inputRef={ref}
        fullWidth
        {...pickerProps}
        label={pickerProps.label || ''}
        error={pickerProps.error}
      />
    )
  })

  return (
    <Dialog
      open={addEventSidebarOpen}
      onClose={handleModalClose}
      maxWidth='sm'
      fullWidth
      aria-labelledby='calendar-event-modal-title'
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <DialogTitle
          id='calendar-event-modal-title'
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: isEditing ? 'info.lighter' : 'primary.lighter',
                color: isEditing ? 'info.main' : 'primary.main'
              }}
            >
              <Icon icon={isEditing ? 'tabler:edit' : 'tabler:calendar-plus'} fontSize={20} />
            </Box>
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 600 }}>
                {isEditing ? 'Actualizar Evento' : 'Nuevo Evento de Agenda'}
              </Typography>
              <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                {isEditing ? 'Edita los detalles del evento seleccionado' : 'Completa los datos del nuevo evento'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isEditing && (
              <IconButton size='small' color='error' onClick={handleDeleteEvent} title='Eliminar evento'>
                <Icon icon='tabler:trash' fontSize={20} />
              </IconButton>
            )}
            <IconButton size='small' onClick={handleModalClose} title='Cerrar'>
              <Icon icon='tabler:x' fontSize={20} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 4 }}>
          <DatePickerWrapper>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Controller
                  name='title'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Título del Evento'
                      placeholder='Ej: Mantenimiento Preventivo, Reunión...'
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.title)}
                      {...(errors.title && { helperText: 'El título es requerido' })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  select
                  fullWidth
                  label='Categoría / Calendario'
                  SelectProps={{
                    value: values.calendar,
                    onChange: e => setValues({ ...values, calendar: e.target.value as string })
                  }}
                >
                  <MenuItem value='Business'>Técnica / Comercial</MenuItem>
                  <MenuItem value='Personal'>Personal</MenuItem>
                  <MenuItem value='Holiday'>Feriado / Guardia</MenuItem>
                  <MenuItem value='Family'>General</MenuItem>
                  <MenuItem value='ETC'>Otros</MenuItem>
                </CustomTextField>
              </Grid>

              <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', pt: { sm: '28px !important' } }}>
                <FormControlLabel
                  label='Todo el día'
                  control={
                    <Switch
                      checked={values.allDay}
                      onChange={e => setValues({ ...values, allDay: e.target.checked })}
                      color='primary'
                    />
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  selectsStart
                  id='event-start-date'
                  endDate={values.endDate as EventDateType}
                  selected={values.startDate as EventDateType}
                  startDate={values.startDate as EventDateType}
                  showTimeSelect={!values.allDay}
                  dateFormat={!values.allDay ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
                  customInput={<PickersComponent label='Fecha de Inicio' registername='startDate' />}
                  onChange={(date: Date) => {
                    const newStart = new Date(date)
                    setValues(prev => ({
                      ...prev,
                      startDate: newStart,
                      endDate: newStart > (prev.endDate as Date) ? newStart : prev.endDate
                    }))
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  selectsEnd
                  id='event-end-date'
                  endDate={values.endDate as EventDateType}
                  selected={values.endDate as EventDateType}
                  minDate={values.startDate as EventDateType}
                  startDate={values.startDate as EventDateType}
                  showTimeSelect={!values.allDay}
                  dateFormat={!values.allDay ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
                  customInput={<PickersComponent label='Fecha de Fin' registername='endDate' />}
                  onChange={(date: Date) => setValues({ ...values, endDate: new Date(date) })}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  type='url'
                  id='event-url'
                  label='Enlace / URL (opcional)'
                  placeholder='https://meet.google.com/...'
                  value={values.url}
                  onChange={e => setValues({ ...values, url: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomTextField
                  rows={3}
                  multiline
                  fullWidth
                  label='Descripción / Observaciones'
                  id='event-description'
                  placeholder='Detalles adicionales del evento o servicio...'
                  value={values.description}
                  onChange={e => setValues({ ...values, description: e.target.value })}
                />
              </Grid>
            </Grid>
          </DatePickerWrapper>
        </DialogContent>

        <DialogActions sx={{ pb: 3, px: 4 }}>
          <Button variant='tonal' color='secondary' onClick={handleModalClose}>
            Cancelar
          </Button>
          <Button type='submit' variant='contained'>
            {isEditing ? 'Guardar Cambios' : 'Crear Evento'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddEventModal
