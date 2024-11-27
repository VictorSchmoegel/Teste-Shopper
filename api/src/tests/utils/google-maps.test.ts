import axios from 'axios';
import { getCoordinates, calculateRoute } from '../../utils/google-maps.util';

jest.mock('axios');

describe('google-maps.util', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  describe('getCoordinates', () => {
    it('deve retornar as coordenadas quando o status for "OK"', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          status: 'OK',
          results: [
            {
              geometry: { location: { lat: -23.55052, lng: -46.633308 } },
            },
          ],
        },
      });

      const result = await getCoordinates('São Paulo, Brasil');
      expect(result).toEqual({ latitude: -23.55052, longitude: -46.633308 });
    });

    it('deve lançar erro quando o status for diferente de "OK"', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { status: 'ZERO_RESULTS' },
      });

      await expect(getCoordinates('Endereço inválido')).rejects.toThrow(
        'Erro ao buscar coordenadas: ZERO_RESULTS'
      );
    });

    it('deve lançar erro ao falhar na requisição', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Erro de rede'));

      await expect(getCoordinates('São Paulo, Brasil')).rejects.toThrow(
        'Erro ao buscar coordenadas: Erro de rede'
      );
    });
  });

  describe('calculateRoute', () => {
    const origin = { latitude: -23.55052, longitude: -46.633308 };
    const destination = { latitude: -22.906847, longitude: -43.172896 };

    it('deve retornar os dados da rota corretamente', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          routes: [
            {
              distanceMeters: 432000,
              duration: 'PT4H30M',
              polyline: { encodedPolyline: 'abcd1234' },
            },
          ],
        },
      });

      const result = await calculateRoute(origin, destination);

      expect(result).toEqual({
        routes: [
          {
            distanceMeters: 432000,
            duration: 'PT4H30M',
            polyline: { encodedPolyline: 'abcd1234' },
          },
        ],
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('directions/v2:computeRoutes'),
        expect.any(Object),
        expect.any(Object)
      );
    });

    it('deve lançar erro quando a API do Google falhar', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Erro de API'));

      await expect(calculateRoute(origin, destination)).rejects.toThrow(
        'Erro ao calcular a rota: Erro de API'
      );
    });
  });
});
