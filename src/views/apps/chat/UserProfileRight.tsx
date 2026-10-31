// ** React Imports
import { Fragment, ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Chip from '@mui/material/Chip'
import Badge from '@mui/material/Badge'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Type
import { UserProfileRightType } from 'src/types/apps/chatTypes'

// ** Custom Component Imports
import Sidebar from 'src/@core/components/sidebar'
import CustomAvatar from 'src/@core/components/mui/avatar'

const formatBytes = (bytes?: number) => {
  if (!bytes) return 'N/A'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`

  return `${(kb / 1024).toFixed(2)} MB`
}

const UserProfileRight = (props: UserProfileRightType) => {
  const {
    store,
    hidden,
    statusObj,
    getInitials,
    sidebarWidth,
    userProfileRightOpen,
    handleUserProfileRightSidebarToggle
  } = props

  const selectedChat = store?.selectedChat
  const isGeneral = !selectedChat || selectedChat.contact.id === 0
  const docMeta = selectedChat?.contact?.documentMetadata

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    }

    return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
  }

  return (
    <Sidebar
      direction='right'
      show={userProfileRightOpen}
      backDropClick={handleUserProfileRightSidebarToggle}
      sx={{
        zIndex: 9,
        height: '100%',
        width: sidebarWidth,
        borderTopRightRadius: theme => theme.shape.borderRadius,
        borderBottomRightRadius: theme => theme.shape.borderRadius,
        '& + .MuiBackdrop-root': {
          zIndex: 8,
          borderRadius: 1
        }
      }}
    >
      {selectedChat ? (
        <Fragment>
          <Box sx={{ position: 'relative' }}>
            <IconButton
              size='small'
              onClick={handleUserProfileRightSidebarToggle}
              sx={{ top: '0.5rem', right: '0.5rem', position: 'absolute', color: 'text.disabled' }}
            >
              <Icon icon='tabler:x' />
            </IconButton>
            <Box sx={{ display: 'flex', flexDirection: 'column', p: theme => theme.spacing(10, 6, 4) }}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Badge
                  overlap='circular'
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Box
                      component='span'
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        color: `${statusObj[selectedChat.contact.status]}.main`,
                        boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                        backgroundColor: `${statusObj[selectedChat.contact.status]}.main`
                      }}
                    />
                  }
                >
                  <CustomAvatar
                    skin='light'
                    color={isGeneral ? 'primary' : selectedChat.contact.avatarColor || 'info'}
                    sx={{ width: '4.5rem', height: '4.5rem', fontWeight: 500, fontSize: '1.75rem' }}
                  >
                    {isGeneral ? (
                      <Icon icon='tabler:sparkles' fontSize='2rem' />
                    ) : (
                      getInitials(selectedChat.contact.fullName)
                    )}
                  </CustomAvatar>
                </Badge>
              </Box>
              <Typography variant='h6' sx={{ textAlign: 'center' }}>
                {selectedChat.contact.fullName}
              </Typography>
              <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.85rem' }}>
                {selectedChat.contact.role}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ height: 'calc(100% - 13rem)' }}>
            <ScrollWrapper>
              <Box sx={{ p: 5 }}>
                {docMeta ? (
                  <Box>
                    <Typography variant='body2' sx={{ mb: 2, color: 'text.disabled', textTransform: 'uppercase' }}>
                      Metadatos del Documento
                    </Typography>
                    <List dense sx={{ p: 0 }}>
                      <ListItem sx={{ px: 1, py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Icon icon='tabler:file-invoice' fontSize='1.25rem' />
                        </ListItemIcon>
                        <ListItemText
                          primary='Tipo'
                          secondary={docMeta.documentType || 'No identificado'}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 1, py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Icon icon='tabler:building' fontSize='1.25rem' />
                        </ListItemIcon>
                        <ListItemText
                          primary='Emisor / Proveedor'
                          secondary={docMeta.extractedData?.issuer || 'No especificado'}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 1, py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Icon icon='tabler:currency-dollar' fontSize='1.25rem' />
                        </ListItemIcon>
                        <ListItemText
                          primary='Total'
                          secondary={docMeta.extractedData?.totalAmount ? `$${docMeta.extractedData.totalAmount}` : 'No detectado'}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 1, py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Icon icon='tabler:calendar' fontSize='1.25rem' />
                        </ListItemIcon>
                        <ListItemText
                          primary='Fecha'
                          secondary={docMeta.extractedData?.date || docMeta.createdAt?.slice(0, 10) || 'N/A'}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 1, py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Icon icon='tabler:file-type-pdf' fontSize='1.25rem' />
                        </ListItemIcon>
                        <ListItemText
                          primary='Tamaño de archivo'
                          secondary={formatBytes(docMeta.fileSizeBytes)}
                        />
                      </ListItem>
                    </List>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant='body2' sx={{ mb: 2, color: 'text.disabled', textTransform: 'uppercase' }}>
                      Contexto de la Consulta
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 3, color: 'text.secondary' }}>
                      El Asistente General analiza en tiempo real todos los documentos procesados por OCR de tu compañía.
                    </Typography>
                    <Chip
                      icon={<Icon icon='tabler:cpu' />}
                      label='Modelo: Gemini 2.5 Flash'
                      color='primary'
                      variant='outlined'
                      size='small'
                      sx={{ mb: 2, width: '100%', justifyContent: 'flex-start' }}
                    />
                    <Chip
                      icon={<Icon icon='tabler:shield-check' />}
                      label='Aislamiento estricto por compañía'
                      color='success'
                      variant='outlined'
                      size='small'
                      sx={{ mb: 2, width: '100%', justifyContent: 'flex-start' }}
                    />
                  </Box>
                )}
              </Box>
            </ScrollWrapper>
          </Box>
        </Fragment>
      ) : null}
    </Sidebar>
  )
}

export default UserProfileRight
