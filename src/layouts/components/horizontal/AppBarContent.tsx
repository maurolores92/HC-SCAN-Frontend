// ** MUI Imports
import Box from '@mui/material/Box'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import Autocomplete from 'src/layouts/components/Autocomplete'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import NotificationBell from 'src/components/notifications/NotificationBell'

// ** Hook Import
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  hidden: boolean
  settings: Settings
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  const { hidden, settings, saveSettings } = props
  const auth = useAuth()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {auth.user && <Autocomplete hidden={hidden} settings={settings} />}
      <ModeToggler settings={settings} saveSettings={saveSettings} />
      {auth.user && (
        <>
          <NotificationBell />
          <UserDropdown settings={settings} />
        </>
      )}
    </Box>
  )
}

export default AppBarContent
