import { NextResponse } from "next/server";

type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type SuccessOptions<T> = {
  message: string;
  data: T;
  status?: number;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export function success<T>({
  message,
  data,
  status = 200,
  meta,
}: SuccessOptions<T>) {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    data,
    ...(meta && { meta }),
  };

  return NextResponse.json(response, { status });
}

export function error({
  message,
  status = 500,
}: {
  message: string;
  status?: number;
}) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status },
  );
}
