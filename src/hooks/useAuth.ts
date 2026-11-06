"use client";
import { loginUserThunk, logoutUserThunk } from '@/redux/thunk/auth-thunk';
import { ILoginUserPayload } from '@/types/auth-type';
import { DEFAULT_REDIRECT_ADMIN_ROUTE } from '@/routes';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useAppSelector } from './useAppSelectore';
import { useAppDispatch } from './useAppDispatch';

export default function useAuth() {
  const router = useRouter();
  const { error, isLoading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const loginUser = useCallback((data: ILoginUserPayload) => {
    dispatch(loginUserThunk(data)).then((result) => {
      if (!loginUserThunk.fulfilled.match(result)) return;
      router.replace(DEFAULT_REDIRECT_ADMIN_ROUTE);
      router.refresh()
    })
  }, [dispatch, router])

  const logoutUser = useCallback(() => {
    dispatch(logoutUserThunk()).then((result) => {
      if (!logoutUserThunk.fulfilled.match(result)) return;
      router.replace("/login");
      router.refresh()
    })
  }, [dispatch, router])
  return { error, isLoading, loginUser, logoutUser }
}
