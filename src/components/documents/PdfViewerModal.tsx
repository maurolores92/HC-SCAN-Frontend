import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Icon from 'src/@core/components/icon'
import apiConnector from 'src/services/api.service'
import StatusChip from 'src/components/common/StatusChip'
import { DocumentItem } from 'src/store/apps/documents'
import toast from 'react-hot-toast'

interface PdfViewerModalProps {
  open: boolean
  document: DocumentItem | null
  onClose: () => void
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  open,
  document: doc,
  onClose
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>('pdf')

  useEffect(() => {
    let currentUrl: string | null = null

    if (open && doc?.id) {
      setLoading(true)
      setActiveTab('pdf')

      apiConnector
        .getFileBlob(`/documents/${doc.id}/file`)
        .then((blob: Blob) => {
          currentUrl = URL.createObjectURL(blob)
          setBlobUrl(currentUrl)
        })
        .catch(err => {
          console.error('Error fetching PDF stream:', err)
          toast.error('No se pudo cargar la vista previa del PDF')
        })
        .finally(() => {
          setLoading(false)
        })
    }

    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }
      setBlobUrl(null)
    }
  }, [open, doc?.id])

  const handleDownload = () => {
    if (!doc) return
    apiConnector.downloadFile(`/documents/${doc.id}/file`, doc.originalName)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='lg'
      PaperProps={{
        sx: { height: '85vh', display: 'flex', flexDirection: 'column' }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden' }}>
          <Icon icon='tabler:file-text' fontSize={28} />
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant='h6' noWrap sx={{ fontWeight: 600 }}>
              {doc?.originalName || 'Documento PDF'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              {doc && <StatusChip status={doc.status} />}
              {doc && <StatusChip status={doc.source} />}
              <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                Hash: {doc?.sha256Hash ? `${doc.sha256Hash.substring(0, 16)}...` : '-'}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            size='small'
            variant='outlined'
            startIcon={<Icon icon='tabler:download' />}
            onClick={handleDownload}
          >
            Descargar
          </Button>
          <IconButton size='small' onClick={onClose}>
            <Icon icon='tabler:x' />
          </IconButton>
        </Box>
      </DialogTitle>

      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 6 }}>
          <TabList onChange={(_, value) => setActiveTab(value)}>
            <Tab label='Visualizador PDF' value='pdf' icon={<Icon icon='tabler:eye' />} iconPosition='start' />
            <Tab
              label='Datos Extraídos IA'
              value='extracted'
              icon={<Icon icon='tabler:cpu' />}
              iconPosition='start'
            />
          </TabList>
        </Box>

        <DialogContent sx={{ p: 2, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <TabPanel value='pdf' sx={{ p: 0, flex: 1, height: '100%', display: 'flex' }}>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <CircularProgress />
              </Box>
            ) : blobUrl ? (
              <Box
                component='iframe'
                src={blobUrl}
                sx={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: 1
                }}
              />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Typography color='text.secondary'>No hay vista previa disponible</Typography>
              </Box>
            )}
          </TabPanel>

          <TabPanel value='extracted' sx={{ p: 3, flex: 1, overflow: 'auto' }}>
            {doc?.extractedData ? (
              <Box
                component='pre'
                sx={{
                  p: 3,
                  backgroundColor: 'action.hover',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  overflow: 'auto'
                }}
              >
                {JSON.stringify(doc.extractedData, null, 2)}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Icon icon='tabler:robot-off' fontSize={48} style={{ opacity: 0.5 }} />
                <Typography variant='h6' sx={{ mt: 2 }}>
                  Aún no se han extraído datos
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1 }}>
                  El documento se encuentra en estado <strong>{doc?.status}</strong>. Una vez procesado por la IA,
                  la información analizada estará disponible aquí.
                </Typography>
              </Box>
            )}
          </TabPanel>
        </DialogContent>
      </TabContext>

      <DialogActions sx={{ px: 4, py: 2 }}>
        <Button onClick={onClose} variant='contained'>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PdfViewerModal

