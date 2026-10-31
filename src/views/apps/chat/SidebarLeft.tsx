// ** React Imports
import { useState, ChangeEvent, ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Chip from '@mui/material/Chip'
import Badge from '@mui/material/Badge'
import Drawer from '@mui/material/Drawer'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Types
import { ChatSidebarLeftType, ContactType } from 'src/types/apps/chatTypes'

// ** Custom Components Import
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import UserProfileLeft from 'src/views/apps/chat/UserProfileLeft'

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflow: 'auto' }}>{children}</Box>
  }

  return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
}

const SidebarLeft = (props: ChatSidebarLeftType) => {
  const {
    store,
    hidden,
    mdAbove,
    dispatch,
    statusObj,
    userStatus,
    selectChat,
    getInitials,
    sidebarWidth,
    setUserStatus,
    leftSidebarOpen,
    userProfileLeftOpen,
    handleLeftSidebarToggle,
    handleUserProfileLeftSidebarToggle
  } = props

  const [query, setQuery] = useState<string>('')

  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value.toLowerCase())
  }

  const handleItemClick = (id: number) => {
    dispatch(selectChat(id))
    if (!mdAbove) {
      handleLeftSidebarToggle()
    }
  }

  const selectedId = store?.selectedChat?.contact?.id ?? 0

  const contacts = store?.contacts || []
  const generalContact = contacts.find(c => c.id === 0)
  const documentContacts = contacts.filter(c => c.id > 0)

  const filteredDocs = documentContacts.filter(doc => {
    if (!query.trim()) return true
    const q = query.trim()
    const nameMatch = doc.fullName.toLowerCase().includes(q)
    const roleMatch = doc.role.toLowerCase().includes(q)
    const aboutMatch = doc.about.toLowerCase().includes(q)

    return nameMatch || roleMatch || aboutMatch
  })

  const renderItem = (item: ContactType, isGeneral: boolean) => {
    const isActive = selectedId === item.id

    return (
      <ListItem key={item.id} disablePadding sx={{ '&:not(:last-child)': { mb: 1 } }}>
        <ListItemButton
          disableRipple
          onClick={() => handleItemClick(item.id)}
          sx={{
            py: 2.5,
            px: 3,
            width: '100%',
            borderRadius: 1,
            alignItems: 'center',
            '&.MuiListItemButton-root:hover': { backgroundColor: 'action.hover' },
            ...(isActive && {
              background: theme =>
                `linear-gradient(72.47deg, ${theme.palette.primary.main} 22.16%, ${hexToRGBA(
                  theme.palette.primary.main,
                  0.7
                )} 76.47%) !important`
            })
          }}
        >
          <ListItemAvatar sx={{ m: 0, mr: 3 }}>
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box
                  component='span'
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    color: `${statusObj[item.status]}.main`,
                    backgroundColor: `${statusObj[item.status]}.main`,
                    boxShadow: theme =>
                      `0 0 0 2px ${!isActive ? theme.palette.background.paper : theme.palette.common.white}`
                  }}
                />
              }
            >
              <CustomAvatar
                color={isGeneral ? 'primary' : item.avatarColor || 'info'}
                skin={isActive ? 'light-static' : 'light'}
                sx={{
                  width: 38,
                  height: 38,
                  fontSize: theme => theme.typography.body1.fontSize,
                  outline: theme => `2px solid ${isActive ? theme.palette.common.white : 'transparent'}`
                }}
              >
                {isGeneral ? (
                  <Icon icon='tabler:sparkles' fontSize='1.25rem' />
                ) : (
                  getInitials(item.fullName)
                )}
              </CustomAvatar>
            </Badge>
          </ListItemAvatar>
          <ListItemText
            sx={{
              my: 0,
              ml: 1,
              ...(isActive && { '& .MuiTypography-root': { color: 'common.white !important' } })
            }}
            primary={
              <Typography noWrap sx={{ fontWeight: 500, fontSize: '0.9375rem' }}>
                {item.fullName}
              </Typography>
            }
            secondary={
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled', fontSize: '0.8125rem' }}>
                {item.role}
              </Typography>
            }
          />
          {item.documentMetadata?.documentType && !isActive ? (
            <Chip
              size='small'
              label={item.documentMetadata.documentType}
              color='primary'
              variant='outlined'
              sx={{ height: 20, fontSize: '0.6875rem' }}
            />
          ) : null}
        </ListItemButton>
      </ListItem>
    )
  }

  return (
    <div>
      <Drawer
        open={leftSidebarOpen}
        onClose={handleLeftSidebarToggle}
        variant={mdAbove ? 'permanent' : 'temporary'}
        ModalProps={{ disablePortal: true, keepMounted: true }}
        sx={{
          zIndex: 7,
          height: '100%',
          display: 'block',
          position: mdAbove ? 'static' : 'absolute',
          '& .MuiDrawer-paper': {
            boxShadow: 'none',
            overflow: 'hidden',
            width: sidebarWidth,
            position: mdAbove ? 'static' : 'absolute',
            borderTopLeftRadius: theme => theme.shape.borderRadius,
            borderBottomLeftRadius: theme => theme.shape.borderRadius,
            borderRight: theme => `1px solid ${theme.palette.divider}`
          },
          '& > .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute',
            zIndex: theme => theme.zIndex.drawer - 1
          }
        }}
      >
        <Box
          sx={{
            py: 3,
            px: 4,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          {store?.userProfile ? (
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              sx={{ mr: 3 }}
              onClick={handleUserProfileLeftSidebarToggle}
              badgeContent={
                <Box
                  component='span'
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    color: `${statusObj[userStatus]}.main`,
                    backgroundColor: `${statusObj[userStatus]}.main`,
                    boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
                  }}
                />
              }
            >
              <MuiAvatar
                src={store.userProfile.avatar}
                alt={store.userProfile.fullName}
                sx={{ width: '2.375rem', height: '2.375rem', cursor: 'pointer' }}
              />
            </Badge>
          ) : null}
          <CustomTextField
            fullWidth
            value={query}
            onChange={handleFilter}
            placeholder='Buscar documentos...'
            sx={{ '& .MuiInputBase-root': { borderRadius: '30px !important' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start' sx={{ color: 'text.secondary' }}>
                  <Icon fontSize='1.25rem' icon='tabler:search' />
                </InputAdornment>
              )
            }}
          />
          {!mdAbove ? (
            <IconButton sx={{ p: 1, ml: 1 }} onClick={handleLeftSidebarToggle}>
              <Icon icon='tabler:x' />
            </IconButton>
          ) : null}
        </Box>

        <Box sx={{ height: `calc(100% - 4.25rem)` }}>
          <ScrollWrapper hidden={hidden}>
            <Box sx={{ p: theme => theme.spacing(4, 3, 3) }}>
              <Typography variant='caption' sx={{ ml: 2, mb: 2, display: 'block', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase' }}>
                Asistente General
              </Typography>
              <List sx={{ mb: 4, p: 0 }}>
                {generalContact ? renderItem(generalContact, true) : null}
              </List>

              <Typography variant='caption' sx={{ ml: 2, mb: 2, display: 'block', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase' }}>
                Documentos ({filteredDocs.length})
              </Typography>
              <List sx={{ p: 0 }}>
                {filteredDocs.length > 0 ? (
                  filteredDocs.map(doc => renderItem(doc, false))
                ) : (
                  <ListItem>
                    <Typography variant='body2' sx={{ color: 'text.secondary', px: 2 }}>
                      {query.length ? 'No se encontraron documentos' : 'No hay documentos procesados'}
                    </Typography>
                  </ListItem>
                )}
              </List>
            </Box>
          </ScrollWrapper>
        </Box>
      </Drawer>

      <UserProfileLeft
        store={store}
        hidden={hidden}
        statusObj={statusObj}
        userStatus={userStatus}
        sidebarWidth={sidebarWidth}
        setUserStatus={setUserStatus}
        userProfileLeftOpen={userProfileLeftOpen}
        handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
      />
    </div>
  )
}

export default SidebarLeft
