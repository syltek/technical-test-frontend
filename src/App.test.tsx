import { render, screen } from '@testing-library/react'
import { server } from '@/lib/msw/node'
import userEvent from '@testing-library/user-event'
import App from './App'

beforeAll(() => { server.listen() })
afterEach(() => { server.resetHandlers() })
afterAll(() => { server.close() })

describe('anonymous user', () => {
  test('renders a login form', async () => {
    render(<App />)
    const form = await screen.findByRole('form', { name: 'Log in'})
    expect(form).toBeInTheDocument()
  })
})


describe('authenticated user', () => {
  beforeEach(() => {
    localStorage.setItem('my-app:auth', JSON.stringify({
      access: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDkyOTA0NzIsImV4cCI6NDg2Mjg5MDQ3MiwianRpIjoiYzFjMGVjNTMtMzc1Ny00Y2FjLTk5YTMtZjk3NDAwMTA5ZTFkIiwic3ViIjoiYzBlZDM2YzAtNmM1OS00OGQ0LWExNjgtYjYwNzZjZWM1MmEwIiwidHlwZSI6ImFjY2VzcyJ9.InRoaXMtaXMtbm90LWEtcmVhbC1zaWduYXR1cmUi',
    }))
  })

  test('renders a matches table', async () => {  
    render(<App />)
    const matches = await screen.findByRole('table', { name: 'Matches' })
    expect(matches).toBeInTheDocument()
  })

  test('can logout', async () => {
    render(<App />)
    const logoutButton = await screen.findByRole('button', { name: 'Logout' })
    await userEvent.click(logoutButton)
  
    const form = await screen.findByRole('form', { name: 'Log in'})
    expect(form).toBeInTheDocument()
  })
})
