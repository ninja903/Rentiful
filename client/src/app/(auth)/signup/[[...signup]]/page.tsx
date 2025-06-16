// app/(auth)/sign-up/[[...sign-up]]/page.tsx
"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import React from "react";

// Wrap in Suspense to safely use useSearchParams
const SignUpPageWrapper = () => (
  <React.Suspense fallback={<div className="text-white">Loading...</div>}>
    <SignUpPage />
  </React.Suspense>
);

const SignUpPage = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const userRole = role === "manager" ? "manager" : "tenant";

  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp
        unsafeMetadata={{ role: userRole }}
        
       
      />
    </div>
  );
};

export default SignUpPageWrapper;