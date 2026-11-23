"use client";

import { FormEvent, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useProfileSettings } from "@/app/admin/profile/_hooks/useProfileSettings";

function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [visible, setVisible] = useState(false);
  return <div className="relative">
    <Input {...props} type={visible ? "text" : "password"} className={`pr-10 ${props.className ?? ""}`} />
    <button
      type="button"
      onClick={() => setVisible((current) => !current)}
      aria-label={visible ? "Hide password" : "Show password"}
      aria-pressed={visible}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>;
}

export function AccountSettings({ name: initialName, email }: { name: string; email: string }) {
  const [name, setName] = useState(initialName);
  const [newEmail, setNewEmail] = useState("");
  const [code, setCode] = useState("");
  const [emailPending, setEmailPending] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const { submitting, requestEmailChange, updateProfile, verifyEmailChange, changePassword } = useProfileSettings();

  useEffect(() => setName(initialName), [initialName]);

  useEffect(() => {
    if (!emailPending) return;
    const interval = setInterval(() => setResendSeconds((remaining) => Math.max(0, remaining - 1)), 1000);
    return () => clearInterval(interval);
  }, [emailPending]);

  async function runAction(action: () => Promise<unknown>) {
    try {
      await action();
      return true;
    } catch (error) {
      if (error instanceof ZodError) toast.error(error.issues[0]?.message || "Check the form fields");
      return false;
    }
  }

  async function resendEmailCode() {
    const sent = await runAction(() => requestEmailChange({ newEmail }));
    if (sent) {
      setCode("");
      setResendSeconds(300);
    }
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runAction(() => updateProfile({ name }));
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const sent = await runAction(() => requestEmailChange({ newEmail }));
    if (sent) {
      setEmailPending(true);
      setResendSeconds(300);
      setCode("");
    }
  }

  async function handleVerifySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const verified = await runAction(() => verifyEmailChange({ code }));
    if (verified) {
      setCode("");
      setNewEmail("");
      setEmailPending(false);
      setResendSeconds(0);
      await signOut({ callbackUrl: "/login" });
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (await runAction(() => changePassword(data))) form.reset();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold">Account settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your profile and sign-in details.
        </p>
      </div>
      <section className="space-y-4 rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold">Profile details</h2>
        <form
          className="space-y-3"
          onSubmit={handleProfileSubmit}
        >
          <label className="block space-y-1 text-sm">
            Display name
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              maxLength={80}
              required
            />
          </label>
          <Button disabled={submitting}>Save name</Button>
        </form>
        <div className="space-y-1 text-sm">
          <p className="font-medium">Current email</p>
          <p className="text-muted-foreground">{email}</p>
        </div>
        {!emailPending ? (
          <form
            className="space-y-3"
            onSubmit={handleEmailSubmit}
          >
            <label className="block space-y-1 text-sm">
              New email address
              <Input
                type="email"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                required
              />
            </label>
            <Button variant="outline" disabled={submitting}>
              Send verification code
            </Button>
          </form>
        ) : (
          <form
            className="space-y-3"
            onSubmit={handleVerifySubmit}
          >
            <p className="text-sm text-muted-foreground">
              Enter the six digit code sent to {newEmail}.
            </p>
            <label className="block space-y-1 text-sm">
              Verification code
              <Input
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, ""))
                }
                required
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <Button disabled={submitting || code.length !== 6}>
                Verify and update email
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                disabled={submitting || resendSeconds > 0}
                onClick={resendEmailCode}
              >
                {resendSeconds > 0
                  ? `Resend code in ${String(Math.floor(resendSeconds / 60)).padStart(2, "0")}:${String(resendSeconds % 60).padStart(2, "0")}`
                  : "Send a new code"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEmailPending(false);
                  setCode("");
                }}
              >
                Use a different email
              </Button>
            </div>
          </form>
        )}
      </section>
      <section className="space-y-4 rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold">Change password</h2>
        <form
          className="space-y-3"
          onSubmit={handlePasswordSubmit}
        >
          <label className="block space-y-1 text-sm">
            Current password
            <PasswordInput
              name="currentPassword"
              autoComplete="current-password"
              required
            />
          </label>
          <label className="block space-y-1 text-sm">
            New password
            <PasswordInput
              name="newPassword"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <label className="block space-y-1 text-sm">
            Confirm new password
            <PasswordInput
              name="confirmPassword"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <Button className="font-semibold" disabled={submitting} variant={"default"}>
            Update password
          </Button>
        </form>
      </section>
    </div>
  );
}
