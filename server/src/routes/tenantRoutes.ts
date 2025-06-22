
import express from "express";
import { getTenant, createTenant, updateTenant } from "../controllers/tenantController";


const router = express.Router();

router.get("/:clerkUserId", getTenant);
router.put("/:clerkUserId", updateTenant)
router.post("/", createTenant);

export default router;