import dynamic from "next/dynamic";
import { Suspense } from "react";
import DashboardSkeleton from "./_components/loading";
const DashboardOverview = dynamic(() =>
  import("./_components").then((mod) => mod.DashboardOverview),
);

const DashboardPage = async () => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardOverview />
    </Suspense>
  );
};

export default DashboardPage;
