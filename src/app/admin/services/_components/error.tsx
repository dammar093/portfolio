import { AlertCircle } from "lucide-react";

export const Error = ({ error }: { error: string }) => {
  return (
    <div className="relative w-full overflow-x-auto rounded-md border p-8">
      <div className="flex flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="text-lg font-semibold">Error Loading Services</h3>
        <p className="text-sm text-muted-foreground">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    </div>
  );
};
