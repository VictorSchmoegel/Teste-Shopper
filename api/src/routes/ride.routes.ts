import { Router } from "express";
import { estimateRideController, confirmRideController, getRidesController } from "../controllers/ride.controller";

const router = Router();

router.post('/ride/estimate', estimateRideController);
router.patch('/ride/confirm', confirmRideController);
router.get("/ride/:customer_id", getRidesController);

export default router;