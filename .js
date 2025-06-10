import { cleanParams, createNewUserInDatabase, withToast } from "@/lib/utils";
import {
  Application,
  Lease,
  Manager,
  Payment,
  Property,
  Tenant,
} from "@/types/prismaTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FiltersState } from ".";
import type { UserResource } from "@clerk/types";

// Define a new type for the authenticated user response
export interface AuthUser {
  clerkInfo: UserResource;
  userInfo: Tenant | Manager;
  userRole: "tenant" | "manager" | string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      // This logic runs on the client side where the Clerk instance is available.
      // For SSR scenarios, you might need a different strategy if you pre-fetch data.
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
  tagTypes: [
    "Managers",
    "Tenants",
    "Properties",
    "PropertyDetails",
    "Leases",
    "Payments",
    "Applications",
    "AuthUser",
  ],
  endpoints: (build) => ({
    getAuthUser: build.query < AuthUser, void> ({
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {

          if (typeof window === "undefined" || !window.Clerk?.user) {

            return { error: "Clerk user not available." };
          }

          const clerkUser = window.Clerk.user;
          const clerkToken = await window.Clerk.session?.getToken();

          // Assumes the role is stored in publicMetadata. Adjust if needed.
          const userRole = clerkUser.publicMetadata.role as string;
          if (!userRole) {
            return { error: "User role not found in Clerk public metadata." };
          }

          const endpoint =
            userRole === "manager"
              ? `/managers/${clerkUser.id}`
              : `/tenants/${clerkUser.id}`;

          let userDetailsResponse = await fetchWithBQ(endpoint);

          // If user doesn't exist in our DB, create them.
          // This preserves the original logic.
          // NOTE: Your `createNewUserInDatabase` utility must be updated to handle a Clerk user object.
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
              "Could not fetch user data",
          };
        }
      },
      providesTags: ["AuthUser"],
    }),


    getProperties: build.query <
      Property[],
    Partial<FiltersState> & { favoriteIds?: number[] }
    > ({
      query: (filters) => {
        const params = cleanParams({
          location: filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          beds: filters.beds,
          baths: filters.baths,
          propertyType: filters.propertyType,
          squareFeetMin: filters.squareFeet?.[0],
          squareFeetMax: filters.squareFeet?.[1],
          amenities: filters.amenities?.join(","),
          availableFrom: filters.availableFrom,
          favoriteIds: filters.favoriteIds?.join(","),
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0],
        });

        return { url: "properties", params };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Properties" as const, id })),
            { type: "Properties", id: "LIST" },
          ]
          : [{ type: "Properties", id: "LIST" }],
    }),

    getProperty: build.query < Property, number> ({
      query: (id) => `properties/${id}`,
      providesTags: (result, error, id) => [{ type: "PropertyDetails", id }],
    }),


  getTenant: build.query < Tenant, string > ({
    query: (userId) => `tenants/${userId}`,
    providesTags: (result) => [{ type: "Tenants", id: result?.id }],
  }),

  getCurrentResidences: build.query < Property[], string > ({
    query: (userId) => `tenants/${userId}/current-residences`,
    providesTags: (result) =>
      result
        ? [
          ...result.map(({ id }) => ({ type: "Properties" as const, id })),
          { type: "Properties", id: "LIST" },
        ]
        : [{ type: "Properties", id: "LIST" }],
  }),

  updateTenantSettings: build.mutation <
Tenant,
  { userId: string } & Partial < Tenant >
    > ({
    query: ({ userId, ...updatedTenant }) => ({
      url: `tenants/${userId}`,
      method: "PUT",
      body: updatedTenant,
    }),
    invalidatesTags: ["AuthUser", (result) => [{ type: "Tenants", id: result?.id }]],
    async onQueryStarted(_, { queryFulfilled }) {
      await withToast(queryFulfilled, {
        success: "Settings updated successfully!",
        error: "Failed to update settings.",
      });
    },
  }),

  addFavoriteProperty: build.mutation <
Tenant,
  { userId: string; propertyId: number }
  > ({
    query: ({ userId, propertyId }) => ({
      url: `tenants/${userId}/favorites/${propertyId}`,
      method: "POST",
    }),
    invalidatesTags: ["AuthUser", { type: "Properties", id: "LIST" }],
    async onQueryStarted(_, { queryFulfilled }) {
      await withToast(queryFulfilled, {
        success: "Added to favorites!",
        error: "Failed to add to favorites.",
      });
    },
  }),

  removeFavoriteProperty: build.mutation <
