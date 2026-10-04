import { Link } from 'react-router-dom'

import BearMark from '../components/BearMark'

export default function Login() {
  // TODO(me): controlled form state, submit with api.post<TokenResponse>('/auth/login', ...),
  //           store the token with tokenStorage.set, show errors, navigate to /dashboard.
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden overflow-hidden bg-bark p-12 text-birch-50 lg:flex lg:flex-col lg:justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 self-start rounded-control font-display text-xl font-bold"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-birch">
            <BearMark size={34} />
          </span>
          JobBear
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight">
            Find out which applications actually work.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-birch-300">
            JobBear reads recruiter emails, keeps every status change on record, and shows you which
            channels get replies.
          </p>
        </div>

        <BearMark
          size={520}
          className="pointer-events-none absolute -bottom-40 -right-36 opacity-[0.08] [&_.fill-bark]:fill-birch [&_.fill-honey]:fill-honey"
        />
      </div>

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <BearMark size={48} title="JobBear" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Sign in</h1>
          <p className="mt-1.5 text-bark-500">Welcome back to your den.</p>

          <form className="mt-8 space-y-5">
            <label className="block">
              <span className="label">Email</span>
              <input type="email" name="email" autoComplete="email" className="field mt-1.5" />
            </label>
            <label className="block">
              <span className="label">Password</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                className="field mt-1.5"
              />
            </label>
            {/* TODO(me): error message here: <p role="alert" className="text-sm text-berry">…</p> */}
            <button type="submit" className="btn-primary w-full py-2.5">
              Sign in
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
