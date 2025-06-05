"use client";

import { useRouter } from "next/navigation";

export default function SelectRolePage() {
  const router = useRouter();

  const handleSelectRole = (role: string) => {
    localStorage.setItem("selectedRole", role);
    router.push("/signup");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Select Your Role</h1>
      <button
        onClick={() => handleSelectRole("tenant")}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Tenant
      </button>
      <button
        onClick={() => handleSelectRole("manager")}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Manager
      </button>
    </div>
  );
}
