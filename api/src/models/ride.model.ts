export interface RideRequest {
  customer_id: string;
  origin: string;
  destination: string;
};

export interface RideResponse {
  origin: { latitude: number, longitude: number };
  destination: { latitude: number, longitude: number };
  distance: number;
  duration: String;
  options: DriverResponse[];
  routeResponse: object;
};

export interface Driver {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  rating: number;
  comment: string;
  ratePerKm: number;
  minKm: number;
}

export interface DriverResponse {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: { rating: number; comment: string };
  value: number;
}