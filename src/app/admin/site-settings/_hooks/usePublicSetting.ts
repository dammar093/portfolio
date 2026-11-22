
"use client";

import { useEffect } from "react";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";

import {
  fetchPublicSetting
} from "../_redux/setting-thunk";

export const usePublicSettings = () => {
  const dispatch = useAppDispatch();

  const {
    data,
    loading,
    error,
  } = useAppSelector((state) => state.setting);

  useEffect(() => {
    dispatch(fetchPublicSetting());
  }, [dispatch]);

  return {
    setting: data,
    loading,
    error,
  };
};
