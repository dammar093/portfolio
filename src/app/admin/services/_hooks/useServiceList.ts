
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";

import {
  fetchService,
  fetchServices,
  deleteService,
} from "../_redux/service-thunk";

const SEARCH_DEBOUNCE_MS = 300;

export function useServices(id?: string) {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialParams = useMemo(
    () => ({
      page: Math.max(1, Number(searchParams.get("page")) || 1),
      limit: Math.max(1, Number(searchParams.get("limit")) || 10),
      search: searchParams.get("search") || "",
    }),
    [searchParams]
  );

  const [page, setPage] = useState(initialParams.page);
  const [limit, setLimit] = useState(initialParams.limit);
  const [searchInput, setSearchInput] = useState(initialParams.search);
  const [search, setSearch] = useState(initialParams.search);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data,
    meta,
    loading,
    listLoading,
    currentService,
    error,
    listError,
  } = useAppSelector((state) => state.services);

  // ==============================
  // FETCH SERVICES / SINGLE SERVICE
  // ==============================
  useEffect(() => {
    if (id) {
      dispatch(fetchService(id));
      return;
    }

    dispatch(
      fetchServices({
        page,
        limit,
        ...(search.trim() ? { search: search.trim() } : {}),
      })
    );
  }, [dispatch, page, limit, search, id]);

  // ==============================
  // SYNC URL PARAMS WITH STATE
  // ==============================
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    const urlPage = Math.max(
      1,
      Number(params.get("page")) || 1
    );

    const urlLimit = Math.max(
      1,
      Number(params.get("limit")) || 10
    );

    const urlSearch = params.get("search") || "";

    if (urlPage !== page) setPage(urlPage);
    if (urlLimit !== limit) setLimit(urlLimit);

    if (urlSearch !== search) {
      setSearch(urlSearch);
      setSearchInput(urlSearch);
    }
  }, [searchParams, page, limit, search]);

  // ==============================
  // CLEAR DEBOUNCE ON UNMOUNT
  // ==============================
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // ==============================
  // UPDATE SEARCH
  // ==============================
  const updateSearch = useCallback(
    (value: string) => {
      setSearchInput(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        const trimmedValue = value.trim();

        setPage(1);
        setSearch(trimmedValue);

        const params = new URLSearchParams(searchParams.toString());

        if (trimmedValue) {
          params.set("search", trimmedValue);
        } else {
          params.delete("search");
        }

        params.set("page", "1");

        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      }, SEARCH_DEBOUNCE_MS);
    },
    [router, pathname, searchParams]
  );

  // ==============================
  // UPDATE PAGE
  // ==============================
  const handlePageChange = useCallback(
    (newPage: number) => {
      const validPage = Math.max(1, newPage);

      setPage(validPage);

      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(validPage));

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  // ==============================
  // UPDATE LIMIT
  // ==============================
  const handleLimitChange = useCallback(
    (newLimit: number) => {
      const validLimit = Math.max(1, newLimit);

      setLimit(validLimit);
      setPage(1);

      const params = new URLSearchParams(searchParams.toString());

      params.set("limit", String(validLimit));
      params.set("page", "1");

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  // ==============================
  // DELETE SERVICE
  // ==============================
  const handleDeleteService = useCallback(
    async (serviceId: string) => {
      await dispatch(deleteService(serviceId)).unwrap();

      // Refresh current list after successful deletion.
      if (!id) {
        dispatch(
          fetchServices({
            page,
            limit,
            ...(search.trim() ? { search: search.trim() } : {}),
          })
        );
      }
    },
    [dispatch, id, page, limit, search]
  );

  return {
    services: data,
    meta,

    loading,
    error,

    listLoading,
    listError,

    page,
    limit,

    searchInput,
    search,

    setPage: handlePageChange,
    setLimit: handleLimitChange,
    setSearch: updateSearch,

    currentService,

    handleDeleteService,
  };
}
