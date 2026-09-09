import { lazy, Suspense, useEffect, useState } from "react";
import type { Species } from "@/lib/rehab";
import type { Center } from "@/lib/rehab-data";

const CapacityMap = lazy(() => import("./CapacityMap"));

export function MapPanel({ centers, species }: { centers: Center[]; species: Species }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="h-56 w-full overflow-hidden rounded-2xl border border-border bg-muted sm:h-72">
      {mounted ? (
        <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
          <CapacityMap centers={centers} species={species} />
        </Suspense>
      ) : (
        <div className="h-full w-full animate-pulse bg-muted" />
      )}
    </div>
  );
}
