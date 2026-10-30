// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** API & Toast
import apiConnector from 'src/services/api.service'
import toast from 'react-hot-toast'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const buffer = new ArrayBuffer(rawData.length)
  const outputArray = new Uint8Array(buffer)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

async function getSWRegistration(timeoutMs = 2500): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null
  }

  try {
    // 1. Si ya existe un registro de Service Worker
    const existing = await navigator.serviceWorker.getRegistration()
    if (existing && existing.active) {
      return existing
    }

    // 2. Si no existe, intentar registrarlo
    const registered = await navigator.serviceWorker.register('/sw.js').catch(err => {
      console.warn('[useWebPush] Error al registrar sw.js:', err)

      return null
    })

    if (registered) {
      return registered
    }

    // 3. Esperar con timeout seguro para no bloquear la UI
    const readyPromise = navigator.serviceWorker.ready
    const timeoutPromise = new Promise<null>(resolve => setTimeout(() => resolve(null), timeoutMs))

    const readyReg = await Promise.race([readyPromise, timeoutPromise])

    return readyReg || existing || null
  } catch (err) {
    console.warn('[useWebPush] getSWRegistration catch:', err)

    return null
  }
}

export const useWebPush = () => {
  const [isSupported, setIsSupported] = useState<boolean>(true)
  const [isInsecureContext, setIsInsecureContext] = useState<boolean>(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [testing, setTesting] = useState<boolean>(false)

  // PWA State
  const [isPwaInstalled, setIsPwaInstalled] = useState<boolean>(false)
  const [canInstallPwa, setCanInstallPwa] = useState<boolean>(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  // 1. Detección inicial de soporte y estado de suscripción
  const checkStatus = useCallback(async () => {
    if (typeof window === 'undefined') return

    // Comprobar si el contexto es seguro (requerido por Web Push en navegadores móviles)
    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '[::1]'
    const isSecure = window.isSecureContext || isLocal

    setIsInsecureContext(!isSecure)

    const supported =
      isSecure &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window

    setIsSupported(supported)

    // Detectar si la PWA ya está instalada en modo standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true
    setIsPwaInstalled(isStandalone)

    if (!supported) {
      setLoading(false)

      return
    }

    const currentPermission = Notification.permission
    setPermission(currentPermission)

    // Si el usuario no ha otorgado permiso ('default' o 'denied'), sabemos que no está suscrito
    if (currentPermission !== 'granted') {
      setIsSubscribed(false)
      setLoading(false)

      return
    }

    try {
      const reg = await getSWRegistration(2000)
      if (reg && 'pushManager' in reg) {
        const subscription = await reg.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
      } else {
        setIsSubscribed(false)
      }
    } catch (err) {
      console.warn('[useWebPush] Error al comprobar suscripción push:', err)
      setIsSubscribed(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkStatus()

    // Listener para instalación nativa de PWA (Android / Chrome / Edge)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstallPwa(true)
    }

    const handleAppInstalled = () => {
      setIsPwaInstalled(true)
      setCanInstallPwa(false)
      setDeferredPrompt(null)
      toast.success('🎉 HelpCopies ERP instalado exitosamente en tu dispositivo')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [checkStatus])

  // 2. Activar Notificaciones Push (Suscribir)
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      if (isInsecureContext) {
        toast.error('Las notificaciones push requieren HTTPS o un túnel seguro')
      } else {
        toast.error('Este navegador no soporta Notificaciones Web Push')
      }

      return false
    }

    setLoading(true)
    try {
      // Solicitar permiso nativo al usuario
      const requestedPermission = await Notification.requestPermission()
      setPermission(requestedPermission)

      if (requestedPermission !== 'granted') {
        toast.error('Permiso de notificaciones denegado en el navegador')

        return false
      }

      // Obtener clave pública VAPID desde el backend
      const res: any = await apiConnector.get('/notifications/push/public-key')
      const publicKey = res?.publicKey
      if (!publicKey) {
        throw new Error('No se pudo obtener la clave VAPID pública del servidor')
      }

      const registration = await getSWRegistration(5000)
      if (!registration || !('pushManager' in registration)) {
        throw new Error('El Service Worker no está listo en este navegador')
      }

      // Suscribir en el PushManager del navegador
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as BufferSource
      })

      const subscriptionJson = subscription.toJSON()

      // Registrar suscripción en la base de datos de HelpCopies ERP
      await apiConnector.post('/notifications/push/subscribe', {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscriptionJson.keys?.p256dh || '',
          auth: subscriptionJson.keys?.auth || ''
        },
        userAgent: navigator.userAgent
      })

      setIsSubscribed(true)
      toast.success('🔔 Notificaciones push activadas correctamente en este dispositivo')

      return true
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al activar notificaciones push'
      toast.error(msg)

      return false
    } finally {
      setLoading(false)
    }
  }, [isSupported, isInsecureContext])

  // 3. Desactivar Notificaciones Push (Desuscribir)
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false

    setLoading(true)
    try {
      const registration = await getSWRegistration(3000)

      if (registration && 'pushManager' in registration) {
        const subscription = await registration.pushManager.getSubscription()

        if (subscription) {
          const endpoint = subscription.endpoint

          // Desuscribir en el navegador
          await subscription.unsubscribe()

          // Eliminar del backend
          await apiConnector.post('/notifications/push/unsubscribe', {
            endpoint
          })
        }
      }

      setIsSubscribed(false)
      toast.success('🔕 Notificaciones push desactivadas en este dispositivo')

      return true
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al desactivar notificaciones'
      toast.error(msg)

      return false
    } finally {
      setLoading(false)
    }
  }, [isSupported])

  // 4. Enviar Notificación Push de Prueba
  const sendTestPush = useCallback(async () => {
    setTesting(true)
    try {
      const res: any = await apiConnector.post('/notifications/push/test', {})
      if (res?.success || res?.deliveredCount > 0) {
        toast.success('🚀 Notificación de prueba enviada. La recibirás en instantes.')
      } else {
        toast('Alerta de prueba enviada (verifica si tu navegador la muestra)', { icon: '🔔' })
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al enviar notificación de prueba')
    } finally {
      setTesting(false)
    }
  }, [])

  // 5. Instalar Aplicación PWA
  const installPwa = useCallback(async () => {
    if (!deferredPrompt) {
      toast('Para instalar en iPhone: toca "Compartir" y luego "Agregar a pantalla de inicio"', {
        icon: '📲',
        duration: 6000
      })

      return
    }

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsPwaInstalled(true)
        setCanInstallPwa(false)
        setDeferredPrompt(null)
      }
    } catch (err) {
      console.warn('[PWA] Error prompt:', err)
    }
  }, [deferredPrompt])

  return {
    isSupported,
    isInsecureContext,
    permission,
    isSubscribed,
    loading,
    testing,
    isPwaInstalled,
    canInstallPwa,
    subscribe,
    unsubscribe,
    sendTestPush,
    installPwa
  }
}

export default useWebPush
