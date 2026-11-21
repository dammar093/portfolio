
"use client";

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";

import { useDispatch } from "react-redux";
import {
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";

import {
  fetchLanguage,
  fetchLanguages,
  deleteLanguage,
} from "../_redux/language-thunk";

import type { AppDispatch } from "@/redux/store";
import { useAppSelector } from "@/hooks/useAppSelectore";

const SEARCH_DEBOUNCE_MS = 300;

export function useLanguages(id?: string) {
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL params
  const initialParams = useMemo(
    () => ({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || "",
    }),
    [searchParams]
  );

  // Pagination states
  const [page, setPage] = useState(initialParams.page);
  const [limit, setLimit] = useState(initialParams.limit);

  // Search states
  const [searchInput, setSearchInput] = useState(
    initialParams.search
  );

  const [search, setSearch] = useState(initialParams.search);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Redux state
  const {
    data,
    meta,
    loading,
    listLoading,
    currentLanguage,
    error,
    listError,
  } = useAppSelector((state) => state.languages);

  // Fetch languages
  useEffect(() => {
    if (id) {
      dispatch(fetchLanguage(id));
    } else {
      dispatch(
        fetchLanguages({
          page,
          limit,
          ...(search.trim() ? { search } : {}),
        })
      );
    }
  }, [dispatch, page, limit, search, id]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Debounced search + URL sync
  const updateSearch = useCallback(
    (value: string) => {
      setSearchInput(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        setPage(1);
        setSearch(value);

        const params = new URLSearchParams(
          searchParams.toString()
        );

        if (value.trim()) {
          params.set("search", value.trim());
        } else {
          params.delete("search");
        }

        params.set("page", "1");

        router.replace(
          `${pathname}?${params.toString()}`,
          { scroll: false }
        );
      }, SEARCH_DEBOUNCE_MS);
    },
    [router, pathname, searchParams]
  );

  // Delete language
  const handleDeleteLanguage = useCallback(
    async (id: string) => {
      await dispatch(deleteLanguage(id)).unwrap();
    },
    [dispatch]
  );

  return {
    languages: data,
    meta,

    loading,
    error,
    listLoading,
    listError,

    page,
    limit,

    searchInput,
    search,

    setPage,
    setLimit,
    setSearch: updateSearch,

    currentLanguage,

    handleDeleteLanguage,
  };
}
