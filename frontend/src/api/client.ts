// Typed fetch wrapper: base URL, JSON encoding, bearer token, and error normalisation.

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000'
const TOKEN_KEY = 'jobbear.token'

export class ApiError extends Error {
  readonly status: number
  readonly detail: unknown

  constructor(status: number, detail: unknown) {
    super(typeof detail === 'string' ? detail : `Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY)
  },
}

type Query = Record<string, string | number | boolean | (string | number)[] | null | undefined>

interface RequestOptions {
  body?: unknown
  query?: Query
  signal?: AbortSignal
}

function buildUrl(path: string, query?: Query): string {
  const url = new URL(path, API_URL)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) value.forEach((v) => url.searchParams.append(key, String(v)))
    else url.searchParams.set(key, String(value))
  }
  return url.toString()
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  const token = tokenStorage.get()
  if (token) headers.Authorization = `Bearer ${token}`
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'

  const response = await fetch(buildUrl(path, options.query), {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  })

  if (response.status === 401) tokenStorage.clear()

  if (!response.ok) {
    let detail: unknown = response.statusText
    try {
      const data = (await response.json()) as { detail?: unknown }
      detail = data.detail ?? data
    } catch {
      // Non-JSON error body; keep statusText.
    }
    throw new ApiError(response.status, detail)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('POST', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('PATCH', path, { ...options, body }),
  delete: <T = void>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('DELETE', path, options),
}
