import { Component, type ErrorInfo, type ReactNode } from 'react'

import ErrorPage from '../pages/ErrorPage'

interface Props {
  children: ReactNode
  /** Changing this (e.g. the current path) clears the error, so navigating away recovers. */
  resetKey?: string
}

interface State {
  error: unknown
}

/** Catches render errors below it and shows the ErrorPage instead of a blank screen. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: unknown): State {
    return { error }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('Page crashed:', error, info.componentStack)
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  render() {
    if (this.state.error) return <ErrorPage error={this.state.error} />
    return this.props.children
  }
}
