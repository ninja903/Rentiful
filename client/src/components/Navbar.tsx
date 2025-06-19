// import { NAVBAR_HEIGHT } from '@/lib/constants';
// import Image from 'next/image';
// import Link from 'next/link';
// import React from 'react'
// import { Button } from './ui/button';

// const Navbar = () => {
//     return (
//         <div className="fixed top-0 left-0 w-full z-50 shadow-xl"
//             style={{ height: `${NAVBAR_HEIGHT}` }}
//         >
//             <div className="flex justify-between items-center w-full py-3 px-8 bg-primary-700 text-white">
//                 <div className="flex items-center gap-4 md:gap-6">
//                     <Link
//                         href="/"
//                         className="cursor-ponter hover:!text-primary-300"
//                         scroll={false}>
//                         <div className="flex items-center gap-3">
//                             <Image
//                                 src="/logo.svg"
//                                 alt="Rentful Logo"
//                                 width={24}
//                                 height={24}
//                                 className="w-6 h-6"
//                             />
//                             <div className='text-xl font-bold'>
//                                 RENT
//                                 <span className="text-secondary-500 font-light hover:!text-primary-300">
//                                     IFUL
//                                 </span>
//                             </div>
//                         </div>
//                     </Link>
//                 </div>
//                 <p className="text-primary-200 hidden md:block">
//                     Discover your perfect rental home with Rentful
//                 </p>
//                 <div className="flex items-center gap-5">
//                     <Link href="/signin">
//                         <Button variant="outline"
//                             className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
//                         >
//                             Sign In
//                         </Button>
//                     </Link>
//                     <Link href="/signup">
//                         <Button variant="secondary"
//                             className="text-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg"
//                         >
//                             Sign Up
//                         </Button>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     )
// };

// export default Navbar;

"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useGetAuthUserQuery } from "@/state/api";

const Navbar = () => {
    const router = useRouter();
    const { data: authUser } = useGetAuthUserQuery();
    const pathname = usePathname();

    const isDashboardPage = pathname.includes("/managers") || pathname.includes("/tenants");

    const handleSignOut = async () => {
        await sign
    }


  return (
    <div
      className="fixed top-0 left-0 w-full z-50 shadow-xl"
      style={{ height: `${NAVBAR_HEIGHT}` }}
    >
      <div className="flex justify-between items-center w-full py-3 px-8 bg-primary-700 text-white">
        {/* Logo */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" scroll={false} className="cursor-pointer hover:!text-primary-300">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Rentful Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="text-xl font-bold">
                RENT
                <span className="text-secondary-500 font-light hover:!text-primary-300">
                  IFUL
                </span>
              </div>
            </div>
          </Link>
        </div>

      
        <p className="text-primary-200 hidden md:block">
          Discover your perfect rental home with Rentful
        </p>

        <div className="flex items-center gap-5">
          <SignedOut>
            <Link href="/signin">
              <Button
                variant="outline"
                className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
              >
                Sign In
              </Button>
            </Link>
            <Button
              variant="secondary"
              onClick={() => router.push("/select-role")}
              className="text-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg"
            >
              Sign Up
            </Button>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
              >
                Dashboard
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
