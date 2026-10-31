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
import toast from 'react-hot-toast'
import apiConnector from 'src/services/api.service'
import StatusChip from 'src/components/common/StatusChip'
import { DocumentItem } from 'src/store/apps/documents'
import DocumentExtractedDataPanel from './DocumentExtractedDataPanel'

interface PdfViewerModalProps {
  open: boolean
  document: DocumentItem | null
  onClose: () => void
  onReprocess?: (doc: DocumentItem) => void
  reprocessing?: boolean
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  open,
  document: doc,
  onClose,
  onReprocess,
  reprocessing = false
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loadingPdf, setLoadingPdf] = useState<boolean>(false)
  const [detailDoc, setDetailDoc] = useState<DocumentItem | null>(doc)
  const [activeTab, setActiveTab] = useState<string>('pdf')

  useEffect(() => {
    setDetailDoc(doc)
  }, [doc])

  useEffect(() => {
    let currentUrl: string | null = null

    if (open && doc?.id) {
      setLoadingPdf(true)
      setActiveTab('pdf')

      apiConnector
        .get<DocumentItem>(`/documents/${doc.id}`)
        .then(full => setDetailDoc(full))
        .catch(() => {})

      apiConnector
        .getFileBlob(`/documents/${doc.id}/file`)
        .then((blob: Blob) => {
          currentUrl = URL.createObjectURL(blob)
          setBlobUrl(currentUrl)
        })
        .catch(() => {
          toast.error('No se pudo cargar la vista previa del PDF')
        })
        .finally(() => {
          setLoadingPdf(false)
        })
    }

    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }
      setBlobUrl(null)
    }
  }, [open, doc?.id])

  const activeDoc = detailDoc || doc
  const hashValue = activeDoc?.fileHash || activeDoc?.sha256Hash

  const handleDownload = () => {
    if (!activeDoc) return
    apiConnector.downloadFile(`/documents/${activeDoc.id}/file`, activeDoc.originalName)
  }

  const handleCopyOcrText = async () => {
    if (!activeDoc?.rawText) return
    try {
      await navigator.clipboard.writeText(activeDoc.rawText)
      toast.success('Texto OCR copiado al portapapeles')
    } catch {
      toast.error('No se pudo copiar el texto')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='lg'
      PaperProps={{
        sx: { height: '86vh', display: 'flex', flexDirection: 'column' }
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
              {activeDoc?.originalName || 'Documento PDF'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
              {activeDoc && <StatusChip status={activeDoc.status} />}
              {activeDoc && <StatusChip status={activeDoc.source} />}
              <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                SHA-256: {hashValue ? `${hashValue.substring(0, 16)}...` : '—'}
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
            <Tab label='Ficha Inteligente IA' value='extracted' icon={<Icon icon='tabler:sparkles' />} iconPosition='start' />
            <Tab label='Texto Completo (OCR)' value='ocr' icon={<Icon icon='tabler:align-justified' />} iconPosition='start' />
          </TabList>
        </Box>

        <DialogContent sx={{ p: 2, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <TabPanel value='pdf' sx={{ p: 0, flex: 1, height: '100%', display: 'flex' }}>
            {loadingPdf ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <CircularProgress />
              </Box>
            ) : blobUrl ? (
              <Box
                component='iframe'
                src={blobUrl}
                sx={{ width: '100%', height: '100%', border: 'none', borderRadius: 1 }}
              />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Typography color='text.secondary'>No hay vista previa disponible</Typography>
              </Box>
            )}
          </TabPanel>

          <TabPanel value='extracted' sx={{ p: 3, flex: 1, overflow: 'auto' }}>
            {activeDoc && (
              <DocumentExtractedDataPanel
                document={activeDoc}
                onReprocess={onReprocess}
                reprocessing={reprocessing}
              />
            )}
          </TabPanel>

          <TabPanel value='ocr' sx={{ p: 3, flex: 1, overflow: 'auto' }}>
            {activeDoc?.rawText ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                    Texto íntegro indexado para búsqueda profunda ({activeDoc.rawText.length} caracteres)
                  </Typography>
                  <Button
                    size='small'
                    variant='outlined'
                    startIcon={<Icon icon='tabler:copy' />}
                    onClick={handleCopyOcrText}
                  >
                    Copiar Texto
                  </Button>
                </Box>
                <Box
                  component='pre'
                  sx={{
                    p: 3,
                    m: 0,
                    backgroundColor: 'action.hover',
                    borderRadius: 1.5,
                    fontFamily: 'monospace',
                    fontSize: '0.82rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {activeDoc.rawText}
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Icon icon='tabler:file-off' fontSize={44} />
                <Typography variant='body1' sx={{ mt: 2, color: 'text.secondary' }}>
                  No hay texto extraído disponible todavía para este archivo.
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
