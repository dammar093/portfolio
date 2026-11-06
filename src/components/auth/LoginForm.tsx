"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();

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
    <div className="h-dvh flex items-center justify-center px-4 py-10 w-full ">
      {/* Background decoration */}
  
      <div className="relative w-full max-w-lg">
        {/* Login card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9 h-full">
          {/* Header */}
          <div className="mb-2 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
              <ShieldCheck size={34} />
            </div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              ADMINISTRATOR PORTAL
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back!
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to access your administration dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(loginUser)}>
            <FieldGroup className="gap-3">
              <ErroMessage message={error || urlError} />

              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="email"
                      className="font-semibold text-slate-700"
                    >
                      Email Address
                      <span className="text-red-500">*</span>
                    </FieldLabel>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        disabled={isLoading}
                        autoComplete="username"
                        aria-invalid={fieldState.invalid}
                        className="h-12 pl-11 border-slate-200 focus-visible:ring-blue-500"
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
                      className="font-semibold text-slate-700"
                    >
                      Password
                      <span className="text-red-500">*</span>
                    </FieldLabel>

                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        disabled={isLoading}
                        autoComplete="current-password"
                        aria-invalid={fieldState.invalid}
                        className="h-12 pl-11 pr-11 border-slate-200 focus-visible:ring-blue-500"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
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

              {/* Forgot password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="h-12 w-full bg-blue-600 font-semibold text-white hover:bg-blue-700"
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

          {/* Security notice */}
          <div className="mt-7 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-center gap-2 text-center">
              <ShieldCheck size={17} className="shrink-0 text-green-600" />
              <p className="text-xs text-slate-500">
                Restricted access. Authorized administrators only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
