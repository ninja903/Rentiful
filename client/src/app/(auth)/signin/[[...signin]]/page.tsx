
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignIn
        afterSignInUrl="/dashboard" // Redirect to our central dashboard handler
        signUpUrl="/select-role"   // If they click "Sign Up", send them to the role page
      />
    </div>
  );
}