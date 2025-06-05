"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



const SignupComponent = () => {
  const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    console.log(role,"role");
    

//   // Load role from localStorage if already chosen
//   useEffect(() => {
//       const storedRole = localStorage.getItem("selectedRole");
//       console.log(storedRole, "storedRole")
//     if (storedRole) {
//       setRole(storedRole);
//     }
//   }, []);

  // If no role selected, show role buttons
  const handleSelectRole = (selectedRole: string) => {
    localStorage.setItem("selectedRole", selectedRole);
    setRole(selectedRole);
  };

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-semibold text-white">Select Your Role</h1>
        <button
          onClick={() => handleSelectRole("tenant")}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          Tenant
        </button>
        <button
          onClick={() => handleSelectRole("manager")}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500"
        >
          Manager
        </button>
      </div>
    );
  }

  // After role is selected, show Clerk signup
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-5">
      <p className="text-white mb-4">Signing up as: <strong>{role}</strong></p>
      <SignUp
        appearance={{
          baseTheme: dark,
          elements: {
            rootBox: "flex justify-center items-center",
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
        routing="hash"
        signInUrl="/signin"
        forceRedirectUrl="/post-signup"
      />
      </div>
  
  );
};

export default SignupComponent;

// "use client";

// import { SignUp } from "@clerk/nextjs";
// import { dark } from "@clerk/themes";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { FcGoogle } from "react-icons/fc";
// import { FaGithub } from "react-icons/fa";

// const Divider = ({ children }: { children: React.ReactNode }) => (
//   <div className="relative flex items-center py-4">
//     <div className="flex-grow border-t border-gray-600"></div>
//     <span className="mx-4 text-sm text-gray-400">{children}</span>
//     <div className="flex-grow border-t border-gray-600"></div>
//   </div>
// );

// const SocialButton = ({ 
//   provider, 
//   icon, 
//   onClick 
// }: { 
//   provider: string;
//   icon: React.ReactNode;
//   onClick: () => void;
// }) => (
//   <motion.button
//     whileHover={{ scale: 1.02 }}
//     whileTap={{ scale: 0.98 }}
//     className={`flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg font-medium 
//                transition-colors w-full ${provider === 'google' ? 
//                'bg-white text-gray-800 hover:bg-gray-50 border border-gray-200' : 
//                'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'}`}
//     onClick={onClick}
//   >
//     {icon}
//     Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
//   </motion.button>
// );

// const RoleSelection = ({ onSelect }: { onSelect: (role: string) => void }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     className="flex flex-col items-center justify-center min-h-screen gap-6 px-4"
//   >
//     <div className="text-center">
//       <h1 className="text-3xl font-bold text-white mb-2">Join Our Platform</h1>
//       <p className="text-gray-300">Select your role to get started</p>
//     </div>
    
//     <div className="flex flex-col gap-4 w-full max-w-xs">
//       <motion.button
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         onClick={() => onSelect("tenant")}
//         className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 
//                    font-medium transition-colors shadow-md"
//       >
//          Tenant
//       </motion.button>
//       <motion.button
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         onClick={() => onSelect("manager")}
//         className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 
//                    font-medium transition-colors shadow-md"
//       >
//          Manager
//       </motion.button>
//     </div>
//   </motion.div>
// );

// const SignupComponent = () => {
//   const router = useRouter();
//   const [role, setRole] = useState<string | null>(null);

//   useEffect(() => {
//     const storedRole = localStorage.getItem("selectedRole");
//     if (storedRole) setRole(storedRole);
//   }, []);

//   const handleSelectRole = (selectedRole: string) => {
//     localStorage.setItem("selectedRole", selectedRole);
//     setRole(selectedRole);
//   };

//   const handleSocialLogin = (provider: string) => {
//     // Implement your social login logic here
//     console.log(`Logging in with ${provider} as ${role}`);
//   };

//   if (!role) {
//     return <RoleSelection onSelect={handleSelectRole} />;
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen py-5 bg-gradient-to-br from-gray-900 to-gray-800 px-4">
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md"
//       >
//         <div className="text-center mb-8">
//           <motion.h1 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-3xl font-bold text-white mb-2"
//           >
//             Join as a {role}
//           </motion.h1>
//           <p className="text-gray-300">Start your journey in just 30 seconds</p>
//         </div>

//         <SignUp
//           appearance={{
//             baseTheme: dark,
//             elements: {
//               rootBox: "w-full",
//               card: "bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8",
//               formFieldInput: "bg-gray-700/50 h-12 rounded-lg border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent",
//               formButtonPrimary: "bg-primary-600 hover:bg-primary-500 transition-all py-3 rounded-lg font-medium shadow-none",
//               socialButtonsBlockButton: "border-gray-600 hover:bg-gray-700/50",
//               footerActionLink: "text-primary-500 hover:text-primary-400",
//               formFieldLabel: "text-gray-300 mb-1",
//               formFieldAction: "text-primary-400 hover:text-primary-300",
//             }
//           }}
//           afterSignUpUrl={`/dashboard/${role}`}
//           signInUrl="/signin"
//         />

//         <Divider>OR CONTINUE WITH</Divider>
        
//         <div className="flex flex-col gap-3 mt-4">
//           <SocialButton 
//             provider="google" 
//             icon={<FcGoogle className="text-lg" />} 
//             onClick={() => handleSocialLogin('google')}
//           />
//           <SocialButton 
//             provider="github" 
//             icon={<FaGithub className="text-lg" />} 
//             onClick={() => handleSocialLogin('github')}
//           />
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default SignupComponent;
