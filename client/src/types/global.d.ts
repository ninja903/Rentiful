// types/global.d.ts

import type { Clerk } from "@clerk/clerk-js";

declare global {
  interface Window {
    Clerk: Clerk | undefined;
  }
}