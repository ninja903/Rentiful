import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { UserResource } from "@clerk/types";

// Tailwind utility merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert camelCase or PascalCase to formatted string
export function formatEnumString(str: string) {
  // Add a space before any uppercase letter, then trim whitespace
  return str.replace(/([A-Z])/g, " $1").trim();
}

// Format price display for sliders/filters
export function formatPriceValue(value: number | null, isMin: boolean) {
  if (value === null || value === 0)
    return isMin ? "Any Min Price" : "Any Max Price";
  if (value >= 1000) {
    const kValue = value / 1000;
    return isMin ? `$${kValue}k+` : `<$${kValue}k`;
  }
  return isMin ? `$${value}+` : `<$${value}`;
}

// Clean search/filter params before sending to API
export function cleanParams(params: Record<string, any>): Record<string, any> {
  const cleanedEntries = Object.entries(params).filter(([_, value]) => {
    if (value === null || value === undefined || value === "any" || value === "") {
      return false; // Filter out null, undefined, "any", and empty strings
    }
    if (Array.isArray(value) && value.length === 0) {
      return false; // Filter out empty arrays
    }
    return true;
  });
  return Object.fromEntries(cleanedEntries);
}

// Toast wrapper for async mutations
type MutationMessages = {
  success?: string;
  error?: string; // Made optional to allow for silent errors if needed
};

export const withToast = async <T>(
  mutationPromise: Promise<T>,
  messages: MutationMessages
) => {
  const { success, error } = messages;

  try {
    const result = await mutationPromise;
    if (success) toast.success(success);
    return result;
  } catch (err) {
    // Default error message can be provided
    const errorMessage = error || "An unexpected error occurred.";
    toast.error(errorMessage);
    throw err; // Re-throw the error for RTK Query to handle
  }
};

// Clerk version of user creation after sign-up
// NOTE: `fetchWithBQ` is an RTK Query utility that already includes auth headers
export const createNewUserInDatabase = async (
  user: UserResource,
  _jwtToken: string | null | undefined, // Kept for signature compatibility but marked as unused
  userRole: "tenant" | "manager",
  fetchWithBQ: (args: { url: string; method: string; body: any }) => Promise<any>
) => {
  const createEndpoint = userRole === "manager" ? "/managers" : "/tenants";

  const createUserResponse = await fetchWithBQ({
    url: createEndpoint,
    method: "POST",
    body: {
      clerkId: user.id,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      email: user.primaryEmailAddress?.emailAddress ?? "",
      phoneNumber: user.primaryPhoneNumber?.phoneNumber ?? "",
    },
    // No 'headers' needed here, as `fetchBaseQuery`'s `prepareHeaders` handles authorization
  });

  if (createUserResponse.error) {
    // This will be caught by the `withToast` wrapper or the calling `queryFn`
    throw new Error("Failed to create user record in the database.");
  }

  return createUserResponse;
};