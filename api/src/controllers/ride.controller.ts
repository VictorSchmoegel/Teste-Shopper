import { Request, Response } from "express";
import { estimateRide } from "../services/ride.service";
import { validateRideRequest } from "../utils/validators";
import { query } from '../db'

export const estimateRideController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer_id, origin, destination } = req.body;
    validateRideRequest(customer_id, origin, destination);
    const result = await estimateRide(origin, destination);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error_code: 'INVALID_DATA', error_description: error.message });
  }
};

export const confirmRideController = async (req: Request, res: Response): Promise<void> => {
  const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

  try {
    if (!customer_id || !origin || !destination || !driver || !distance) {
      res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Os dados fornecidos no corpo da requisição são inválidos',
      });
      return;
    }

    if (origin.trim() === destination.trim()) {
      res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Os dados fornecidos no corpo da requisição são inválidos',
      });
      return;
    }

    // Consulta motorista
    const [driverResult]: any = await query('SELECT * FROM drivers WHERE id = ?', [driver.id]);

    if (!driverResult.length) {
      res.status(404).json({
        error_code: 'DRIVER_NOT_FOUND',
        error_description: 'Motorista não encontrado',
      });
      return;
    }

    const driverData = driverResult[0];
    if (distance < driverData.min_km) {
      res.status(406).json({
        error_code: 'INVALID_DISTANCE',
        error_description: 'Quilometragem inválida para o motorista',
      });
      return;
    }

    // Salvar a viagem no banco de dados
    await query(
      `INSERT INTO rides (customer_id, origin, destination, distance, duration, driver_id, driver_name, value)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, origin, destination, distance, duration, driver.id, driver.name, value]
    );

    res.status(200).json({ message: 'Operação realzada com sucesso', success: true });
  } catch (error: any) {
    console.error('Erro ao confirmar viagem:', error.message);
    res.status(500).json({
      error_code: 'INTERNAL_ERROR',
      error_description: 'Erro interno no servidor.',
    });
  }
};