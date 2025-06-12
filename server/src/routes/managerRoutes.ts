import express from 'express';
import { getManager, createManager } from '../controllers/managercontrollers';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get("/:clerlkUserId", getManager);

// Do the same for the create route
router.post("/", createManager);
  
export default router;