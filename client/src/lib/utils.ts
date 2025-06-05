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
  return str.replace(/([A-Z])/g, " $1").trim();
}

// Format price display
export function formatPriceValue(value: number | null, isMin: boolean) {
  if (value === null || value === 0)
    return isMin ? "Any Min Price" : "Any Max Price";
  if (value >= 1000) {
    const kValue = value / 1000;
    return isMin ? `$${kValue}k+` : `<$${kValue}k`;
  }
  return isMin ? `$${value}+` : `<$${value}`;
}

// Clean search/filter params
export function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== "any" &&
        value !== "" &&
        (Array.isArray(value) ? value.some((v) => v !== null) : value !== null)
    )
  );
}

// Toast wrapper for async mutations
type MutationMessages = {
  success?: string;
  error: string;
};

export const withToast = async <T>(
  mutationFn: Promise<T>,
  messages: Partial<MutationMessages>
) => {
  const { success, error } = messages;

  try {
    const result = await mutationFn;
    if (success) toast.success(success);
    return result;
  } catch (err) {
    if (error) toast.error(error);
    throw err;
  }
};

// Clerk version of user creation after sign-up
export const createNewUserInDatabase = async (
  user: UserResource,
  jwtToken: string,
  userRole: "tenant" | "manager",
  fetchWithBQ: any
) => {
  const createEndpoint = userRole === "manager" ? "/managers" : "/tenants";

  const createUserResponse = await fetchWithBQ({
    url: createEndpoint,
    method: "POST",
    body: {
      clerkId: user.id,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      email: user.emailAddresses[0]?.emailAddress || "",
      phoneNumber: user.phoneNumbers[0]?.phoneNumber || "",
    },
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (createUserResponse.error) {
    throw new Error("Failed to create user record in database");
  }

  return createUserResponse;
};
