// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignIn
        // Redirect to our central dashboard handler
        signUpUrl="/signin"   // If they click "Sign Up", send them to the role page
      />
    </div>
  );
}