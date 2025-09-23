"use client"

import { LoginForm } from "@/components/forms/login-form";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get("success") === "1";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex flex-col items-center w-full max-w-md">
        {showSuccess && (
          <div className="mb-4 text-green-600 w-full text-center">
            Your account was successfully created! Please log in.
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
