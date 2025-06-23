import express from 'express';
import { getManager, createManager, updateManager, getManagerProperties } from '../controllers/managercontrollers';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get("/:clerkUserId", getManager);
router.put("/:clerkUserId", updateManager)
router.get("/:clerkUserId/properties",getManagerProperties)
router.post("/", createManager);
  
export default router;