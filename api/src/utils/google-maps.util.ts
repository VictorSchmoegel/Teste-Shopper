import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_API_KEY = 'AIzaSyCYxU0SWGtSZjyIKxg6IlTNiWjz0cNcgcg';
const GEOCODING_API_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_API_KEY}`;
const GOOGLE_MAPS_URL = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${GOOGLE_API_KEY}`;

export const getCoordinates = async (location: string) => {
  try {
    const response = await axios.get(GEOCODING_API_URL, {
      params: { address: location },
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Erro ao buscar coordenadas: ${response.data.status}`);
    }

    const result = response.data.results[0];
    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
    };
  } catch (error: any) {
    console.error('Erro ao buscar coordenadas:', error.response?.data || error.message);
    throw new Error(`Erro ao buscar coordenadas: ${error.message}`);
  }
};

export const calculateRoute = async (
  originCoordinates: { latitude: number; longitude: number },
  destinationCoordinates: { latitude: number; longitude: number }
) => {
  try {
    const body = {
      origin: {
        location: {
          latLng: { latitude: originCoordinates.latitude, longitude: originCoordinates.longitude },
        },
      },
      destination: {
        location: {
          latLng: { latitude: destinationCoordinates.latitude, longitude: destinationCoordinates.longitude },
        },
      },
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE',
      extraComputations: ['TRAFFIC_ON_POLYLINE'],
    };

    console.log('Enviando para Google API:', JSON.stringify(body, null, 2));

    const response = await axios.post(GOOGLE_MAPS_URL, body, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Erro ao calcular rota:', error.response?.data || error.message);
    throw new Error(`Erro ao calcular a rota: ${error.message}`);
  }
};