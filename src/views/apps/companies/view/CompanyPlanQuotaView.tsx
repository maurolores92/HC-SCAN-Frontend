import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Icon from 'src/@core/components/icon'
import TenantPlanUsageCard from 'src/components/common/TenantPlanUsageCard'
import CompanyModal from '../list/CompanyModal'

interface CompanyPlanQuotaViewProps {
  company: any
  onCompanyUpdated: () => void
}

export const CompanyPlanQuotaView: React.FC<CompanyPlanQuotaViewProps> = ({
  company,
  onCompanyUpdated
}) => {
  const [editOpen, setEditOpen] = useState(false)
  const [refreshTick, setRefreshTick] = useState(0)

  const handleUpdated = () => {
    setRefreshTick(prev => prev + 1)
    onCompanyUpdated()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant='contained'
            startIcon={<Icon icon='tabler:adjustments-horizontal' />}
            onClick={() => setEditOpen(true)}
          >
            Cambiar Plan o Personalizar Límites
          </Button>
        </Box>

        <TenantPlanUsageCard
          key={`${company.id}-${refreshTick}`}
          companyId={Number(company.id)}
          title={`Plan y Consumo de ${company.name}`}
          subheader='Cuotas activas de usuarios, documentos PDF, espacio en disco y consultas mensuales a la IA'
        />
      </Grid>

      <CompanyModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={handleUpdated}
        companyData={company}
      />
    </Grid>
  )
}

export default CompanyPlanQuotaView

