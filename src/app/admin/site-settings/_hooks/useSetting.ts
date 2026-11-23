
"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";

import {
  fetchSetting,
  saveSetting as saveSettingThunk,
} from "../_redux/setting-thunk";
import { settingDefaultValues, settingSchema, type SettingFormInput } from "../_schema/setting-schema";
import type { SettingItem } from "../_types/setting";

import { clearSettingError } from "../_redux/setting-slice";

function toFormValues(setting: SettingItem | null): SettingFormInput {
  return {
    name: setting?.name ?? "",
    email: setting?.email ?? "",
    phone: setting?.phone ?? "",
    description: setting?.description ?? "",
    address: setting?.address ?? "",
    g_tag: setting?.g_tag ?? "",
    linkedin_link: setting?.linkedin_link ?? "",
    github_link: setting?.github_link ?? "",
    youtube_link: setting?.youtube_link ?? "",
    facebook_link: setting?.facebook_link ?? "",
    instagram_link: setting?.instagram_link ?? "",
  };
}

export const useSetting = () => {
  const dispatch = useAppDispatch();

  const {
    data,
    loading,
    submitting,
    error,
  } = useAppSelector((state) => state.setting);
  const form = useForm<SettingFormInput>({
    resolver: zodResolver(settingSchema),
    defaultValues: settingDefaultValues,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const previewUrl = useRef<string | null>(null);

  // Fetch setting
  const refetch = useCallback(() => {
    return dispatch(fetchSetting());
  }, [dispatch]);

  // Create or update admin website settings from form values and the optional logo.
  const saveSetting = useCallback(
    async (values: SettingFormInput, logoFile?: File | null) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });
      if (logoFile) formData.append("logo", logoFile);

      return dispatch(saveSettingThunk(formData)).unwrap();
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

  useEffect(() => {
    form.reset(toFormValues(data));
    setLogoFile(null);
    setLogoPreview(data?.logo ?? null);
    if (previewUrl.current) {
      URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = null;
    }
  }, [data, form]);

  useEffect(() => () => {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
  }, []);

  const handleLogoChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo must be smaller than 5MB");
      event.target.value = "";
      return;
    }

    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = URL.createObjectURL(file);
    setLogoFile(file);
    setLogoPreview(previewUrl.current);
  }, []);

  const resetForm = useCallback(() => {
    form.reset(toFormValues(data));
    setLogoFile(null);
    setLogoPreview(data?.logo ?? null);
    if (previewUrl.current) {
      URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = null;
    }
  }, [data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const updatedSetting = await saveSetting(values, logoFile);
      form.reset(toFormValues(updatedSetting));
      setLogoFile(null);
      setLogoPreview(updatedSetting.logo ?? null);
      if (previewUrl.current) {
        URL.revokeObjectURL(previewUrl.current);
        previewUrl.current = null;
      }
    } catch (submitError) {
      console.error("Settings save failed:", submitError);
    }
  });

  return {
    setting: data,
    loading,
    submitting,
    error,
    getSetting: refetch,
    saveSetting,
    clearError,
    register: form.register,
    errors: form.formState.errors,
    onSubmit,
    resetForm,
    logoFile,
    logoPreview,
    handleLogoChange,
  };
};

// Backwards-compatible alias for existing consumers.
export const useSettings = useSetting;
