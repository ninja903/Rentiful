// "use client"

// import Navbar from '@/components/Navbar';
// import { NAVBAR_HEIGHT } from '@/lib/constants';
// import { useGetAuthUserQuery } from '@/state/api';
// import React from 'react';

// const Layout = ({ children }: { children: React.ReactNode }) => {
//     const { data: authUser } = useGetAuthUserQuery();
//     return (
//         <div className="h-full w-full">
//             {<Navbar />}
//             <main className={`h-full flex w-full flex-col`}
//                 style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
//                 {children}
//             </main>
//         </div>
//     );
// };

// export default Layout;

// client/app/(landing)/layout.tsx
import Navbar from '@/components/Navbar'; // Adjust path if needed
import FooterSection from './FooterSection';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <FooterSection />
    </>
  );
}
