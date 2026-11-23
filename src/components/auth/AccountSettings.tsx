"use client";

import { FormEvent, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

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
  const [emailMessage, setEmailMessage] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!emailPending) return;
    const interval = setInterval(() => setResendSeconds((remaining) => Math.max(0, remaining - 1)), 1000);
    return () => clearInterval(interval);
  }, [emailPending]);

  async function resendEmailCode() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/v1/auth/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail }),
      });
      const result = await response.json();
      setMessage(result.message || "Request failed");
      if (response.ok) {
        setCode("");
        setResendSeconds(300);
        toast.success(result.message || "Verification code sent");
      } else {
        toast.error(result.message || "Could not send a new code");
      }
    } catch {
      setMessage("Could not send a new code. Please try again.");
      toast.error("Could not send a new code. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function submit(
    event: FormEvent,
    url: string,
    method: string,
    data: object,
    onSuccess?: (form: HTMLFormElement) => void | Promise<void>,
  ) {
    const form = event.currentTarget as HTMLFormElement;
    event.preventDefault();
    setBusy(true);
    setMessage("");
    if (url === "/api/v1/auth/change-email") setEmailMessage("");
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage("");
        toast.success(result.message || "Updated successfully");
        await onSuccess?.(form);
      } else {
        setMessage(result.message || "Request failed");
        if (url === "/api/v1/auth/change-email")
          setEmailMessage(result.message || "Could not update email");
        toast.error(result.message || "Request failed");
      }
    } catch {
      setMessage("Request failed. Please try again.");
      toast.error("Request failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold">Account settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your profile and sign-in details.
        </p>
      </div>
      {message && (
        <p role="status" className="rounded-md border bg-muted p-3 text-sm">
          {message}
        </p>
      )}
      <section className="space-y-4 rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold">Profile details</h2>
        <form
          className="space-y-3"
          onSubmit={(event) =>
            submit(event, "/api/v1/auth/profile", "PATCH", { name })
          }
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
          <Button disabled={busy}>Save name</Button>
        </form>
        <div className="space-y-1 text-sm">
          <p className="font-medium">Current email</p>
          <p className="text-muted-foreground">{email}</p>
        </div>
        {!emailPending ? (
          <form
            className="space-y-3"
            onSubmit={(event) =>
              submit(
                event,
                "/api/v1/auth/change-email",
                "POST",
                { newEmail },
                () => {
                  setEmailPending(true);
                  setResendSeconds(300);
                },
              )
            }
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
            {emailMessage && (
              <p role="alert" className="text-sm text-destructive">
                {emailMessage}
              </p>
            )}
            <Button variant="outline" disabled={busy}>
              Send verification code
            </Button>
          </form>
        ) : (
          <form
            className="space-y-3"
            onSubmit={(event) =>
              submit(
                event,
                "/api/v1/auth/change-email/verify",
                "POST",
                { code },
                async () => {
                  setCode("");
                  setNewEmail("");
                  setEmailPending(false);
                  setResendSeconds(0);
                  await signOut({ callbackUrl: "/login" });
                },
              )
            }
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
              <Button disabled={busy || code.length !== 6}>
                Verify and update email
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                disabled={busy || resendSeconds > 0}
                onClick={resendEmailCode}
              >
                {resendSeconds > 0
                  ? `Resend code in ${String(Math.floor(resendSeconds / 60)).padStart(2, "0")}:${String(resendSeconds % 60).padStart(2, "0")}`
                  : "Send a new code"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEmailPending(false)}
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
          onSubmit={(event) =>
            submit(
              event,
              "/api/v1/auth/change-password",
              "PATCH",
              Object.fromEntries(new FormData(event.currentTarget)),
              (form) => form.reset(),
            )
          }
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
          <Button className="font-semibold" disabled={busy} variant={"default"}>
            Update password
          </Button>
        </form>
      </section>
    </div>
  );
}
