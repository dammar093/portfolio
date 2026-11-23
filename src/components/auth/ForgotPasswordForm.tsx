"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, KeyRound, LockKeyhole, Mail } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const [sent, setSent] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!sent || resetComplete) return;
    const interval = setInterval(() => setResendSeconds((remaining) => Math.max(0, remaining - 1)), 1000);
    return () => clearInterval(interval);
  }, [sent, resetComplete]);
  async function submit(event: FormEvent<HTMLFormElement>, endpoint: string, data: object, done?: () => void) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json(); setMessage(result.message || "Request failed"); if (response.ok) done?.();
    } catch { setMessage("Request failed. Please try again."); }
    finally { setBusy(false); }
  }
  async function resendCode() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/v1/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const result = await response.json();
      setMessage(result.message || "Request failed");
      if (response.ok) {
        setCode("");
        setResendSeconds(300);
      }
    } catch { setMessage("Could not send a new code. Please try again."); }
    finally { setBusy(false); }
  }
  return <div className="w-full max-w-lg px-4"><div className="rounded-2xl border border-border bg-card p-7 text-card-foreground shadow-xl sm:p-9">
    <div className="mb-6 text-center"><div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-xl font-bold text-white">OTP</div><h1 className="text-2xl font-bold">Reset your password</h1><p className="mt-2 text-sm text-muted-foreground">We’ll email a one time verification code.</p></div>
    {message && <p role="status" className="mb-4 rounded-md border border-border bg-muted p-3 text-sm text-foreground">{message}</p>}
    {resetComplete ? <div className="space-y-4 text-center"><p className="text-sm text-muted-foreground">Your password has been reset. You can now sign in with your new password.</p><Link href="/login" className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700">Go to sign in</Link></div> : !sent ? <form className="space-y-4" onSubmit={(event) => submit(event, "/api/v1/auth/forgot-password", { email }, () => { setSent(true); setResendSeconds(300); })}><label className="block space-y-2 text-sm font-medium text-foreground">Email address<div className="relative"><Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input className="h-11 border-border bg-background pl-11 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div></label><Button className="h-11 w-full rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={busy}>{busy ? "Sending code…" : "Send verification code"}</Button></form> : <form className="space-y-4" onSubmit={(event) => submit(event, "/api/v1/auth/forgot-password/verify", Object.fromEntries(new FormData(event.currentTarget)), () => setResetComplete(true))}>
    <input type="hidden" name="email" value={email} /><label className="block space-y-2 text-sm font-medium text-foreground">Six digit code<div className="relative"><KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input className="h-11 border-border bg-background pl-11 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} required /></div></label><label className="block space-y-2 text-sm font-medium text-foreground">New password<div className="relative"><LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input className="h-11 border-border bg-background pl-11 pr-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary" name="newPassword" type={showNewPassword ? "text" : "password"} minLength={8} autoComplete="new-password" required /><button type="button" onClick={() => setShowNewPassword((visible) => !visible)} aria-label={showNewPassword ? "Hide new password" : "Show new password"} aria-pressed={showNewPassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label><label className="block space-y-2 text-sm font-medium text-foreground">Confirm password<div className="relative"><LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input className="h-11 border-border bg-background pl-11 pr-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} minLength={8} autoComplete="new-password" required /><button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} aria-pressed={showConfirmPassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label><Button className="h-11 w-full rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={busy || code.length !== 6}>{busy ? "Resetting password…" : "Reset password"}</Button><Button type="button" variant="outline" className="w-full border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground" disabled={busy || resendSeconds > 0} onClick={resendCode}>{resendSeconds > 0 ? `Resend code in ${String(Math.floor(resendSeconds / 60)).padStart(2, "0")}:${String(resendSeconds % 60).padStart(2, "0")}` : "Send a new code"}</Button>
    </form>}
    <p className="mt-6 text-center text-sm"><Link href="/login" className="font-medium text-primary hover:underline">Back to sign in</Link></p>
  </div></div>;
}
