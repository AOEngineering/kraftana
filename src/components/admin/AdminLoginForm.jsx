"use client"

import { useActionState } from "react"

import { loginAction } from "@/app/admin/actions"

const initialState = { error: "" }

export default function AdminLoginForm({ nextPath = "/admin/start" }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="mt-6 grid gap-4">
      <input type="hidden" name="next" value={nextPath} />
      <label className="grid gap-2 text-sm">
        <span>Username</span>
        <input
          name="username"
          className="admin-input"
          required
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span>Password</span>
        <input
          name="password"
          type="password"
          className="admin-input"
          required
        />
      </label>
      {state?.error ? <p className="text-sm text-[color:var(--destructive)]">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b7776d,#915a51)] px-5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  )
}
