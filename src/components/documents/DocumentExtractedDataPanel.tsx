import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Icon from 'src/@core/components/icon'
import { DocumentItem } from 'src/store/apps/documents'

interface DocumentExtractedDataPanelProps {
  document: DocumentItem
  onReprocess?: (doc: DocumentItem) => void
  reprocessing?: boolean
}

const ENGINE_LABELS: Record<string, string> = {
  gemini_vision: 'Gemini Multimodal OCR (Visión)',
  gemini_text: 'Gemini Texto Nativo',
  local_parser: 'Motor Heurístico Local'
}

const formatKeyLabel = (key: string) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim()

const MetadataFieldCard: React.FC<{ label: string; value?: string | number | null }> = ({
  label,
  value
}) => {
  if (value === null || value === undefined || value === '') return null

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Box sx={{ p: 2.5, borderRadius: 1.5, border: 1, borderColor: 'divider', height: '100%' }}>
        <Typography variant='caption' sx={{ color: 'text.disabled', fontWeight: 600 }}>
          {label.toUpperCase()}
        </Typography>
        <Typography variant='body2' sx={{ mt: 0.5, fontWeight: 600, wordBreak: 'break-word' }}>
          {String(value)}
        </Typography>
      </Box>
    </Grid>
  )
}

export const DocumentExtractedDataPanel: React.FC<DocumentExtractedDataPanelProps> = ({
  document: doc,
  onReprocess,
  reprocessing = false
}) => {
  if (doc.status === 'PENDING' || doc.status === 'PROCESSING') {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Icon icon='tabler:sparkles' fontSize={48} />
        <Typography variant='h6' sx={{ mt: 2 }}>
          Extracción Inteligente en Curso
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1, maxWidth: 460, mx: 'auto' }}>
          El documento está siendo analizado automáticamente. En unos instantes verás todos sus metadatos,
          entidades, ítems y texto indexado.
        </Typography>
      </Box>
    )
  }

  const attributes = doc.extractedData?.attributes || {}
  const attributeEntries = Object.entries(attributes).filter(
    ([, val]) => val !== null && val !== undefined && val !== ''
  )
  const items = Array.isArray(doc.extractedData?.items) ? doc.extractedData!.items! : []
  const itemColumns = items.length > 0 ? Object.keys(items[0]).slice(0, 6) : []
  const involvedParties = Array.isArray(doc.extractedData?.involvedParties)
    ? doc.extractedData!.involvedParties!
    : []
  const tags = Array.isArray(doc.tags) ? doc.tags : []

  const formattedTotal =
    doc.totalAmount !== null && doc.totalAmount !== undefined && doc.totalAmount !== ''
      ? `${doc.currency || '$'} ${Number(doc.totalAmount).toLocaleString('es-AR', {
          minimumFractionDigits: 2
        })}`
      : null

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {doc.errorMessage && (
        <Alert severity='error' sx={{ mb: 1 }}>
          {doc.errorMessage}
        </Alert>
      )}

      <Box
        sx={{
          p: 3,
          borderRadius: 1.5,
          backgroundColor: 'action.hover',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2
        }}
      >
        <Box sx={{ flex: 1, minWidth: 240 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
            {doc.documentType && (
              <Chip
                label={formatKeyLabel(doc.documentType)}
                color='primary'
                size='small'
                sx={{ fontWeight: 600 }}
              />
            )}
            {doc.extractionEngine && (
              <Chip
                label={ENGINE_LABELS[doc.extractionEngine] || doc.extractionEngine}
                variant='outlined'
                size='small'
              />
            )}
            {typeof doc.aiConfidence === 'number' && (
              <Chip
                label={`Confianza ${Math.round(doc.aiConfidence * 100)}%`}
                color={doc.aiConfidence >= 0.8 ? 'success' : 'warning'}
                variant='outlined'
                size='small'
              />
            )}
            {doc.pageCount ? (
              <Chip label={`${doc.pageCount} pág.`} variant='outlined' size='small' />
            ) : null}
          </Box>
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            {doc.summary || 'Documento procesado sin resumen descriptivo.'}
          </Typography>
        </Box>

        {onReprocess && (
          <Button
            size='small'
            variant='outlined'
            disabled={reprocessing}
            startIcon={<Icon icon='tabler:refresh' />}
            onClick={() => onReprocess(doc)}
          >
            {reprocessing ? 'Reprocesando...' : 'Reprocesar IA'}
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        <MetadataFieldCard label='N° / Código Documento' value={doc.documentNumber} />
        <MetadataFieldCard label='Fecha Documento' value={doc.documentDate} />
        <MetadataFieldCard label='Monto Total' value={formattedTotal} />
        <MetadataFieldCard label='Emisor / Proveedor / Origen' value={doc.issuerName} />
        <MetadataFieldCard label='CUIT / ID Fiscal Emisor' value={doc.issuerTaxId} />
        <MetadataFieldCard label='Destinatario / Cliente' value={doc.recipientName} />
        <MetadataFieldCard label='Persona Responsable / Firmante' value={doc.responsiblePerson} />
      </Grid>

      {attributeEntries.length > 0 && (
        <Box>
          <Typography variant='subtitle2' sx={{ mb: 1.5, fontWeight: 600 }}>
            Atributos Específicos Detectados
          </Typography>
          <Grid container spacing={2}>
            {attributeEntries.map(([key, val]) => (
              <MetadataFieldCard
                key={key}
                label={formatKeyLabel(key)}
                value={typeof val === 'boolean' ? (val ? 'Sí' : 'No') : String(val)}
              />
            ))}
          </Grid>
        </Box>
      )}

      {items.length > 0 && itemColumns.length > 0 && (
        <Box>
          <Typography variant='subtitle2' sx={{ mb: 1.5, fontWeight: 600 }}>
            Detalle / Ítems Extraídos ({items.length})
          </Typography>
          <TableContainer component={Paper} variant='outlined'>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  {itemColumns.map(colKey => (
                    <TableCell key={colKey} sx={{ fontWeight: 600 }}>
                      {formatKeyLabel(colKey)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={idx}>
                    {itemColumns.map(colKey => (
                      <TableCell key={colKey}>
                        {item[colKey] !== null && item[colKey] !== undefined ? String(item[colKey]) : '—'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {(involvedParties.length > 0 || tags.length > 0) && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {involvedParties.map((party, idx) => (
            <Chip
              key={`party-${idx}`}
              size='small'
              icon={<Icon icon='tabler:user' fontSize={14} />}
              label={`${formatKeyLabel(party.role)}: ${party.name}${party.identifier ? ` (${party.identifier})` : ''}`}
              variant='outlined'
            />
          ))}
          {tags.map(tag => (
            <Chip key={tag} size='small' label={`#${tag}`} color='secondary' variant='outlined' />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default DocumentExtractedDataPanel

