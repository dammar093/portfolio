export function withAbsoluteAssetUrls<T>(data: T, requestUrl: string): T {
  const baseUrl = new URL(process.env.NEXT_PUBLIC_FRONTEND_URL ?? requestUrl)
    .origin;

  const resolveValue = (value: unknown): unknown => {
    // Preserve null and primitive values
    if (value === null || value === undefined) {
      return value;
    }

    // Preserve Date objects
    if (value instanceof Date) {
      return value;
    }

    // Convert relative asset URLs to absolute URLs for API and metadata output.
    if (
      typeof value === "string" &&
      (value.startsWith("/uploads/") || value.startsWith("/api/blob?pathname="))
    ) {
      return new URL(value, baseUrl).toString();
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.map(resolveValue);
    }

    // Handle nested objects
    if (typeof value === "object") {
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
