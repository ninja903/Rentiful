// src/middleware/authMiddleware.ts

import { requireAuth } from "@clerk/express";
import { Request, Response, NextFunction, RequestHandler } from "express";

type AuthenticatedRequest = Request & {
  auth: {
    user?: {
      publicMetadata: {
        role?: "manager" | "tenant" | string;
      };
    };
  };
};

export const authMiddleware = (allowedRoles: string[]): RequestHandler[] => {
  return [
    requireAuth(),

    (req, res, next) => {
      const authReq = req as AuthenticatedRequest;
      const userRole = authReq.auth?.user?.publicMetadata?.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        // CORRECTED: 'return' has been removed.
        // This sends the response and ends the request. The function implicitly returns void.
        res.status(403).json({
          message: "Access Denied: You do not have permission to access this resource.",
        });
        // You can add an explicit 'return;' here if your linter prefers it,
        // but it's not necessary as no code will execute after res.json().
        return; 
      }

      // If the role check passes, continue to the next middleware.
      next();
    },
  ];
};