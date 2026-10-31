import React, { useMemo } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Collapse from '@mui/material/Collapse'
import { DataGrid } from '@mui/x-data-grid'
import ConfirmActionDialog from 'src/components/common/ConfirmActionDialog'
import DocumentDropzone from 'src/components/documents/DocumentDropzone'
import PdfViewerModal from 'src/components/documents/PdfViewerModal'
import DocumentStatsHeader from './DocumentStatsHeader'
import DocumentFilterToolbar from './DocumentFilterToolbar'
import DocumentQuotaBanner from './DocumentQuotaBanner'
import { buildDocumentsColumns } from './DocumentsListColumns'
import { useDocumentsManager } from './hooks/useDocumentsManager'

export const DocumentsListView = () => {
  const {
    data,
    facets,
    total,
    loading,
    uploading,
    syncingFtp,
    reprocessingId,
    myQuota,
    searchInput,
    setSearchInput,
    documentType,
    setDocumentType,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    status,
    setStatus,
    source,
    setSource,
    page,
    setPage,
    pageSize,
    setPageSize,
    showUpload,
    setShowUpload,
    previewDoc,
    setPreviewDoc,
    docToDelete,
    setDocToDelete,
    isDeleting,
    hasActiveFilters,
    handleResetFilters,
    handleUpload,
    handleSyncFtp,
    handleReprocess,
    handleDeleteConfirm
  } = useDocumentsManager()

  const columns = useMemo(
    () =>
      buildDocumentsColumns({
        onPreview: doc => setPreviewDoc(doc),
        onReprocess: doc => handleReprocess(doc),
        onDelete: doc => setDocToDelete(doc),
        reprocessingId
      }),
    [handleReprocess, reprocessingId, setDocToDelete, setPreviewDoc]
  )

  return (
    <Box>
      <DocumentStatsHeader documents={data} total={total} />
      <DocumentQuotaBanner quota={myQuota} />

      <Card>
        <CardHeader
          title='Bóveda Inteligente de Documentos PDF'
          subheader='Detección automática en carpeta / SFTP, extracción OCR multimodal y búsqueda universal por cualquier dato'
        />

        <Collapse in={showUpload}>
          <Box sx={{ px: 4, pb: 4 }}>
            <DocumentDropzone onUpload={handleUpload} isUploading={uploading} />
          </Box>
        </Collapse>

        <DocumentFilterToolbar
          search={searchInput}
          onSearchChange={setSearchInput}
          documentType={documentType}
          onDocumentTypeChange={val => {
            setDocumentType(val)
            setPage(0)
          }}
          facets={facets}
          dateFrom={dateFrom}
          onDateFromChange={val => {
            setDateFrom(val)
            setPage(0)
          }}
          dateTo={dateTo}
          onDateToChange={val => {
            setDateTo(val)
            setPage(0)
          }}
          status={status}
          onStatusChange={val => {
            setStatus(val)
            setPage(0)
          }}
          source={source}
          onSourceChange={val => {
            setSource(val)
            setPage(0)
          }}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          onToggleUpload={() => setShowUpload(prev => !prev)}
          showUpload={showUpload}
          onSyncFtp={handleSyncFtp}
          isSyncing={syncingFtp}
        />

        <DataGrid
          autoHeight
          rowHeight={68}
          rows={data}
          rowCount={total}
          columns={columns}
          loading={loading}
          paginationMode='server'
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={model => {
            setPage(model.page)
            setPageSize(model.pageSize)
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
        />
      </Card>

      <PdfViewerModal
        open={Boolean(previewDoc)}
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onReprocess={handleReprocess}
        reprocessing={Boolean(previewDoc && reprocessingId === previewDoc.id)}
      />

      <ConfirmActionDialog
        open={Boolean(docToDelete)}
        title='¿Eliminar documento PDF?'
        content={`¿Estás seguro de que deseas eliminar permanentemente el documento "${docToDelete?.originalName}"? Esta acción borrará el archivo físico de la bóveda y liberará espacio en su plan.`}
        confirmText='Sí, eliminar'
        cancelText='Cancelar'
        color='error'
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDocToDelete(null)}
      />
    </Box>
  )
}

export default DocumentsListView
