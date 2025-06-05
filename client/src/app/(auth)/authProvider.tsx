"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";

// Redirect map
const roleRedirectMap: Record<string, string> = {
  tenant: "/tenants",
  manager: "/manager",
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === "/signin" || pathname === "/signup";
  const isDashboardPage =
    pathname.startsWith("/manager") || pathname.startsWith("/tenants");

  useEffect(() => {
    if (isLoaded && user && isAuthPage) {
      const role = user.publicMetadata?.role as string | undefined;

      if (!role) {
        router.push("/setup-role");
        return;
      }

      router.push(roleRedirectMap[role] || "/");
    }
  }, [user, isLoaded, isAuthPage, router]);

  // Allow rendering children on non-auth and non-dashboard pages
  if (!isAuthPage && !isDashboardPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <SignedIn>{children}</SignedIn>

      <SignedOut>
        {pathname === "/signup" ? (
          <SignUp
            signUpUrl="/signup"
            appearance={{ elements: { card: "shadow-lg p-6" } }}
            // Handle redirect manually
            afterSignUp={() => {
              router.push("/setup-role");
            }}
          />
        ) : (
          <SignIn
            signInUrl="/signin"
            appearance={{ elements: { card: "shadow-lg p-6" } }}
            afterSignIn={() => {
              // Wait for role check in useEffect
            }}
          />
        )}
      </SignedOut>
    </div>
  );
};

export default AuthProvider;
