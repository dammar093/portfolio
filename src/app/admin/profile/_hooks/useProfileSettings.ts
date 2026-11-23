"use client";

import { useCallback } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";
import {
  changePassword as changePasswordThunk,
  requestEmailChange as requestEmailChangeThunk,
  updateProfile as updateProfileThunk,
  verifyEmailChange as verifyEmailChangeThunk,
} from "../_redux/profile-thunk";
import {
  changePasswordSchema,
  requestEmailChangeSchema,
  updateProfileSchema,
  verifyEmailChangeSchema,
} from "../_schema/profile-schema";

export function useProfileSettings() {
  const dispatch = useAppDispatch();
  const { submitting, activeAction, error } = useAppSelector((state) => state.profile);

  const updateProfile = useCallback((input: unknown) =>
    dispatch(updateProfileThunk(updateProfileSchema.parse(input))).unwrap(), [dispatch]);
  const requestEmailChange = useCallback((input: unknown) =>
    dispatch(requestEmailChangeThunk(requestEmailChangeSchema.parse(input))).unwrap(), [dispatch]);
  const verifyEmailChange = useCallback((input: unknown) =>
    dispatch(verifyEmailChangeThunk(verifyEmailChangeSchema.parse(input))).unwrap(), [dispatch]);
  const changePassword = useCallback((input: unknown) =>
    dispatch(changePasswordThunk(changePasswordSchema.parse(input))).unwrap(), [dispatch]);

  return { submitting, activeAction, error, updateProfile, requestEmailChange, verifyEmailChange, changePassword };
}
