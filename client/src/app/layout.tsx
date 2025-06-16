import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // <-- Your Redux & app-level providers

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clerk + Redux App",
  description: "App with Clerk authentication and Redux setup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* Optional Header */}
          <header className="flex justify-end items-center p-4 gap-4 h-16 border-b">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>

          {/* Your global app providers (e.g., Redux) */}
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}



// import { ClerkProvider } from "@clerk/nextjs";
// import { dark } from "@clerk/themes"; // Your preferred theme
// import "./globals.css";

// export const metadata = {
//   title: "Rentiful",
//   description: "Find your next rental property.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <ClerkProvider
//       appearance={{
//         baseTheme: dark,
//         // Add custom styles from the repo here if you wish
//       }}
//     >
//       <html lang="en">
//         <body className="bg-white text-gray-800">
//           {children}
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }

