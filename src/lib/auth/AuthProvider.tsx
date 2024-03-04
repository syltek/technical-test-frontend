import { ReactNode } from 'react'
import { AuthInitializeConfig } from './types'

interface AuthProviderProps extends AuthInitializeConfig {  
  children?: ReactNode
}

/**
 * Allows initializing the auth state and exposing it to the component-tree below.
 */
function AuthProvider(props: AuthProviderProps): JSX.Element {
  const { tokens, onAuthChange, children } = props

  return (
    <>{children}</>
  )
}

export { AuthProvider, type AuthProviderProps }
