import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import toast from 'react-hot-toast'
import apiConnector from 'src/services/api.service'

interface Props {
  userId: number
  userDirectPermissions: any[]
  userRolePermissions: any[]
}

const UserPermissionsTab = ({ userId, userDirectPermissions, userRolePermissions }: Props) => {
  const [allPermissions, setAllPermissions] = useState<any[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch all permissions available
    apiConnector.get('/permissions').then((res: any) => {
      setAllPermissions(res)
    })
    
    if (userDirectPermissions) {
      setSelectedIds(userDirectPermissions.map(p => p.id))
    }
  }, [userDirectPermissions])

  const handleCheckboxChange = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await apiConnector.put(`/users/${userId}/permissions`, { permissionIds: selectedIds })
      toast.success('Permisos actualizados correctamente')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al actualizar permisos')
    } finally {
      setLoading(false)
    }
  }

  // Group permissions by category
  const grouped = allPermissions.reduce((acc, curr) => {
    const cat = curr.categoria || 'OTROS'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(curr)
    
return acc
  }, {} as Record<string, any[]>)

  return (
    <Card>
      <CardHeader title='Excepciones de Permisos' subheader='Asigna permisos adicionales que no están incluidos en el rol de este usuario.' />
      <CardContent>
        {Object.keys(grouped).map(category => (
          <Box key={category} sx={{ mb: 6 }}>
            <Typography variant='h6' sx={{ mb: 2, textTransform: 'capitalize' }}>
              {category.replace('_', ' ')}
            </Typography>
            <Grid container spacing={4}>
              {grouped[category].map((perm: any) => {
                const isFromRole = userRolePermissions.some((p: any) => p.id === perm.id)
                
return (
                  <Grid item xs={12} sm={6} md={4} key={perm.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isFromRole || selectedIds.includes(perm.id)}
                          disabled={isFromRole}
                          onChange={() => handleCheckboxChange(perm.id)}
                        />
                      }
                      label={
                        <Typography sx={{ color: isFromRole ? 'text.disabled' : 'text.primary' }}>
                          {perm.displayName || perm.name} {isFromRole && '(Rol)'}
                        </Typography>
                      }
                    />
                  </Grid>
                )
              })}
            </Grid>
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button variant='contained' onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default UserPermissionsTab
