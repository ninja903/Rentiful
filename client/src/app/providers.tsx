"use client";

import StoreProvider from "@/state/redux";
//import AuthProvider from "./(auth)/authProvider"; // adjust the path as needed

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  );
};

export default Providers;
