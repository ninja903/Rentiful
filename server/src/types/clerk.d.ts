// /your-backend-project/types/clerk.d.ts
declare module "@clerk/clerk-sdk-node" {
    interface UserPublicMetadata {
      role?: "manager" | "tenant";
    }
  }