"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { deletePage, fetchPage, fetchPages, toggleStatusPage } from "../_redux/page-thunk";
import { AppDispatch } from "@/redux/store";
import { useAppSelector } from "@/hooks/useAppSelectore";

const SEARCH_DEBOUNCE_MS = 300;

export function usePages(id?: string) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* -------------------------------------------
   * Read URL params ONCE
   * ----------------------------------------- */
  const initialParams = useMemo(() => ({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    search: searchParams.get("search") || "",
  }), [searchParams]);

  /* -------------------------------------------
   * State separation (IMPORTANT)
   * ----------------------------------------- */
  const [page, setPage] = useState(initialParams.page);
  const [limit, setLimit] = useState(initialParams.limit);

  // 🔹 instant input value
  const [searchInput, setSearchInput] = useState(initialParams.search);

  // 🔹 debounced query value
  const [search, setSearch] = useState(initialParams.search);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { data, meta, loading, listLoading, currentPage, error, listError } = useAppSelector(
    (state) => state.pages
  );

  /* -------------------------------------------
   * Fetch data (ONLY debounced value)
   * ----------------------------------------- */
  useEffect(() => {
    if (!id) {
      dispatch(
        fetchPages({
          page,
          limit,
          ...(search.trim() ? { search } : {}),
        })
      );
    }
    else {
      dispatch(fetchPage(id))
    }
  }, [dispatch, page, limit, search, id]);

  /* -------------------------------------------
   * Debounced search + URL sync
   * ----------------------------------------- */
  const updateSearch = useCallback((value: string) => {
    // instant UI update
    setSearchInput(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setPage(1);
      setSearch(value);

      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      params.set("page", "1");

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }, SEARCH_DEBOUNCE_MS);
  }, [router, pathname, searchParams]);

  // delete page
  const handleDelete = useCallback((id: string) => {
    dispatch(deletePage(id))
  }, [dispatch])
  // delete page
  const handleToggleStatus = useCallback((id: string) => {
    dispatch(toggleStatusPage(id))
  }, [dispatch])

  return {
    pages: data,
    meta,
    loading,
    error,
    listLoading,
    listError,

    page,
    limit,

    // expose both
    searchInput,
    search,

    setPage,
    setLimit,
    setSearch: updateSearch,
    currentPage,
    handleDelete,
    handleToggleStatus
  };
}
