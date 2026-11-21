
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

import { deleteBlog, fetchBlog, fetchBlogs } from "../_redux/blog-thunk";

import type { AppDispatch } from "@/redux/store";
import { useAppSelector } from "@/hooks/useAppSelectore";

const SEARCH_DEBOUNCE_MS = 300;

export function useBlogs(id?: string) {
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL parameters
  const initialParams = useMemo(
    () => ({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || "",
    }),
    [searchParams],
  );

  // Pagination state
  const [page, setPage] = useState(initialParams.page);
  const [limit, setLimit] = useState(initialParams.limit);

  // Search state
  const [searchInput, setSearchInput] = useState(initialParams.search);
  const [search, setSearch] = useState(initialParams.search);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data,
    usedSlugs,
    meta,
    loading,
    listLoading,
    currentBlog,
    error,
    listError,
  } = useAppSelector((state) => state.blogs);

  // Fetch blogs or a single blog
  useEffect(() => {
    if (id) {
      dispatch(fetchBlog(id));
    } else {
      dispatch(
        fetchBlogs({
          page,
          limit,
          ...(search.trim() ? { search: search.trim() } : {}),
        }),
      );
    }
  }, [dispatch, page, limit, search, id]);

  // Delete blog
  const handleDeleteBlog = useCallback(
    async (blogId: string) => {
      await dispatch(deleteBlog(blogId)).unwrap();

      if (id) return;

      // If this is the last item on the current page,
      // move to the previous page.
      if (data.length === 1 && page > 1) {
        const previousPage = page - 1;

        setPage(previousPage);

        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(previousPage));

        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });

        return;
      }

      // Refresh current page after deletion
      await dispatch(
        fetchBlogs({
          page,
          limit,
          ...(search.trim() ? { search: search.trim() } : {}),
        }),
      ).unwrap();
    },
    [
      dispatch,
      id,
      data.length,
      page,
      limit,
      search,
      searchParams,
      router,
      pathname,
    ],
  );

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Debounced search and URL sync
  const updateSearch = useCallback(
    (value: string) => {
      setSearchInput(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        setPage(1);
        setSearch(value);

        const params = new URLSearchParams(searchParams.toString());

        if (value.trim()) {
          params.set("search", value.trim());
        } else {
          params.delete("search");
        }

        params.set("page", "1");

        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      }, SEARCH_DEBOUNCE_MS);
    },
    [router, pathname, searchParams],
  );

  // Pagination handlers
  const handlePageChange = useCallback(
    (value: number) => {
      setPage(value);

      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(value));

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, pathname, searchParams],
  );

  const handleLimitChange = useCallback(
    (value: number) => {
      setLimit(value);
      setPage(1);

      const params = new URLSearchParams(searchParams.toString());
      params.set("limit", String(value));
      params.set("page", "1");

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, pathname, searchParams],
  );

  return {
    blogs: data,
    usedSlugs,
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

    handleDeleteBlog,

    currentBlog,
  };
}
