import { Request, Response } from "express";
import { estimateRide } from "../services/ride.service";
import { validateRideRequest } from "../utils/validators";
import { query } from '../db'

export const estimateRideController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer_id, origin, destination } = req.body;

    // Validar os dados da requisição
    const validationError = validateRideRequest(customer_id, origin, destination);
    if (validationError) {
      res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: validationError,
      });
      return;
    }

    // Estimar viagem
    const result = await estimateRide(origin, destination);
    res.status(200).json({ message: 'Operação realizada com sucesso', result });
  } catch (error: any) {
    console.error('Erro no controlador estimateRide:', error.message);
    res.status(500).json({
      error_code: 'INTERNAL_ERROR',
      error_description: 'Erro interno no servidor.',
    });
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
      `INSERT INTO rides (customer_id, data, origin, destination, distance, duration, driver_id, driver_name, value)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, new Date(), origin, destination, distance, duration, driver.id, driver.name, value]
    );

    res.status(200).json({ message: 'Operação realizada com sucesso', success: true });
  } catch (error: any) {
    console.error('Erro ao confirmar viagem:', error.message);
    res.status(500).json({
      error_code: 'INTERNAL_ERROR',
      error_description: 'Erro interno no servidor.',
    });
  }
};

export const getRidesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer_id } = req.params;
    const { driver_id } = req.query;

    if (!customer_id) {
      res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'O ID do cliente não pode estar em branco',
      });
      return;
    }

    if (driver_id) {
      const [driverExists]: any = await query('SELECT * FROM drivers WHERE id = ?', [driver_id]);
      if (!driverExists.length) {
        res.status(400).json({
          error_code: 'DRIVER_NOT_FOUND',
          error_description: 'Motorista inválido',
        });
        return;
      }
    }

    const sql = `
      SELECT r.id, r.data, r.origin, r.destination, r.distance, r.duration, 
      r.value, d.id AS driver_id, d.name AS driver_name
      FROM rides r
      INNER JOIN drivers d ON r.driver_id = d.id
      WHERE r.customer_id = ?
      ${driver_id ? "AND r.driver_id = ?" : ""}
      ORDER BY r.data DESC
    `;
    const params = driver_id ? [customer_id, driver_id] : [customer_id];
    const [rides]: any = await query(sql, params);

    if (!rides.length) {
      res.status(404).json({
        error_code: 'NO_RIDES_FOUND',
        error_description: 'Nenhum registro encontrado',
      });
      return;
    }

    const formattedRides = rides.map((ride: any) => ({
      id: ride.id,
      date: ride.data,
      origin: ride.origin,
      destination: ride.destination,
      distance: ride.distance,
      duration: ride.duration,
      driver: {
        id: ride.driver_id,
        name: ride.driver_name,
      },
      value: parseFloat(ride.value),
    }));
    res.status(200).json({
      message: 'Operação realizada com sucesso',
      customer_id,
      rides: formattedRides,
    });
  } catch (error: any) {
    console.error('Erro ao listar viagens', error.message);
    res.status(500).json({
      error_code: 'INTERNAL_ERROR',
      error_description: 'Erro interno no servidor.',
    });
  }
};

export const getDriversController = async (req: Request, res: Response): Promise<void> => {
  try {
    const [drivers]: any = await query('SELECT id, name FROM drivers');
    if (!drivers.length) {
      res.status(404).json({
        error_code: 'NO_DRIVERS_FOUND',
        error_description: 'Nenhum motorista encontrado',
      });
      return;
    }

    res.status(200).json({
      drivers: drivers.map((driver: any) => ({
        id: driver.id,
        name: driver.name,
      })),
    });
  } catch (error: any) {
    console.error('Erro ao listar motoristas:', error.message);
    res.status(500).json({
      error_code: 'INTERNAL_ERROR',
      error_description: 'Erro interno no servidor.',
    });
  }
};