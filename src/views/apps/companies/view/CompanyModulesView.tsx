import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import toast from 'react-hot-toast'
import useApi from 'src/hooks/useApi'
import { useAuth } from 'src/hooks/useAuth'
import apiConnector from 'src/services/api.service'

interface CompanyModulesViewProps {
  companyId: number
}

const CompanyModulesView: React.FC<CompanyModulesViewProps> = ({ companyId }) => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [permissionsList, setPermissionsList] = useState<any[]>([])
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])

  const apiPermissions = useApi('permissions')
  const auth = useAuth()

  const isSuperAdmin = auth.user?.role === 'superadmin'

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [perms, companyModules] = await Promise.all([
        apiPermissions.getAll(),
        apiConnector.get(`/companies/${companyId}/modules`)
      ])
      
      const filteredPerms = (perms as any[]).filter(p => p.name !== 'VIEW_COMPANIES')
      setPermissionsList(filteredPerms)
      setSelectedPermissionIds(companyModules as number[])
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar los módulos')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await apiConnector.put(`/companies/${companyId}/modules`, {
        permissionIds: selectedPermissionIds
      })
      toast.success('Módulos actualizados correctamente')
    } catch (error) {
      console.error(error)
      toast.error('Error al actualizar los módulos')
    } finally {
      setSaving(false)
    }
  }

  const groupedPermissions = permissionsList.reduce((acc: any, perm: any) => {
    const category = perm.categoria || 'GENERAL'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(perm)
    
return acc
  }, {})

  const categories = Object.keys(groupedPermissions)

  const toggleCategory = (category: string) => {
    if (!isSuperAdmin) return

    const categoryPerms = groupedPermissions[category].map((p: any) => p.id)
    const allSelected = categoryPerms.every((id: any) => selectedPermissionIds.includes(id))
    
    if (allSelected) {
      setSelectedPermissionIds(selectedPermissionIds.filter(id => !categoryPerms.includes(id)))
    } else {
      setSelectedPermissionIds(Array.from(new Set([...selectedPermissionIds, ...categoryPerms])))
    }
  }

  if (loading) {
    return (
      <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Cargando módulos...</Typography>
      </Box>
    )
  }

  return (
    <Card>
      <CardHeader 
        title='Módulos Habilitados' 
        subheader={isSuperAdmin ? 'Selecciona los módulos a los que esta empresa tendrá acceso.' : 'Módulos actualmente contratados por tu empresa.'}
      />
      <CardContent>
        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={groupedPermissions[category].every((p: any) => selectedPermissionIds.includes(p.id))}
                    onChange={() => toggleCategory(category)}
                    disabled={!isSuperAdmin}
                  />
                }
                label={category.replace(/_/g, ' ')}
                sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
              />
            </Grid>
          ))}
        </Grid>
        
        {isSuperAdmin && (
          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='contained' onClick={handleSave} disabled={saving}>
              {saving ? <CircularProgress size={24} color='inherit' /> : 'Guardar Cambios'}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default CompanyModulesView
