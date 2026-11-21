
"use client";

import { useCallback, useEffect } from "react";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";

import {
  fetchSetting,
  saveSetting,
} from "../_redux/setting-thunk";

import { clearSettingError } from "../_redux/setting-slice";

export const useSettings = () => {
  const dispatch = useAppDispatch();

  const {
    data,
    loading,
    submitting,
    error,
  } = useAppSelector((state) => state.setting);

  // Fetch setting
  const refetch = useCallback(() => {
    return dispatch(fetchSetting());
  }, [dispatch]);

  // Save setting (create / update)
  const save = useCallback(
    async (formData: FormData) => {
      return dispatch(saveSetting(formData)).unwrap();
    },
    [dispatch],
  );

  // Clear error
  const clearError = useCallback(() => {
    dispatch(clearSettingError());
  }, [dispatch]);

  // Initial fetch
  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    setting: data,
    loading,
    submitting,
    error,
    refetch,
    save,
    clearError,
  };
};
