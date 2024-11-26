import { estimateRideController, confirmRideController, getRidesController } from '../../controllers/ride.controller';
import { estimateRide } from '../../services/ride.service';
import { validateRideRequest } from '../../utils/validators';
import { Request, Response } from 'express';
import { query, pool } from '../../db';

// Mocks
jest.mock('../../services/ride.service', () => ({
  estimateRide: jest.fn(),
}));

jest.mock('../../utils/validators', () => ({
  validateRideRequest: jest.fn(),
}));

function mockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe('estimateRideController', () => {
  let req: Partial<Request>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = mockResponse();
    jest.clearAllMocks();
  });

  it('deve retornar erro 400 se os dados forem inválidos', async () => {
    (validateRideRequest as jest.Mock).mockReturnValue('Dados inválidos');

    req.body = { customer_id: '', origin: '', destination: '' };

    await estimateRideController(req as Request, res as Response);

    expect(validateRideRequest).toHaveBeenCalledWith('', '', '');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error_code: 'INVALID_DATA',
      error_description: 'Dados inválidos',
    });
  });

  it('deve retornar erro 500 se ocorrer um erro inesperado', async () => {
    (validateRideRequest as jest.Mock).mockReturnValue(null);
    (estimateRide as jest.Mock).mockRejectedValue(new Error('Erro inesperado'));

    req.body = { customer_id: '1', origin: 'A', destination: 'B' };

    await estimateRideController(req as Request, res as Response);

    expect(validateRideRequest).toHaveBeenCalledWith('1', 'A', 'B');
    expect(estimateRide).toHaveBeenCalledWith('A', 'B');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error_code: 'INTERNAL_ERROR',
      error_description: 'Erro interno no servidor.',
    });
  });

  it('deve retornar sucesso (200) com a estimativa da viagem', async () => {
    (validateRideRequest as jest.Mock).mockReturnValue(null);
    (estimateRide as jest.Mock).mockResolvedValue({
      distance: 10,
      duration: 15,
      value: 50,
    });

    req.body = { customer_id: '1', origin: 'A', destination: 'B' };

    await estimateRideController(req as Request, res as Response);

    expect(validateRideRequest).toHaveBeenCalledWith('1', 'A', 'B');
    expect(estimateRide).toHaveBeenCalledWith('A', 'B');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Operação realizada com sucesso',
      result: {
        distance: 10,
        duration: 15,
        value: 50,
      },
    });
  });
});

describe('confirmRideController Tests', () => {
  let req: Partial<Request>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    req = { body: {} };
    res = mockResponse();
  });

  it('deve retornar erro 400 se os dados forem inválidos', async () => {
    req.body = { customer_id: '', origin: '', destination: '', driver: {}, distance: 0 };

    await confirmRideController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error_code: 'INVALID_DATA',
      error_description: 'Os dados fornecidos no corpo da requisição são inválidos',
    });
  });

  it('deve retornar erro 404 se o motorista não for encontrado', async () => {
    req.body = {
      customer_id: 1,
      origin: 'A',
      destination: 'B',
      driver: { id: 9999 }, // ID que não existe
      distance: 10,
    };

    await confirmRideController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error_code: 'DRIVER_NOT_FOUND',
      error_description: 'Motorista não encontrado',
    });
  });

  it('deve retornar erro 406 se a distância for menor que a mínima aceita pelo motorista', async () => {
    req.body = {
      customer_id: 1,
      origin: 'A',
      destination: 'B',
      driver: { id: 2 }, // Dominic Toretto (min_km = 5)
      distance: 3,       // Distância menor que min_km
    };

    await confirmRideController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(406);
    expect(res.json).toHaveBeenCalledWith({
      error_code: 'INVALID_DISTANCE',
      error_description: 'Quilometragem inválida para o motorista',
    });
  });

  it('deve retornar sucesso (200) ao confirmar a viagem', async () => {
    req.body = {
      customer_id: 1,
      origin: 'A',
      destination: 'B',
      driver: { id: 2, name: 'Dominic Toretto' }, // Motorista válido
      distance: 10,
      duration: 20,
      value: 100,
    };

    await confirmRideController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Operação realizada com sucesso',
      success: true,
    });

    // Verificar no banco se a viagem foi salva corretamente
    const [rides] = await query('SELECT * FROM rides WHERE customer_id = ?', [1]);
    expect(rides).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          origin: 'A',
          destination: 'B',
          driver_name: 'Dominic Toretto',
        }),
      ])
    );
  });

  it('deve retornar erro 400 se a origem e o destino forem iguais', async () => {
    req.body = {
      customer_id: 1,
      origin: 'A',
      destination: 'A',
      driver: { id: 2 },
      distance: 10,
    };

    await confirmRideController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error_code: 'INVALID_DATA',
      error_description: 'Os dados fornecidos no corpo da requisição são inválidos',
    });
  });

  it('deve retornar erro 500 em caso de falha inesperada', async () => {
    // Simula uma exceção ao executar a query no banco de dados
    jest.spyOn(require('../../db'), 'query').mockRejectedValue(new Error('Erro inesperado no banco de dados'));

    req.body = {
      customer_id: 1,
      origin: 'A',
      destination: 'B',
      driver: { id: 2 },
      distance: 10,
    };

    await confirmRideController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error_code: 'INTERNAL_ERROR',
      error_description: 'Erro interno no servidor.',
    });

    // Restaurar o comportamento original da função mockada
    jest.restoreAllMocks();
  });
});

describe('getRidesController Tests', () => {
  let req: Partial<Request>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    req = { body: {} };
    res = mockResponse();
  });

  afterAll(async () => {
    // Finalizar a pool de conexões
    await pool.end();
  });

  it('retorna 400 se o ID do cliente não for informado', async () => {
    req.query = {};

    await getRidesController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error_code: 'INVALID_DATA',
      error_description: 'O ID do cliente não pode estar em branco',
    });
  });

  it('deve retornar erro 400 se o id do motorista for inválido', async () => {
    req.params = { customer_id: '1' };
    req.query = { driver_id: 'invalid' };

    await getRidesController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error_code: 'DRIVER_NOT_FOUND',
      error_description: 'Motorista inválido',
    });
  });

  it('deve retornar erro 404 se não houver registros de viagens', async () => {
    req.params = { customer_id: '9999' };

    await getRidesController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error_code: 'NO_RIDES_FOUND',
      error_description: 'Nenhum registro encontrado',
    });
  });

  /*it('deve retornar sucesso (200) com as viagens do cliente', async () => {
    req.params = { customer_id: '1' };
    const [rides] = await query('SELECT * FROM rides WHERE customer_id = ?', [1]);

    await getRidesController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Operação realizada com sucesso',
      result: rides,
    });
  });*/

  it('deve retornar 500 em caso de erro inesperado', async () => {
    req.params = { customer_id: '1' };
    jest.spyOn(require('../../db'), 'query').mockRejectedValue(new Error('Erro inesperado'));

    await getRidesController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error_code: 'INTERNAL_ERROR',
      error_description: 'Erro interno no servidor.',
    });

    jest.restoreAllMocks();
  });
});