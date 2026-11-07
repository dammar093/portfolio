"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../_redux/dashboard-thunk";
import { AppDispatch, RootState } from "@/redux-store/store";

export const useDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, loading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    if (!data) {
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, data]);

  const refetch = () => {
    dispatch(fetchDashboardStats());
  };

  return {
    dashboard: data,
    loading,
    error,
    refetch,
  };
};
