
"use client";

import { useRouter } from "next/navigation";
import { FaUserTie, FaHome } from "react-icons/fa"; 

const SelectRole = () => {
  const router = useRouter();

  const handleSelectRole = (role: "tenant" | "manager") => {
    router.push(`/sign-up?role=${role}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Join Rentiful</h1>
        <p className="text-lg text-gray-400">First, tell us who you are.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">

        <button
          onClick={() => handleSelectRole("tenant")}
          className="flex flex-col items-center justify-center p-8 border border-gray-700 rounded-xl shadow-lg hover:bg-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:scale-105"
        >
          <FaHome className="w-16 h-16 mb-4 text-blue-400" />
          <h2 className="text-2xl font-semibold"> Tenant</h2>
          <p className="text-md text-gray-400 mt-1">
            Looking for my next home.
          </p>
        </button>

   
        <button
          onClick={() => handleSelectRole("manager")}
          className="flex flex-col items-center justify-center p-8 border border-gray-700 rounded-xl shadow-lg hover:bg-gray-800 hover:border-green-500 transition-all duration-300 transform hover:scale-105"
        >
          <FaUserTie className="w-16 h-16 mb-4 text-green-400" />
          <h2 className="text-2xl font-semibold">Manager</h2>
          <p className="text-md text-gray-400 mt-1">
            Listing and managing properties.
          </p>
        </button>
      </div>
       <p className="mt-8 text-gray-500">
        Already have an account?{" "}
        <a href="/sign-in" className="font-medium text-blue-400 hover:underline">
          Sign In
        </a>
      </p>
    </div>
  );
};

export default SelectRole;