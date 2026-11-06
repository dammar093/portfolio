import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import the named export `LoginForm`
const LoginForm = dynamic(() =>
  import("@/components/auth/LoginForm").then((mod) => mod.LoginForm),
);

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
