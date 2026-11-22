
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
  fetchContact,
  fetchContacts,
  deleteContact,
} from "../_redux/contact-thunk";

const SEARCH_DEBOUNCE_MS = 300;

// ==============================
// CONTACT LIST HOOK
// ==============================
export function useContacts(id?: string) {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ==============================
  // INITIAL URL PARAMS
  // ==============================
  const initialParams = useMemo(
    () => ({
      page: Math.max(1, Number(searchParams.get("page")) || 1),
      limit: Math.max(1, Number(searchParams.get("limit")) || 10),
      search: searchParams.get("search") || "",
      isSeen: searchParams.get("isSeen") || "",
    }),
    [searchParams],
  );

  const [page, setPage] = useState(initialParams.page);
  const [limit, setLimit] = useState(initialParams.limit);

  const [searchInput, setSearchInput] = useState(
    initialParams.search,
  );

  const [search, setSearch] = useState(initialParams.search);

  const [isSeen, setIsSeen] = useState(initialParams.isSeen);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // ==============================
  // REDUX STATE
  // ==============================
  const {
    data,
    meta,
    unseenCount,
    loading,
    listLoading,
    currentContact,
    error,
    listError,
  } = useAppSelector((state) => state.contacts);

  // ==============================
  // FETCH CONTACTS / SINGLE CONTACT
  // ==============================
  useEffect(() => {
    if (id) {
      dispatch(fetchContact(id));
      return;
    }

    dispatch(
      fetchContacts({
        page,
        limit,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(isSeen ? { isSeen: isSeen === "true" } : {}),
      }),
    );
  }, [dispatch, page, limit, search, isSeen, id]);

  // ==============================
  // SYNC URL PARAMS WITH STATE
  // ==============================
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    const urlPage = Math.max(1, Number(params.get("page")) || 1);
    const urlLimit = Math.max(1, Number(params.get("limit")) || 10);
    const urlSearch = params.get("search") || "";
    const urlIsSeen = params.get("isSeen") || "";

    if (urlPage !== page) setPage(urlPage);
    if (urlLimit !== limit) setLimit(urlLimit);

    if (urlSearch !== search) {
      setSearch(urlSearch);
      setSearchInput(urlSearch);
    }

    if (urlIsSeen !== isSeen) {
      setIsSeen(urlIsSeen);
      setPage(1);
    }
  }, [searchParams,isSeen]);

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
    [router, pathname, searchParams],
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
    [router, pathname, searchParams],
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
    [router, pathname, searchParams],
  );

  // ==============================
  // UPDATE SEEN FILTER
  // ==============================
  const handleSeenFilterChange = useCallback(
    (value: string) => {
      setIsSeen(value);
      setPage(1);

      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("isSeen", value);
      } else {
        params.delete("isSeen");
      }

      params.set("page", "1");

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, pathname, searchParams],
  );

  // ==============================
  // DELETE CONTACT
  // ==============================
  const handleDeleteContact = useCallback(
    async (contactId: string) => {
      await dispatch(deleteContact(contactId)).unwrap();

      if (!id) {
        dispatch(
          fetchContacts({
            page,
            limit,
            ...(search.trim() ? { search: search.trim() } : {}),
            ...(isSeen ? { isSeen: isSeen === "true" } : {}),
          }),
        );
      }
    },
    [dispatch, id, page, limit, search, isSeen],
  );

  return {
    contacts: data,
    meta,
    unseenCount,

    loading,
    error,

    listLoading,
    listError,

    page,
    limit,

    searchInput,
    search,

    isSeen,

    setPage: handlePageChange,
    setLimit: handleLimitChange,
    setSearch: updateSearch,
    setIsSeen: handleSeenFilterChange,

    currentContact,

    handleDeleteContact,
  };
}
