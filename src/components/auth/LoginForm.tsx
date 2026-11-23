"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ShieldCheck,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schema/auth-schema";
import ErroMessage from "./ErrorMessage";
import { Loader } from "@/components/shared/Loader";
import useAuth from "@/hooks/useAuth";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "This email is already associated with another sign-in provider."
      : "";

  const { loginUser, isLoading, error } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="flex h-dvh w-full items-center justify-center overflow-hidden px-4 py-3 sm:py-4">
      <div className="relative w-full max-w-lg">
        <div className="h-full rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:p-7">
          {/* Header */}
          <div className="mb-1 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25 sm:h-14 sm:w-14">
              <ShieldCheck size={30} />
            </div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              ADMINISTRATOR PORTAL
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back!
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to access your administration dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(loginUser)}>
            <FieldGroup className="gap-2">
              <ErroMessage message={error || urlError} />

              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="email"
                      className="font-semibold text-foreground"
                    >
                      Email Address
                      <span className="text-red-500">*</span>
                    </FieldLabel>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        disabled={isLoading}
                        autoComplete="username"
                        aria-invalid={fieldState.invalid}
                        className="h-11 border-border bg-background pl-11 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                      />
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="password"
                      className="font-semibold text-foreground"
                    >
                      Password
                      <span className="text-red-500">*</span>
                    </FieldLabel>

                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        disabled={isLoading}
                        autoComplete="current-password"
                        aria-invalid={fieldState.invalid}
                        className="h-11 border-border bg-background pl-11 pr-11 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="mt-2 h-11 w-full bg-blue-600 font-semibold text-white hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign in to dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>

          <div className="mt-2 text-right text-sm">
            <a href="/forgot-password" className="font-medium text-primary hover:underline">Forgot password?</a>
          </div>

          {/* Security notice */}
          <div className="mt-4 border-t border-border pt-3">
            <div className="flex items-center justify-center gap-2 text-center">
              <ShieldCheck size={17} className="shrink-0 text-green-600 dark:text-green-400" />

              <p className="text-xs text-muted-foreground">
                Restricted access. Authorized administrators only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
