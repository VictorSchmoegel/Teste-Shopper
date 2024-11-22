import { Driver, DriverResponse } from '../models/ride.model'

export const calculateTripCost = (driver: Driver, distanceKm: number): DriverResponse => {
  const value = driver.ratePerKm * distanceKm;
  return {
    id: driver.id,
    name: driver.name,
    description: driver.description,
    vehicle: driver.vehicle,
    review: { rating: driver.rating, comment: driver.comment },
    value: value
  };
};