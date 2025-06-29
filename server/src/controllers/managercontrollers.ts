

import { Request, Response } from "express";
import { prisma } from "../lib/prisma"; // 1. Use the shared Prisma instance
import { Prisma } from "@prisma/client";   // 2. Import Prisma types for error handling
import { wktToGeoJSON } from "@terraformer/wkt";



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

export const updateManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { clerkUserId } = req.params;
    const { name, email, phoneNumber } = req.body;

    const updateManager = await prisma.manager.update({
      where: { clerkUserId },
      data: {
        name,
        email,
        phoneNumber,
      },
    });

    res.json(updateManager);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating manager: ${error.message}` });
  }
};

export const getManagerProperties = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { clerkUserId } = req.params;
    const properties = await prisma.property.findMany({
      where: { managerClerkId: clerkUserId },
      include: {
        location: true,
      },
    });

    const propertiesWithFormattedLocation = await Promise.all(
      properties.map(async (property) => {
        const coordinates: { coordinates: string }[] =
          await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

        const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
        const longitude = geoJSON.coordinates[0];
        const latitude = geoJSON.coordinates[1];

        return {
          ...property,
          location: {
            ...property.location,
            coordinates: {
              longitude,
              latitude,
            },
          },
        };
      })
    );

    res.json(propertiesWithFormattedLocation);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error retrieving manager properties: ${err.message}` });
  }
};