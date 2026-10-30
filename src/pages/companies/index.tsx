// ** React Imports
import React from 'react'

// ** Custom Views
import CompaniesListView from 'src/views/apps/companies/list/CompaniesListView'

const CompaniesPage = () => {
  return <CompaniesListView />
}

CompaniesPage.acl = {
  action: 'manage',
  subject: 'companies'
}

export default CompaniesPage
