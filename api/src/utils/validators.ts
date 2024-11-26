export const validateRideRequest = (customer_id: string, origin: string, destination: string): string | null => {
  if (!customer_id) {
    return 'Os dados fornecidos no corpo da requisição são inválidos';
  }
  if (!origin) {
    return 'Os dados fornecidos no corpo da requisição são inválidos';
  }
  if (!destination) {
    return 'Os dados fornecidos no corpo da requisição são inválidos';
  }
  if (origin.trim() === destination.trim()) {
    return 'Os dados fornecidos no corpo da requisição são inválidos';
  }
  return null;
};