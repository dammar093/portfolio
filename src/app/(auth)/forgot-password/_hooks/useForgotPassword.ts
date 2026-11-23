"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";
import { requestPasswordResetCode, verifyPasswordResetCode } from "../_redux/forgot-password-thunk";
import { requestPasswordResetSchema, verifyPasswordResetSchema } from "../_schema/forgot-password-schema";

export function useForgotPassword() {
  const dispatch = useAppDispatch();
  const { submitting, activeAction, error } = useAppSelector((state) => state.passwordReset);

  const requestCode = useCallback(async (input: unknown) => {
    try {
      return await dispatch(requestPasswordResetCode(requestPasswordResetSchema.parse(input))).unwrap();
    } catch (error) {
      if (error instanceof ZodError) toast.error(error.issues[0]?.message || "Enter a valid email address");
      return null;
    }
  }, [dispatch]);

  const resetPassword = useCallback(async (input: unknown) => {
    try {
      return await dispatch(verifyPasswordResetCode(verifyPasswordResetSchema.parse(input))).unwrap();
    } catch (error) {
      if (error instanceof ZodError) toast.error(error.issues[0]?.message || "Check the code and password fields");
      return null;
    }
  }, [dispatch]);

  return { submitting, activeAction, error, requestCode, resetPassword };
}
