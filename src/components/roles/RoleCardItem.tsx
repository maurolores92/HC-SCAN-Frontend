import React, { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

export interface RoleCardItemProps {
  role: any
  onEdit: (role: any) => void
  onDelete?: (roleId: number) => void
}

const RoleCardItem: React.FC<RoleCardItemProps> = ({ role, onEdit, onDelete }) => {
  const ability = useContext(AbilityContext)

  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ color: 'text.secondary', mb: 2 }}>{`Total ${role.usersCount || 0} usuarios`}</Typography>
              <Typography variant='h4'>
                {role.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Solo superadmin no se edita. Los roles del sistema (admin, tecnico, jefe_deposito) pueden editar sus permisos */}
              {role.slug !== 'superadmin' && ability?.can('update', 'roles') && (
                <Tooltip title={['admin', 'tecnico', 'jefe_deposito', 'gerente_soporte_tecnico'].includes(role.slug) ? 'Editar Permisos del Rol' : 'Editar Rol'}>
                  <IconButton
                    size='small'
                    color='primary'
                    onClick={e => {
                      e.preventDefault()
                      onEdit(role)
                    }}
                    sx={{ mb: 1 }}
                  >
                    <Icon icon='tabler:edit' />
                  </IconButton>
                </Tooltip>
              )}
              {/* Los roles del sistema no se pueden eliminar */}
              {onDelete && !['superadmin', 'admin', 'tecnico', 'jefe_deposito', 'gerente_soporte_tecnico'].includes(role.slug) && ability?.can('delete', 'roles') && (
                <Tooltip title='Eliminar Rol'>
                  <IconButton
                    size='small'
                    color='error'
                    onClick={e => {
                      e.preventDefault()
                      onDelete(role.id)
                    }}
                  >
                    <Icon icon='tabler:trash' />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default RoleCardItem
