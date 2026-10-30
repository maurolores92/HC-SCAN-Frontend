// ** React Imports
import { useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'

// ** Icons
import Icon from 'src/@core/components/icon'

// ** Hook
import { useNotifications } from 'src/hooks/useNotifications'

// ** Types
import {
  NOTIFICATION_CATEGORIES,
  NotificationCategoryMeta,
} from 'src/types/apps/notificationTypes'

// ── Tipos internos para las filas del DataGrid ──────────────────────────────
interface NotificationRow {
  id: string                        // notificationType key
  label: string                     // nombre legible
  description: string
  category: NotificationCategoryMeta
  inApp: boolean
  emoji?: string
}

// Aplanar el catálogo en filas
const buildRows = (
  preferences: { notificationType: string; inApp: boolean }[],
): NotificationRow[] => {
  const rows: NotificationRow[] = []
  for (const category of NOTIFICATION_CATEGORIES) {
    for (const type of category.types) {
      const pref = preferences.find(p => p.notificationType === type.key)
      rows.push({
        id: type.key,
        label: type.label,
        description: type.description,
        category,
        inApp: pref?.inApp ?? true,
        emoji: type.emoji,
      })
    }
  }

  return rows
}

// ── Header de la tabla ───────────────────────────────────────────────────────
const TableHeader = () => (
  <Box
    sx={{
      px: 6,
      py: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: theme => `1px solid ${theme.palette.divider}`,
    }}
  >
    <Box>
      <Typography variant='h6' sx={{ fontWeight: 600 }}>
        Preferencias de notificaciones
      </Typography>
      <Typography variant='body2' color='text.secondary'>
        Activá o desactivá cada tipo de notificación in-app
      </Typography>
    </Box>
    <Chip
      icon={<Icon icon='tabler:info-circle' fontSize='0.9rem' />}
      label='Los cambios se guardan automáticamente'
      size='small'
      variant='outlined'
      color='info'
    />
  </Box>
)

// ── Vista principal ──────────────────────────────────────────────────────────
const NotificationSettingsView = () => {
  const theme = useTheme()
  const { preferences, preferencesLoading, loadPreferences, savePreferences } = useNotifications()

  useEffect(() => {
    loadPreferences()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rows = buildRows(preferences)

  const handleToggle = async (notificationType: string, inApp: boolean) => {
    await savePreferences([{ notificationType, inApp }])
  }

  const columns: GridColDef[] = [
    // ── Notificación ──────────────────────────────────────────────────────
    {
      field: 'label',
      headerName: 'Notificación',
      flex: 1,
      minWidth: 220,
      renderCell: ({ row }: { row: NotificationRow }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {row.emoji && (
            <Typography component='span' sx={{ fontSize: '1.15rem', lineHeight: 1 }}>
              {row.emoji}
            </Typography>
          )}
          <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
            {row.label}
          </Typography>
        </Box>
      ),
    },

    // ── Categoría ─────────────────────────────────────────────────────────
    {
      field: 'category',
      headerName: 'Categoría',
      width: 200,
      renderCell: ({ row }: { row: NotificationRow }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: `${row.category.color}20`,
              color: row.category.color,
            }}
          >
            <Icon icon={row.category.icon} fontSize='0.95rem' />
          </Avatar>
          <Chip
            label={row.category.label}
            size='small'
            sx={{
              height: 22,
              fontSize: '0.7rem',
              fontWeight: 600,
              backgroundColor: `${row.category.color}18`,
              color: row.category.color,
              border: `1px solid ${row.category.color}40`,
              '& .MuiChip-label': { px: 1.2 },
            }}
          />
        </Box>
      ),
    },

    // ── Descripción ───────────────────────────────────────────────────────
    {
      field: 'description',
      headerName: 'Descripción',
      flex: 2,
      minWidth: 240,
      renderCell: ({ row }: { row: NotificationRow }) => (
        <Typography variant='caption' sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
          {row.description}
        </Typography>
      ),
    },

    // ── In-App toggle ─────────────────────────────────────────────────────
    {
      field: 'inApp',
      headerName: 'In-App',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: { row: NotificationRow }) => (
        <Switch
          checked={row.inApp}
          size='small'
          color='primary'
          onChange={e => handleToggle(row.id, e.target.checked)}
          inputProps={{ 'aria-label': `toggle ${row.label}` }}
        />
      ),
    },
  ]

  return (
    <Grid container spacing={6}>
      {/* Page header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 600 }}>
              Configuración de Notificaciones
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              Personalizá qué notificaciones querés recibir en la aplicación
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* DataGrid card */}
      <Grid item xs={12}>
        <Card>
          <TableHeader />

          {preferencesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              autoHeight
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              hideFooter
              rowHeight={60}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.04)'
                      : 'rgba(0,0,0,0.03)',
                  borderRadius: 0,
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.03)'
                      : 'rgba(0,0,0,0.02)',
                },
                '& .MuiDataGrid-cell': {
                  borderColor: theme.palette.divider,
                  alignItems: 'center',
                  display: 'flex',
                },
                '& .MuiDataGrid-columnSeparator': { display: 'none' },
              }}
            />
          )}

          {/* Footer — canales futuros */}
          <Box
            sx={{
              px: 6,
              py: 3,
              borderTop: theme => `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.02)'
                  : 'rgba(0,0,0,0.01)',
            }}
          >
            <Icon icon='tabler:clock' fontSize='1rem' />
            <Typography variant='caption' color='text.secondary'>
              <strong>Próximamente:</strong> Notificaciones por Email y Push
            </Typography>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default NotificationSettingsView
