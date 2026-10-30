// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Services
import authService from 'src/services/auth.service'

// ** Config
import authConfig from 'src/configs/auth'

// ** Util Import
import getHomeRoute from 'src/layouts/components/acl/getHomeRoute'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        await authService.me()
          .then(async response => {
            setLoading(false)

            // Backend returns the user object directly
            setUser({ ...response })
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('user')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    authService.login({ username: params.username, password: params.password })
      .then(async response => {
        if (!params.rememberMe) {
          // Si no recuerda, podríamos borrar del local storage y manejar sesión
          // pero como authService guarda por defecto en localStorage, aquí lo mantenemos
        }
        const returnUrl = router.query.returnUrl

        setUser({ ...response.user })

        const homeRoute = getHomeRoute(response.user.role, response.user.permissions)
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : homeRoute

        router.replace(redirectURL as string)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    authService.logout()
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
