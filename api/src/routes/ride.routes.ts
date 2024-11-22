import { Router } from "express";
import { estimateRideController } from "../controllers/ride.controller";

const router = Router();

router.post('/ride/estimate', estimateRideController);

export default router;