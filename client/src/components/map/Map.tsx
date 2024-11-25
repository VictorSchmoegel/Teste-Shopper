import './map.css';

interface MapProps {
  encodedPolyline: string;
  googleApiKey: string;
}

export default function Map({ encodedPolyline, googleApiKey }: MapProps) {
  const path = encodeURIComponent(`enc:${encodedPolyline}`);
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=1500x2000&path=${path}&key=${googleApiKey}`;


  return (
    <div className='map-container'>
      <img src={mapUrl} alt="Rota da Viagem" />
    </div>
  );
}
