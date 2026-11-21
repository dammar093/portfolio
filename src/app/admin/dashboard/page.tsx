import dynamic from "next/dynamic";
import { Suspense } from "react";
import DashboardSkeleton from "./_components/dashboard-skeleton";
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
