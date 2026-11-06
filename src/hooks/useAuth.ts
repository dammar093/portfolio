"use client";
import { loginUserThunk, logoutUserThunk } from '@/redux/thunk/auth-thunk';
import { ILoginUserPayload } from '@/types/auth-type';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useAppSelector } from './useAppSelectore';
import { useAppDispatch } from './useAppDispatch';

export default function useAuth() {
  const router = useRouter();
  const { error, isLoading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const loginUser = useCallback((data: ILoginUserPayload) => {
    dispatch(loginUserThunk(data)).unwrap().then(() => {
      router.refresh()
    })
  }, [dispatch, router])

  const logoutUser = useCallback(() => {
    dispatch(logoutUserThunk()).unwrap().then(() => {
      router.refresh()
    })
  }, [dispatch, router])
  return { error, isLoading, loginUser, logoutUser }
}
