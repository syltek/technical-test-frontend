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

  // You can remove these 2 logs; these are only here so the linter does not
  // complain about them being unused
  console.debug('>>', 'AuthProvider', 'tokens', tokens)
  console.debug('>>', 'AuthProvider', 'onAuthChange', onAuthChange)

  return (
    <>{children}</>
  )
}

export { AuthProvider, type AuthProviderProps }
