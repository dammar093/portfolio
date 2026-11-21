import dynamic from "next/dynamic";
import { Suspense } from "react";

const View = dynamic(() => import("./_components").then((mod) => mod.View));

const ViewContact = () => {
  return (
    <Suspense fallback={null}>
      <View />
    </Suspense>
  );
};

export default ViewContact;
