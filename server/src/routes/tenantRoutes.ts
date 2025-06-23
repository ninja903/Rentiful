
import express from "express";
import { getTenant, createTenant, updateTenant, getCurrentResidences, addFavoriteProperty, removeFavoriteProperty } from "../controllers/tenantController";


const router = express.Router();

router.get("/:clerkUserId", getTenant);
router.put("/:clerkUserId", updateTenant)
router.post("/", createTenant);
router.get("/:clerkUserId/current-residences",getCurrentResidences)
router.post("/:clerkUserId/favorites/:propertyId", addFavoriteProperty);
router.delete("/:clerkUserId/favorites/:propertyId", removeFavoriteProperty);

export default router;