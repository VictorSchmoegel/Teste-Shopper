export interface Driver {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: {
    rating: number;
    comment: string;
  };
  ratePerKm: number;
  minKm: number;
}

export const drivers: Driver[] = [
  {
    id: 1,
    name: 'Homer Simpson',
    description: 'Olá! Sou o Homer, seu motorista camarada!.',
    vehicle: 'Plymouth Valiant 1973',
    review: { rating: 2, comment: 'Motorista simpático, mas errou o caminho.' },
    ratePerKm: 2.5,
    minKm: 1,
  },
  {
    id: 2,
    name: 'Dominic Toretto',
    description: 'Ei, aqui é o Dom. Pode entrar!...',
    vehicle: 'Dodge Charger R/T 1970',
    review: { rating: 4, comment: 'Que viagem incrível!' },
    ratePerKm: 5,
    minKm: 5,
  },
  {
    id: 3,
    name: 'James Bond',
    description: 'Boa noite, sou James Bond....',
    vehicle: 'Aston Martin DB5',
    review: { rating: 5, comment: 'Serviço impecável!' },
    ratePerKm: 10,
    minKm: 10,
  },
];
