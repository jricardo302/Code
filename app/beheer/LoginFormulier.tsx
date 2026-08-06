"use client";

import { useActionState } from "react";

import { logIn, type LoginStatus } from "./actions";

const LEEG: LoginStatus = {};

export function LoginFormulier() {
  const [status, actie, bezig] = useActionState(logIn, LEEG);

  return (
    <form
      action={actie}
      className="rounded-3xl border border-paars-diep/10 bg-kraft/60 p-6 sm:p-8"
    >
      <label
        htmlFor="wachtwoord"
        className="mb-1.5 block font-semibold text-paars-diep"
      >
        Wachtwoord
      </label>
      <input
        id="wachtwoord"
        name="wachtwoord"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        aria-invalid={Boolean(status.fout)}
        aria-describedby={status.fout ? "wachtwoord-fout" : undefined}
        className="w-full rounded-xl border border-paars-diep/15 bg-creme/70 px-4 py-3 text-paars-diep transition-colors focus:border-paars focus:bg-creme aria-[invalid=true]:border-red-700/60"
      />

      <div aria-live="polite">
        {status.fout && (
          <p
            id="wachtwoord-fout"
            className="mt-2 text-sm font-medium text-red-800"
          >
            {status.fout}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={bezig}
        className="mt-5 w-full rounded-full bg-paars-diep px-8 py-3 font-semibold text-creme transition-colors hover:bg-paars disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {bezig ? "Even kijken…" : "Inloggen"}
      </button>
    </form>
  );
}
