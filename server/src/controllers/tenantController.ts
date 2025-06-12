import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response): Promise<void> => {
    try {
        const { clerkUserId } = req.params;
        const tenant = await prisma.tenant.findUnique({
            where: { clerkUserId },
            include: {
                favorites: true,
            }
        });

        if (tenant) {
            res.json(tenant)
        } else {
            res.status(404).json({message: "tenant not found"})
        }
    } catch (error: any) {
        res.status(500).json({message: `Error retrieving tenant: ${error.message}`})
    }
}

export const createTenant = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { clerkUserId, name, email, phoneNumber } = req.body;
  
      const tenant = await prisma.tenant.create({
        data: {
          clerkUserId,
          name,
          email,
          phoneNumber,
        },
      });
  
      res.status(201).json(tenant);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error creating tenant: ${error.message}` });
    }
  };