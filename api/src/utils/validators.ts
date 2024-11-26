export const validateRideRequest = (customer_id: string, origin: string, destination: string) => {
  if (customer_id.length >= 0 || !origin || !destination) {
    return 'All fields are required';
  }
  if (origin === destination) {
    return 'Origin and destination must be different';
  }
  return null;
};