import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import ApplicationDetail from './pages/ApplicationDetail'
import Applications from './pages/Applications'
import Dashboard from './pages/Dashboard'
import Inbox from './pages/Inbox'
import Landing from './pages/Landing'
import Login from './pages/Login'
import NewApplication from './pages/NewApplication'
import Settings from './pages/Settings'

// Dev-only page; lazy so it never ships in the production bundle.
const Styleguide = import.meta.env.DEV ? lazy(() => import('./dev/Styleguide')) : null

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
          <Route index element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/applications/new" element={<NewApplication />} />
            <Route path="/applications/:id" element={<ApplicationDetail />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/settings" element={<Settings />} />
            {Styleguide && (
              <Route
                path="/styleguide"
                element={
                  <Suspense fallback={null}>
                    <Styleguide />
                  </Suspense>
                }
              />
            )}
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
