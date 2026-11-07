interface JsonLdProps {
  data?: unknown;
}

function parseJsonLd(data: unknown): unknown | null {
  if (!data) return null;

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  if (typeof data === "object") {
    return data;
  }

  return null;
}

export function JsonLd({ data }: JsonLdProps) {
  const jsonLd = parseJsonLd(data);

  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
