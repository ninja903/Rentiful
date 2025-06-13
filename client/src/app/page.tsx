// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming you use Shadcn UI, otherwise use a regular <button>

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Welcome to Rentiful
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          The best place to find your next home or manage your properties.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/select-role">
            <Button size="lg" className="bg-primary-600 hover:bg-primary-500">
              Get Started (Sign Up)
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline" className="border-gray-600 hover:bg-gray-800">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}