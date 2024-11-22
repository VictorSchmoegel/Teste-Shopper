import { Request, Response } from "express";
import { estimateRide } from "../services/ride.service";
import { validateRideRequest } from "../utils/validators";

export const estimateRideController = async (req: Request, res: Response) => {
  try {
    const { customer_id, origin, destination } = req.body;
    validateRideRequest(customer_id, origin, destination);
    const result = await estimateRide(origin, destination);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error_code: 'INVALID_DATA', error_description: error.message });
  }
};