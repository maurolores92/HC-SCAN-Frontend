import React, { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip'
import Icon from 'src/@core/components/icon'

export interface RoleCardItemProps {
  role: any
  onEdit: (role: any) => void
  onDelete?: (roleId: number) => void
}

const BASE_ROLE_SLUGS = ['superadmin', 'company_admin', 'admin', 'user']

const RoleCardItem: React.FC<RoleCardItemProps> = ({ role, onEdit, onDelete }) => {
  const ability = useContext(AbilityContext)
  const isGlobalBaseRole = !role.companyId || BASE_ROLE_SLUGS.includes(role.slug)

  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography sx={{ color: 'text.secondary' }}>
                  {`Total ${role.usersCount || 0} usuarios`}
                </Typography>
                <Chip
                  size='small'
                  variant='outlined'
                  color={isGlobalBaseRole ? 'secondary' : 'primary'}
                  label={isGlobalBaseRole ? 'Rol Base' : 'Rol Propio'}
                />
              </Box>
              <Typography variant='h5' sx={{ fontWeight: 600 }}>
                {role.name}
              </Typography>
            </Box>

            {!isGlobalBaseRole && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {ability?.can('update', 'roles') && (
                  <Tooltip title='Editar Rol de Compañía'>
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
                {onDelete && ability?.can('delete', 'roles') && (
                  <Tooltip title='Eliminar Rol de Compañía'>
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
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default RoleCardItem