Tenant,
  { userId: string; propertyId: number }
  > ({
    query: ({ userId, propertyId }) => ({
      url: `tenants/${userId}/favorites/${propertyId}`,
      method: "DELETE",
    }),
    invalidatesTags: ["AuthUser", { type: "Properties", id: "LIST" }],
    async onQueryStarted(_, { queryFulfilled }) {
      await withToast(queryFulfilled, {
        success: "Removed from favorites!",
        error: "Failed to remove from favorites.",
      });
    },
  }),

  // manager related endpoints
  getManagerProperties: build.query < Property[], string > ({
    query: (userId) => `managers/${userId}/properties`,
    providesTags: (result) =>
      result
        ? [
          ...result.map(({ id }) => ({ type: "Properties" as const, id })),
          { type: "Properties", id: "LIST" },
        ]
        : [{ type: "Properties", id: "LIST" }],
  }),

  updateManagerSettings: build.mutation <
Manager,
  { userId: string } & Partial < Manager >
    > ({
    query: ({ userId, ...updatedManager }) => ({
      url: `managers/${userId}`,
      method: "PUT",
      body: updatedManager,
    }),
    invalidatesTags: ["AuthUser", (result) => [{ type: "Managers", id: result?.id }]],
    async onQueryStarted(_, { queryFulfilled }) {
      await withToast(queryFulfilled, {
        success: "Settings updated successfully!",
        error: "Failed to update settings.",
      });
    },
  }),

  createProperty: build.mutation < Property, FormData > ({
    query: (newProperty) => ({
      url: `properties`,
      method: "POST",
      body: newProperty,
    }),
    invalidatesTags: [{ type: "Properties", id: "LIST" }],
    async onQueryStarted(_, { queryFulfilled }) {
      await withToast(queryFulfilled, {
        success: "Property created successfully!",
        error: "Failed to create property.",
      });
    },
  }),

  // lease related enpoints
  getLeases: build.query < Lease[], number > ({
    query: () => "leases",
    providesTags: ["Leases"],
  }),

  getPropertyLeases: build.query < Lease[], number > ({
    query: (propertyId) => `properties/${propertyId}/leases`,
    providesTags: ["Leases"],
  }),

  getPayments: build.query < Payment[], number > ({
    query: (leaseId) => `leases/${leaseId}/payments`,
    providesTags: ["Payments"],
  }),

  // application related endpoints
  getApplications: build.query <
Application[],
  { userId?: string; userType?: string }
  > ({
    query: (params) => {
      const queryParams = new URLSearchParams();
      if (params.userId) {
        queryParams.append("userId", params.userId.toString());
      }
      if (params.userType) {
        queryParams.append("userType", params.userType);
      }

      return `applications?${queryParams.toString()}`;
    },
    providesTags: ["Applications"],
  }),

  updateApplicationStatus: build.mutation <
  Application & { lease?: Lease },
  { id: number; status: string }
  > ({
    query: ({ id, status }) => ({
      url: `applications/${id}/status`,
      method: "PUT",
      body: { status },
    }),
    invalidatesTags: ["Applications", "Leases"],
    async onQueryStarted(_, { queryFulfilled }) {
      await withToast(queryFulfilled, {
        success: "Application status updated successfully!",
        error: "Failed to update application settings.",
      });
    },
  }),

  createApplication: build.mutation < Application, Partial < Application >> ({
    query: (body) => ({
      url: `applications`,
      method: "POST",
      body: body,
    }),
    invalidatesTags: ["Applications"],
    async onQueryStarted(_, { queryFulfilled }) {
      await withToast(queryFulfilled, {
        success: "Application created successfully!",
        error: "Failed to create applications.",
      });
    },
  }),
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation,
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useGetCurrentResidencesQuery,
  useGetManagerPropertiesQuery,
  useCreatePropertyMutation,
  useGetTenantQuery,
  useAddFavoritePropertyMutation,
  useRemoveFavoritePropertyMutation,
  useGetLeasesQuery,
  useGetPropertyLeasesQuery,
  useGetPaymentsQuery,
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useCreateApplicationMutation,
} = api