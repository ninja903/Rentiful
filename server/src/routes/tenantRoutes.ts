
import express from "express";
import { getTenant, createTenant } from "../controllers/tenantController";


const router = express.Router();

router.get("/:clerkId", getTenant);
router.post("/", createTenant);

export default router;