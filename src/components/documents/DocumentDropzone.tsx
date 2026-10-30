import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'

interface DocumentDropzoneProps {
  onUpload: (file: File) => Promise<void> | void
  isUploading?: boolean
  maxSizeMb?: number
  disabled?: boolean
}

export const DocumentDropzone: React.FC<DocumentDropzoneProps> = ({
  onUpload,
  isUploading = false,
  maxSizeMb = 25,
  disabled = false
}) => {
  const maxSizeBytes = maxSizeMb * 1024 * 1024

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        const error = fileRejections[0].errors[0]
        if (error.code === 'file-too-large') {
          toast.error(`El archivo supera el tamaño máximo permitido de ${maxSizeMb} MB`)
        } else if (error.code === 'file-invalid-type') {
          toast.error('Solo se permiten archivos en formato PDF')
        } else {
          toast.error(error.message || 'Error al procesar el archivo')
        }
        
return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        await onUpload(file)
      }
    },
    [onUpload, maxSizeMb]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: maxSizeBytes,
    multiple: false,
    disabled: disabled || isUploading
  })

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: theme => `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
        borderRadius: 2,
        p: 6,
        textAlign: 'center',
        cursor: disabled || isUploading ? 'not-allowed' : 'pointer',
        backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: disabled || isUploading ? 'inherit' : 'primary.main',
          backgroundColor: disabled || isUploading ? 'inherit' : 'action.hover'
        }
      }}
    >
      <input {...getInputProps()} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {isUploading ? (
          <>
            <CircularProgress size={44} />
            <Typography variant='body1' sx={{ fontWeight: 500 }}>
              Subiendo documento PDF...
            </Typography>
            <Typography variant='caption' sx={{ color: 'text.secondary' }}>
              Por favor espere mientras se almacena y calcula el hash de integridad
            </Typography>
          </>
        ) : (
          <>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'primary.light',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon icon={isDragActive ? 'tabler:file-download' : 'tabler:upload'} fontSize={32} />
            </Box>
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
              {isDragActive ? 'Suelte el archivo PDF aquí' : 'Arrastre un archivo PDF o haga clic para examinar'}
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Formato admitido: <strong>.PDF</strong> (Tamaño máximo: {maxSizeMb} MB)
            </Typography>
          </>
        )}
      </Box>
    </Box>
  )
}

export default DocumentDropzone
