// ** React Imports
import React from 'react'

// ** Custom Views
import DocumentsListView from 'src/views/apps/documents/DocumentsListView'

const DocumentsPage = () => {
  return <DocumentsListView />
}

DocumentsPage.acl = {
  action: 'read',
  subject: 'documents'
}

export default DocumentsPage

