export default function Login() {
  // TODO(me): controlled form state, submit with api.post<TokenResponse>('/auth/login', ...),
  //           store the token with tokenStorage.set, show errors, navigate to /dashboard.
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-slate-900 text-white">
            J
          </span>
          <h1 className="text-xl font-semibold tracking-tight">Sign in to JobBear</h1>
        </div>

        <form className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
