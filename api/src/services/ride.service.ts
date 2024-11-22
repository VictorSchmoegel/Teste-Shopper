import { getCoordinates, calculateRoute } from "../utils/google-maps.util";
import { drivers } from "../models/driver.model";

export const estimateRide = async (origin: string, destination: string) => {
  try {
    const originCoordinates = await getCoordinates(origin);
    const destinationCoordinates = await getCoordinates(destination);

    const route = await calculateRoute(originCoordinates, destinationCoordinates);

    if (!route.routes || route.routes.length === 0) {
      throw new Error('Nenhuma rota encontrada pela API.');
    }

    const distance = route.routes[0]?.distanceMeters / 1000; // Distância em km
    const duration = route.routes[0]?.duration; // Duração da rota

    const availableDrivers = drivers
      .filter(driver => distance >= driver.minKm)
      .map(driver => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        review: driver.review,
        value: driver.ratePerKm * distance,
      }))
      .sort((a, b) => a.value - b.value);

    return {
      origin: originCoordinates,
      destination: destinationCoordinates,
      distance,
      duration,
      options: availableDrivers,
      routeResponse: route,
    };
  } catch (error: any) {
    console.error('Erro ao estimar corrida:', error.message || error);
    throw new Error(error.message || 'Erro desconhecido ao estimar corrida.');
  }
};
