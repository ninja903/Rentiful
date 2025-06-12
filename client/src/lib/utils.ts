import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { UserResource } from "@clerk/types";

// 1. Import the `BaseQueryApi` type, which we will need.
import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";

// ... (cn, formatEnumString, etc. functions are correct and unchanged)
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatEnumString(str: string) { return str.replace(/([A-Z])/g, " $1").trim(); }
export function formatPriceValue(value: number | null, isMin: boolean) { if (value === null || value === 0) return isMin ? "Any Min Price" : "Any Max Price"; if (value >= 1000) { const kValue = value / 1000; return isMin ? `$${kValue}k+` : `<$${kValue}k`; } return isMin ? `$${value}+` : `<$${value}`; }
export function cleanParams(params: Record<string, any>): Record<string, any> { const cleanedEntries = Object.entries(params).filter(([_, value]) => { if (value === null || value === undefined || value === "any" || value === "") { return false; } if (Array.isArray(value) && value.length === 0) { return false; } return true; }); return Object.fromEntries(cleanedEntries); }
export const withToast = async <T>(mutationPromise: Promise<T>, messages: { success?: string; error?: string; }) => { const { success, error } = messages; try { const result = await mutationPromise; if (success) toast.success(success); return result; } catch (err) { const errorMessage = error || "An unexpected error occurred."; toast.error(errorMessage); throw err; } };


// 2. This type alias is now correct and describes the function object.
type FetchWithBq = BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
>;

// Clerk version of user creation after sign-up
export const createNewUserInDatabase = async (
  user: UserResource,
  _jwtToken: string | null | undefined,
  userRole: "tenant" | "manager",
  fetchWithBQ: FetchWithBq,
  // 3. FIX: Add the two missing parameters that `fetchWithBQ` needs.
  api: BaseQueryApi,
  extraOptions: {}
) => {
  const createEndpoint = userRole === "manager" ? "/managers" : "/tenants";

  const requestArgs = {
    url: createEndpoint,
    method: "POST",
    body: {
      clerkUserId: user.id,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      email: user.primaryEmailAddress?.emailAddress ?? "",
      phoneNumber: user.primaryPhoneNumber?.phoneNumber ?? "",
    },
  };

  // 4. FIX: Call `fetchWithBQ` with all three required arguments.
  const createUserResponse = await fetchWithBQ(requestArgs, api, extraOptions);

  if (createUserResponse.error) {
    throw new Error("Failed to create user record in the database.");
  }

  return createUserResponse;
};