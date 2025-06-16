
'use client'

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const SetUserRoleAfterSignup = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    const setRole = async () => {
      const role = localStorage.getItem('selectedRole');
      if (isSignedIn && role && !user?.publicMetadata?.role) {
        await user.update({ publicMetadata: { role } });
        localStorage.removeItem('selectedRole');

        // Redirect based on role
        if (role === 'tenant') {
          router.push('/tenants');
        } else if (role === 'manager') {
          router.push('/manager');
        } else {
          router.push('/dashboard');
        }
      }
    };

    setRole();
  }, [isSignedIn, user]);

  return null;
};

export default SetUserRoleAfterSignup;
