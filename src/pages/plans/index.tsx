import React from 'react'
import PlansListView from 'src/views/apps/plans/PlansListView'

const PlansPage = () => {
  return <PlansListView />
}

PlansPage.acl = {
  action: 'manage',
  subject: 'plans'
}

export default PlansPage

