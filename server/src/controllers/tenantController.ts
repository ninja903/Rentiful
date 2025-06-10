import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const primsa = new PrismaClient();

export const getTenant = async (req: Request, res: Response): Promise<void> => {
    try {
        const { clerkUserId } = req.params;
        const tenant = await primsa.tenant.findUnique({
            where: { clerkUserId },
            include: {
                favorites: true,
            }
        });

    }
}