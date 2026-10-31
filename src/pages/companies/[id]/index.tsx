import React from 'react'
import CompanyDetailView from 'src/views/apps/companies/view/CompanyDetailView'

const CompanyDetailPage = () => {
  return <CompanyDetailView />
}

CompanyDetailPage.acl = {
  action: 'manage',
  subject: 'companies'
}

export default CompanyDetailPage
