import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createNewUserInDatabase } from "@/lib/utils";
import { Manager, Tenant } from "@/types/prismaTypes";



export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
        prepareHeaders: async (headers) => {
            if (typeof window !== "undefined" && window.Clerk?.sesssion) {
                const token = await window.Clerk.sesssion.getToken();
                if (token) {
                    headers.set("Authorization", `Bearer ${token}`)
                }
            }
            return headers;
        }
    }),
    reducerPath: "api",
    tagTypes: ["AuthUser"],
    endpoints: (build) => ({
        getAuthUser: build.query<User, void>({
            queryFn: async (_, _queryApi, _extraOptions, fetchWithBQ) => {
                try {
                    if (typeof window === "undefined" || !window.Clerk.user) {
                        return { error: "clerk user not available" };
                    }

                    const clerkUser = window.Clerk.user;
                    const clerkToken = await window.Clerk.sesssion.getToken();

                    const userRole = clerkUser.publicMetadata.role as string;
                    if (!userRole) {
                        return { error: "user role not found in clekr public metadata." };
                    }
                    const endpoints =
                        userRole === "manager"
                            ? `/manager/${clerkUser.id}`
                            : `/tenants/${clerkUser.id}`;
                    
                    let userDetailsResponse = await fetchWithBQ(endpoints);

                    if (
                        userDetailsResponse.error &&
                        userDetailsResponse.error.status === 404
                    ) {
                        userDetailsResponse = await createNewUserInDatabase(
                            clerkUser,
                            clerkToken,
                            userRole,
                            fetchWithBQ
                        );
                    }

                    if (userDetailsResponse.error) {
                        throw userDetailsResponse.error;
                    }
                    return {
                        data: {
                            clerkInfo: { ...clerkUser } as userResource,
                            userInfo: userDetailsResponse.data as Tenant | Manager,
                            userRole,
                        },
                    };

                }  catch(error: any){
                    return {
                        error:
                            error.data?.message ||
                            error.message ||
                            "could not fetch user details"
                    };
                }
            },
            providesTags: ["AuthUser"],
        }),
    }),
});
