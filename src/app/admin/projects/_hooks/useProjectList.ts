
"use client";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  deleteProject,
  fetchProjects,
} from "../_redux/project-thunk";

export const useProjects = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ==========================================
  // REDUX STATE
  // ==========================================
  const {
    data: projects,
    usedSlugs,
    meta,
    loading,
    error,
    listLoading,
    listError,
  } = useAppSelector((state) => state.projects);

  // ==========================================
  // QUERY STATE
  // ==========================================
  const [page, setPageState] = useState(() => {
    const value = Number(searchParams.get("page"));
    return Number.isInteger(value) && value > 0 ? value : 1;
  });

  const [limit, setLimitState] = useState(() => {
    const value = Number(searchParams.get("limit"));
    return Number.isInteger(value) && value > 0 ? value : 10;
  });

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? ""
  );

  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );

  // ==========================================
  // DEBOUNCED SEARCH
  // ==========================================
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPageState(1);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  // ==========================================
  // FETCH PROJECT LIST
  // ==========================================
  useEffect(() => {
    dispatch(
      fetchProjects({
        page,
        limit,
        search,
      })
    );
  }, [dispatch, page, limit, search]);

  // ==========================================
  // SYNC QUERY PARAMS
  // ==========================================
  useEffect(() => {
    const query = new URLSearchParams();

    query.set("page", String(page));
    query.set("limit", String(limit));

    if (search) {
      query.set("search", search);
    }

    const nextUrl = `/admin/projects?${query.toString()}`;

    const currentUrl =
      `/admin/projects${window.location.search}`;

    if (currentUrl !== nextUrl) {
      router.replace(nextUrl, {
        scroll: false,
      });
    }
  }, [page, limit, search, router]);

  // ==========================================
  // PAGE CHANGE
  // ==========================================
  const setPage = useCallback((value: number) => {
    setPageState(Math.max(1, value));
  }, []);

  // ==========================================
  // LIMIT CHANGE
  // ==========================================
  const setLimit = useCallback((value: number) => {
    setLimitState(Math.max(1, value));
    setPageState(1);
  }, []);

  // ==========================================
  // SEARCH CHANGE
  // ==========================================
  const setSearchValue = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  // ==========================================
  // DELETE PROJECT
  // ==========================================
  const handleDeleteProject = useCallback(
    async (projectId: string) => {
      await dispatch(deleteProject(projectId)).unwrap();

      if (projects.length === 1 && page > 1) {
        setPageState((previous) =>
          Math.max(1, previous - 1)
        );

        return;
      }

      await dispatch(
        fetchProjects({
          page,
          limit,
          search,
        })
      );
    },
    [dispatch, projects.length, page, limit, search]
  );

  // ==========================================
  // RETURN
  // ==========================================
  return {
    projects,
    usedSlugs,
    meta,

    loading,
    error,
    listLoading,
    listError,

    page,
    limit,
    search,
    searchInput,

    setPage,
    setLimit,
    setSearch: setSearchValue,

    handleDeleteProject,
  };
};
