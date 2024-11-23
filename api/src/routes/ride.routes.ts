import { Router } from "express";
import { estimateRideController, confirmRideController } from "../controllers/ride.controller";

const router = Router();

router.post('/ride/estimate', estimateRideController);
router.patch('/ride/confirm', confirmRideController);

export default router;