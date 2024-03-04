import React, { ComponentProps, ReactNode, useCallback, useMemo } from 'react'
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/auth'
import { ApiConfigProvider } from '@/lib/api'

const Login = React.lazy(() => import('./views/Login'))
const Matches = React.lazy(() => import('./views/Matches'))

function AppRouter() {
  const auth = useAuth()

  if (auth.currentUser === undefined) {
    return <div>Loading authorization...</div>
  }

  return (
    <Router>
      <Switch>
        <Route
          path="/login"
          render={() =>
            auth.currentUser
              ? <Redirect to="/matches" />
              : <Login initialValues={{ email: 'alice@playtomic.io' }}/>
          }
        />
      
        <Route
          path="/matches"
          render={() => (
            auth.currentUser
              ? <Matches
                  onLogoutRequest={() => {
                    auth.logout().catch(error => {
                      console.error('error while logging out', error)
                    })
                  }}
                />
              : <Redirect to="/login" />
          )}
        />

        <Route
          render={() =>
            auth.currentUser
              ? <Redirect to="/matches" />
              : <Redirect to="/login" />
          }
        />
      </Switch>
    </Router>
  )
}

function ApiAuthConfigProvider(props: { children: ReactNode }) {
  const auth = useAuth()

  const defaultHeaders = useMemo(() =>  {
    const headers = new Headers({
      'x-requested-with': 'playtomic-frontend-tech-task'
    })

    if (auth.tokens) {
      headers.append('authorization', `Bearer ${auth.tokens.access}`)
    }

    return headers
  }, [auth.tokens])

  return (
    <ApiConfigProvider defaultHeaders={defaultHeaders}>
      {props.children}
    </ApiConfigProvider>
  )
}

function AppAuthProvider(props: { children: ReactNode }) {
  type AuthProviderProps = ComponentProps<typeof AuthProvider>
  const initialTokens = useMemo<AuthProviderProps['tokens']>(() => {
    try {
      const authRaw = localStorage.getItem('my-app:auth')
      return authRaw
        ? JSON.parse(authRaw) as AuthProviderProps['tokens']
        : null
    } catch {
      return null
    }
  }, [])
  const handleAuthRefresh = useCallback<NonNullable<AuthProviderProps['onAuthChange']>>(
    (auth) => {
      if (auth) {
        localStorage.setItem('my-app:auth', JSON.stringify(auth))
      } else {
        localStorage.removeItem('my-app:auth')
      }
    },
    [],
  )

  return (
    <AuthProvider tokens={initialTokens} onAuthChange={handleAuthRefresh}>
      {props.children}
    </AuthProvider>
  )
}

function App() {
  return (
    <ApiConfigProvider baseURL="/api">
      <AppAuthProvider>
        <ApiAuthConfigProvider>
          <React.Suspense fallback={<div>Loading...</div>}>
            <AppRouter />
          </React.Suspense>
        </ApiAuthConfigProvider>
      </AppAuthProvider>
    </ApiConfigProvider>
  )
}

export default App
