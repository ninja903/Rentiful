// types/express.d.ts

// Import the official 'AuthObject' type from the Clerk SDK
import { AuthObject } from "@clerk/clerk-sdk-node";

// This block of code is "declaration merging".
// It tells TypeScript to add our 'auth' property to the existing 'Request' interface.
declare global {
  namespace Express {
    interface Request {
      // The `requireAuth` middleware guarantees that `auth` will be present.
      // If you were using an optional auth middleware, you would use `auth?: AuthObject`.
      auth: AuthObject;
    }
  }
}