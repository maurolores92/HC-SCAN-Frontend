import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Icon from 'src/@core/components/icon'
import { Control, Controller } from 'react-hook-form'

interface ModuleOption {
  id: string
  name: string
  icon: string
}

const AVAILABLE_MODULES: ModuleOption[] = [
  { id: 'documents', name: 'Documentos PDF & FTP', icon: 'tabler:file-text' },
  { id: 'users', name: 'Usuarios', icon: 'tabler:users' },
  { id: 'roles', name: 'Roles y Permisos', icon: 'tabler:shield-check' },
  { id: 'audit', name: 'Auditoría', icon: 'tabler:clipboard-list' },
  { id: 'notifications', name: 'Notificaciones', icon: 'tabler:bell' }
]

interface CompanyModulesSelectorProps {
  control: Control<any>
}

export const CompanyModulesSelector: React.FC<CompanyModulesSelectorProps> = ({ control }) => {
  return (
    <Grid item xs={12}>
      <Typography variant='h6' sx={{ mt: 2, fontWeight: 600 }}>
        Módulos Habilitados
      </Typography>
      <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
        Seleccione las funcionalidades activas para este cliente tenant:
      </Typography>

      <Controller
        name='enabledModules'
        control={control}
        render={({ field }) => {
          const selected = field.value || ['documents', 'users', 'roles', 'audit', 'notifications']

          const toggleModule = (modId: string) => {
            if (selected.includes(modId)) {
              if (selected.length > 1) {
                field.onChange(selected.filter((id: string) => id !== modId))
              }
            } else {
              field.onChange([...selected, modId])
            }
          }

          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {AVAILABLE_MODULES.map(mod => {
                const isSelected = selected.includes(mod.id)
                
return (
                  <Chip
                    key={mod.id}
                    label={mod.name}
                    icon={<Icon icon={mod.icon} />}
                    color={isSelected ? 'primary' : 'default'}
                    variant={isSelected ? 'filled' : 'outlined'}
                    onClick={() => toggleModule(mod.id)}
                    sx={{ cursor: 'pointer', py: 2.5, px: 1, fontSize: '0.85rem' }}
                  />
                )
              })}
            </Box>
          )
        }}
      />
    </Grid>
  )
}

export default CompanyModulesSelector
