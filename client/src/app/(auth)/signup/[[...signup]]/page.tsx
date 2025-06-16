'use client';

import { SignUp } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, Suspense } from 'react';

const SignUpPageWrapper = () => (
  <Suspense fallback={<div className="text-white">Loading...</div>}>
    <SignUpPage />
  </Suspense>
);

const SignUpPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  //const role = searchParams.get('role');
  const role = searchParams.get("role")
  const userRole = role === 'manager' ? 'manager' : 'tenant';

  // Save role after user signs up
  useEffect(() => {
    const setUserRole = async () => {
      if (user && isSignedIn && !user.publicMetadata?.role) {
        await user.update({ publicMetadata: { role: userRole } });

        // Redirect based on role
        if (userRole === 'manager') {
          router.push('/manager');
        } else {
          router.push('/tenants');
        }
      }
    };

    setUserRole();
  }, [user, isSignedIn, userRole, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp path="/signup" routing="path" />
    </div>
  );
};

export default SignUpPageWrapper;
