
"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const SetUserRoleAfterSignup = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("selectedRole");

    if (user && role && !user.publicMetadata?.role) {
      user.update({
        publicMetadata: { role },
      }).then(() => {
        localStorage.removeItem("selectedRole");
        router.push("/dashboard");
      });
    }
  }, [user]);

  return null;
};

export default SetUserRoleAfterSignup;
