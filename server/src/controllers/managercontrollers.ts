

import { Request, Response } from "express";
import { prisma } from "../lib/prisma"; // 1. Use the shared Prisma instance
import { Prisma } from "@prisma/client";   // 2. Import Prisma types for error handling

export const getManager = async (req: Request, res: Response): Promise<void> => {
  try {

    const { userId: clerkUserId } = req.auth;

    const manager = await prisma.manager.findUnique({
      where: { clerkUserId }, // Use the schema's field name
    });

    if (manager) {
      res.json(manager);
    } else {
      res.status(404).json({ message: "Manager profile not found in database." });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Error retrieving manager.", error: error.message });
  }
};

export const createManager = async (req: Request, res: Response): Promise<void> => {
  try {
 
    const { userId: clerkUserId } = req.auth;
    const { name, email, phoneNumber } = req.body;
    if (!name || !email || !phoneNumber) {
      res.status(400).json({ message: "Request body must contain name, email, and phoneNumber." });
      return;
    }

    const manager = await prisma.manager.create({
      data: {
        clerkUserId, // From auth session
        name,
        email,
        phoneNumber,
      },
    });

    res.status(201).json(manager);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      res.status(409).json({ message: "A manager with this Clerk ID or email already exists." });
    } else {
      res.status(500).json({ message: "Error creating manager.", error: error.message });
    }
  }
};