import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createNewUserInDatabase } from "@/lib/utils";
import { Manager, Tenant } from "@/types/prismaTypes";
import type { UserResource } from "@clerk/types";

export interface AuthUser {
    clerkInfo: UserResource; // Full Clerk user object
    userInfo: Tenant | Manager; // Either a tenant or manager from DB
    userRole: "tenant" | "manager";
}

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
        prepareHeaders: async (headers) => {

            if (typeof window !== "undefined" && window.Clerk?.session) {
                const token = await window.Clerk.session.getToken();
                if (token) {
                    headers.set("Authorization", `Bearer ${token}`);
                }
            }
            return headers;
        },
    }),
    reducerPath: "api",
    tagTypes: ["AuthUser", "Managers", "Tenants"],
    endpoints: (build) => ({
  
        getAuthUser: build.query<AuthUser, void>({
            queryFn: async (_, _queryApi, _extraOptions, fetchWithBQ) => {
                try {
         
                    if (typeof window === "undefined" || !window.Clerk?.user) {
                        return { error: "Clerk user not available" };
                    }

                    const clerkUser = window.Clerk.user;
                    const clerkToken = await window.Clerk.session?.getToken();

                    const userRoleFromClerk = clerkUser.publicMetadata.role;

                    if (userRoleFromClerk !== "tenant" && userRoleFromClerk !== "manager") {
                        return { error: `Invalid user role detected: ${userRoleFromClerk}` };
                    }
  
                    const userRole = userRoleFromClerk;

                    const endpoint =
                        userRole === "manager"
                            ? `/managers/${clerkUser.id}`
                            : `/tenants/${clerkUser.id}`;

                    let userDetailsResponse = await fetchWithBQ(endpoint);

                    if (
                        userDetailsResponse.error &&
                        userDetailsResponse.error.status === 404
                    ) {
                        // This call is now type-safe because of the guard above.
                        userDetailsResponse = await createNewUserInDatabase(
                            clerkUser,
                            clerkToken,
                            userRole, // No more error here!
                            fetchWithBQ,
                            _queryApi,
                            _extraOptions
                        );
                    }

                    if (userDetailsResponse.error) {
                        throw userDetailsResponse.error;
                    }

                    return {
                        data: {
                            clerkInfo: { ...clerkUser } as UserResource,
                            userInfo: userDetailsResponse.data as Tenant | Manager,
                            userRole,
                        },
                    };
                } catch (error: any) {
                    return {
                        error:
                            error.data?.message ||
                            error.message ||
                            "Could not fetch user details",
                    };
                }
            },
            providesTags: ["AuthUser"],
        }),

        updateTenantSettings: build.mutation
            <Tenant,
                { clerkUserId: string } & Partial<Tenant>
            >({
                query: ({ clerkUserId, ...updatedTenant }) => ({
                    url: `tenants/${clerkUserId}`,
                    method: "PUT",
                    body: updatedTenant,
                }),
                invalidatesTags: (result) => [{ type: "Tenants", id: result?.id }],
            }),
            updateManagerSettings: build.mutation
            <Manager,
                { clerkUserId: string } & Partial<Manager>
            >({
                query: ({ clerkUserId, ...updatedManager }) => ({
                    url: `managers/${clerkUserId}`,
                    method: "PUT",
                    body: updatedManager,
                }),
                invalidatesTags: (result) => [{ type: "Managers", id: result?.id }],
         })
    }),
});

export const {
    useGetAuthUserQuery,
    useUpdateTenantSettingsMutation,
    useUpdateManagerSettingsMutation,
} = api;