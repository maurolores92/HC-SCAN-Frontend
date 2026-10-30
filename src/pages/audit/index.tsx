// ** React Imports
import AuditListView from 'src/views/apps/audit/AuditListView'

const AuditList = () => {
  return <AuditListView />
}

AuditList.acl = {
  action: 'read',
  subject: 'audits'
}

export default AuditList
