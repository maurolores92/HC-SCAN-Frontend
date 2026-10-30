// ** React Imports
import React, { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Slide from '@mui/material/Slide'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

export const OfflineDetector = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [showRestored, setShowRestored] = useState<boolean>(false)

  useEffect(() => {
    // Establecer estado inicial
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
    }

    const handleOnline = () => {
      setIsOnline(true)
      setShowRestored(true)
      const timer = setTimeout(() => {
        setShowRestored(false)
      }, 3500)

      return () => clearTimeout(timer)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowRestored(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Si está online y no hay aviso de conexión restablecida, no renderizar nada
  if (isOnline && !showRestored) return null

  return (
    <Slide direction='down' in={!isOnline || showRestored} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 99999,
          px: 4,
          py: 2,
          pt: 'calc(env(safe-area-inset-top, 0px) + 8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          backgroundColor: isOnline ? '#2e7d32' : '#d32f2f',
          color: '#ffffff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Icon
          icon={isOnline ? 'tabler:wifi' : 'tabler:wifi-off'}
          fontSize={22}
          style={{ flexShrink: 0 }}
        />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='subtitle2' sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>
            {isOnline ? 'Conexión a internet restablecida' : 'Sin conexión a internet'}
          </Typography>
          {!isOnline && (
            <Typography variant='caption' sx={{ color: 'rgba(255,255,255,0.85)', display: 'block' }}>
              Se requiere conexión activa para operar en HelpCopies ERP
            </Typography>
          )}
        </Box>
      </Box>
    </Slide>
  )
}

export default OfflineDetector
