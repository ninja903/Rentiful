"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignInComponent = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const role = user?.publicMetadata?.role;

    if (role === "manager") {
      router.push("/manager");
    } else if (role === "tenant") {
      router.push("/tenants");
    } else {
      router.push("/setup-role");
    }
  }, [isSignedIn, isLoaded, user, router]);

  return (
    <SignIn
      appearance={{
        baseTheme: dark,
        elements: {
          rootBox: "flex justify-center items-center py-5",
          cardBox: "shadow-none",
          card: "bg-customgreys-secondarybg w-full shadow-none",
          formFieldLabel: "text-white-50 font-normal",
          formButtonPrimary:
            "bg-primary-700 text-white-100 hover:bg-primary-600 !shadow-none",
          formFieldInput:
            "bg-customgreys-primary-bg text-white-50 !shadow-none",
          footerActionLink: "text-primary-750 hover:text-primary-600",
        },
      }}
      signUpUrl="/signup"
      routing="hash"
    />
  );
};

export default SignInComponent;
