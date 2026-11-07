export function withAbsoluteAssetUrls<T>(data: T, requestUrl: string): T {
  const baseUrl = new URL(
    process.env.NEXT_PUBLIC_FRONTEND_URL ?? requestUrl,
  ).origin;

  const resolveValue = (value: unknown): unknown => {
    if (typeof value === "string" && value.startsWith("/uploads/")) {
      return new URL(value, baseUrl).toString();
    }

    if (Array.isArray(value)) {
      return value.map(resolveValue);
    }

    if (value !== null && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, nestedValue]) => [
          key,
          resolveValue(nestedValue),
        ]),
      );
    }

    return value;
  };

  return resolveValue(data) as T;
}
