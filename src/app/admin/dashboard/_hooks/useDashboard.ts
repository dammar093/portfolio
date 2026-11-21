"use client";

import { useCallback, useEffect } from "react";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";

import { fetchDashboardStats } from "../_redux/dashboard-thunk";

export const useDashboard = () => {
  const dispatch = useAppDispatch();

  const { data, loading, error } = useAppSelector((state) => state.dashboard);

  const refetch = useCallback(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    stats: data,
    loading,
    error,
    refetch,
  };
};
