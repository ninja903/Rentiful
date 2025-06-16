import { NAVBAR_HEIGHT } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';

const Navbar = () => {
    return (
        <div className="fixed top-0 left-0 w-full z-50 shadow-xl"
            style={{ height: `${NAVBAR_HEIGHT}` }}
        >
            <div className="flex justify-between items-center w-full py-3 px-8 bg-primary-700 text-white">
                <div className="flex items-center gap-4 md:gap-6">
                    <Link
                        href="/"
                        className="cursor-ponter hover:!text-primary-300"
                        scroll={false}>
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logo.svg"
                                alt="Rentful Logo"
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className='text-xl font-bold'>
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
                    <Link href="/signin">
                        <Button variant="outline"
                            className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
                        >
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button variant="secondary"
                            className="text-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg"
                        >
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
};

export default Navbar;


// "use client";

// import Link from "next/link";
// import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button"; // Assuming Shadcn UI

// const Navbar = () => {
//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <Link href="/" className="text-2xl font-bold text-gray-900">
//             Rentiful
//           </Link>
//           <div className="flex items-center gap-4">
//             <SignedOut>
//               <Link href="/sign-in">
//                 <Button variant="ghost">Sign In</Button>
//               </Link>
//               <Link href="/select-role">
//                 <Button className="bg-primary-600 hover:bg-primary-500">Sign Up</Button>
//               </Link>
//             </SignedOut>
//             <SignedIn>
//               <Link href="/dashboard">
//                 <Button variant="outline">Dashboard</Button>
//               </Link>
//               <UserButton afterSignOutUrl="/" />
//             </SignedIn>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;
