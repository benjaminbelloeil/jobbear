import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'

import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import PageLoader from './components/PageLoader'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'

// The landing page loads eagerly (it's the front door); app pages load on demand behind
// the bear loader, which keeps the first download small.
const ApplicationDetail = lazy(() => import('./pages/ApplicationDetail'))
const Applications = lazy(() => import('./pages/Applications'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Inbox = lazy(() => import('./pages/Inbox'))
const Login = lazy(() => import('./pages/Login'))
const NewApplication = lazy(() => import('./pages/NewApplication'))
const Settings = lazy(() => import('./pages/Settings'))

// Dev-only pages; lazy so they never ship in the production bundle.
const Styleguide = import.meta.env.DEV ? lazy(() => import('./dev/Styleguide')) : null

/** Dev-only: throws on render, to preview the error page at /__error. */
function Crash(): never {
  throw new Error('This is a test crash from the /__error route.')
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
})

function AppRoutes() {
  const { pathname } = useLocation()

  // TODO(me): add a route guard that redirects to /login when there is no token.
  return (
    <ErrorBoundary resetKey={pathname}>
      <Suspense fallback={<PageLoader />}>
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
            {Styleguide && <Route path="/styleguide" element={<Styleguide />} />}
          </Route>
          {import.meta.env.DEV && <Route path="/__error" element={<Crash />} />}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
