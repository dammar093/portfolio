import dynamic from "next/dynamic";
import { Suspense } from "react";

const Page = dynamic(() => import("./_components").then((mod) => mod.Contacts));

const ContactsPage = () => {
  return (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  );
};

export default ContactsPage;
