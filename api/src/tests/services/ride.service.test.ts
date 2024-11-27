import { estimateRide } from '../../services/ride.service';
import * as googleMapsUtil from '../../utils/google-maps.util';
import { drivers } from '../../models/driver.model';

// Mock dos drivers para o teste
jest.mock('../../models/driver.model', () => ({
  drivers: [
    {
      id: 1,
      name: 'Homer Simpson',
      description: 'Motorista camarada!',
      vehicle: 'Plymouth Valiant 1973',
      review: 2.0,
      ratePerKm: 2.5,
      minKm: 1,
      maxKm: 3,
    },
    {
      id: 2,
      name: 'Dominic Toretto',
      description: 'Velocidade e segurança.',
      vehicle: 'Dodge Charger R/T 1970',
      review: 4.0,
      ratePerKm: 5.0,
      minKm: 5,
      maxKm: 5,
    },
    {
      id: 3,
      name: 'James Bond',
      description: 'Elegância e discrição.',
      vehicle: 'Aston Martin DB5',
      review: 5.0,
      ratePerKm: 10.0,
      minKm: 10,
      maxKm: 10,
    },
  ],
}));

// Mock das funções da API do Google Maps
jest.mock('../../utils/google-maps.util', () => ({
  getCoordinates: jest.fn(),
  calculateRoute: jest.fn(),
}));

describe('estimateRide Service', () => {
  const mockGetCoordinates = googleMapsUtil.getCoordinates as jest.Mock;
  const mockCalculateRoute = googleMapsUtil.calculateRoute as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve estimar a corrida com sucesso para uma rota válida', async () => {
    mockGetCoordinates.mockResolvedValueOnce({ lat: -23.55052, lng: -46.633308 }); // Origem
    mockGetCoordinates.mockResolvedValueOnce({ lat: -23.55577, lng: -46.63964 }); // Destino
    mockCalculateRoute.mockResolvedValueOnce({
      routes: [
        {
          distanceMeters: 3000, // 3 km
          duration: '10 mins',
        },
      ],
    });

    const result = await estimateRide('Avenida Paulista', 'Praça da Sé');

    expect(mockGetCoordinates).toHaveBeenCalledTimes(2);
    expect(mockCalculateRoute).toHaveBeenCalledTimes(1);
    expect(result).toEqual(
      expect.objectContaining({
        origin: { lat: -23.55052, lng: -46.633308 },
        destination: { lat: -23.55577, lng: -46.63964 },
        distance: 3,
        duration: '10 mins',
        options: [
          {
            id: 1,
            name: 'Homer Simpson',
            description: 'Motorista camarada!',
            vehicle: 'Plymouth Valiant 1973',
            review: 2.0,
            value: 7.5, // 3 km * 2.5
          },
        ],
      }),
    );
  });

  it('deve lançar erro se nenhuma rota for encontrada', async () => {
    mockGetCoordinates.mockResolvedValueOnce({ lat: -23.55052, lng: -46.633308 });
    mockGetCoordinates.mockResolvedValueOnce({ lat: -23.55577, lng: -46.63964 });
    mockCalculateRoute.mockResolvedValueOnce({ routes: [] });

    await expect(estimateRide('Avenida Paulista', 'Praça da Sé')).rejects.toThrow(
      'Nenhuma rota encontrada pela API.',
    );
  });

  it('deve lançar erro se as coordenadas não forem obtidas', async () => {
    mockGetCoordinates.mockRejectedValueOnce(new Error('Erro ao buscar coordenadas'));

    await expect(estimateRide('Avenida Paulista', 'Praça da Sé')).rejects.toThrow(
      'Erro ao buscar coordenadas',
    );
  });

  it('deve retornar motoristas disponíveis com base apenas na distância mínima', async () => {
    mockGetCoordinates.mockResolvedValueOnce({ lat: -23.55052, lng: -46.633308 });
    mockGetCoordinates.mockResolvedValueOnce({ lat: -23.55577, lng: -46.63964 });
    mockCalculateRoute.mockResolvedValueOnce({
      routes: [
        {
          distanceMeters: 15000, // 15 km
          duration: '30 mins',
        },
      ],
    });

    const result = await estimateRide('Avenida Paulista', 'Aeroporto de Guarulhos');

    expect(result.options).toEqual([
      {
        id: 1,
        name: 'Homer Simpson',
        description: 'Motorista camarada!',
        vehicle: 'Plymouth Valiant 1973',
        review: 2,
        value: 37.5, // 15 km * 2.5
      },
      {
        id: 2,
        name: 'Dominic Toretto',
        description: 'Velocidade e segurança.',
        vehicle: 'Dodge Charger R/T 1970',
        review: 4,
        value: 75, // 15 km * 5
      },
      {
        id: 3,
        name: 'James Bond',
        description: 'Elegância e discrição.',
        vehicle: 'Aston Martin DB5',
        review: 5,
        value: 150, // 15 km * 10
      },
    ]);
  });
});
