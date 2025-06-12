
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

  // Default to 'tenant' if the role is anything other than 'manager'
  const userRole = role === "manager" ? "manager" : "tenant";

  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp
        // This is the key part: we attach the role to the user's metadata
        unsafeMetadata={{
          role: userRole,
        }}
        afterSignUpUrl="/dashboard" // Redirect to our central dashboard handler
        signInUrl="/sign-in"
      />
    </div>
  );
};

export default SignUpPageWrapper;