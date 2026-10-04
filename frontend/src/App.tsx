import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import ApplicationDetail from './pages/ApplicationDetail'
import Applications from './pages/Applications'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
})

export default function App() {
  // TODO(me): add a route guard that redirects to /login when there is no token.
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/applications/:id" element={<ApplicationDetail />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
