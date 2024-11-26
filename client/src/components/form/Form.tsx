import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../input/Input";
import Button from "../button/Button";
import Map from "../map/Map";
import "./Form.css";

export default function Form() {
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  console.log("GOOGLE_API_KEY no Form:", GOOGLE_API_KEY);
  const navigate = useNavigate();

  type RouteInfo = {
    encodedPolyline: string;
    origin: string;
    destination: string;
  } | null;

  const [formData, setFormData] = useState({
    customer_id: "",
    origin: "",
    destination: ""
  });
  const [driverOptions, setDriverOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo>(null);
  const [duration, setDuration] = useState<string | null>(null);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  const handleSubmit = async () => {
    console.log(formData);
    if (!formData.customer_id || !formData.origin || !formData.destination) {
      alert("Por favor, preencha todos os campos!");
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/ride/estimate', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log("Resposta da API:", data);
      if (data.message === "Operação realizada com sucesso" && data.result) {
        const result = data.result;
        // Atualizar rota
        if (result.routeResponse?.routes?.[0]?.polyline?.encodedPolyline) {
          setRouteInfo({
            encodedPolyline: result.routeResponse.routes[0].polyline.encodedPolyline,
            origin: formData.origin,
            destination: formData.destination,
          });
        }
        // Atualizar duração
        setDuration(result.duration);
        // Atualizar opções de motoristas
        setDriverOptions(result.options || []);
      } else {
        console.warn("Resposta inesperada:", data);
      }
    } catch (error) {
      console.error("Erro ao buscar motoristas disponíveis", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const confirmRide = async (driver: any) => {
    const { customer_id, origin, destination } = formData;

    const formattedDuration = duration ? parseInt(duration.replace("s", ""), 10) : 0;

    try {
      const res = await fetch("/api/ride/confirm", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id,
          origin,
          destination,
          distance: driver.value,
          duration: formattedDuration,
          driver: {
            id: driver.id,
            name: driver.name,
          },
          value: driver.value,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Viagem confirmada com sucesso!");
        navigate("/history");
      } else {
        alert("Erro ao confirmar viagem: " + data.error_description);
      }
    } catch (error) {
      console.error("Erro ao confirmar viagem", error);
      alert("Erro ao confirmar a viagem. Tente novamente.");
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Input
        label="User ID"
        value={formData.customer_id}
        onChange={handleChange("customer_id")}
        placeholder="Digite o ID do usuário"
      />
      <Input
        label="Origin Address"
        value={formData.origin}
        onChange={handleChange("origin")}
        placeholder="Digite o endereço de origem"
      />
      <Input
        label="Destination Address"
        value={formData.destination}
        onChange={handleChange("destination")}
        placeholder="Digite o endereço de destino"
      />
      <Button label="Estimar Valor da Viagem" onClick={handleSubmit} />
      {loading && <p>Carregando opções de motoristas...</p>}
      {driverOptions.length > 0 && (
        <div>
          <h2>Motoristas disponíveis</h2>
          <div className="driver-options">
            {driverOptions.map((driver: any) => (
              <div className="driver-card" key={driver.id}>
                <p>Motorista: {driver.name}</p>
                <p>Descrição: {driver.description}</p>
                <p>Veículo: {driver.vehicle}</p>
                <p>Nota: {driver.review.rating}</p>
                <p>Comentário: {driver.review.comment}</p>
                <p>Valor: R${driver.value.toFixed(2)}</p>
                <Button
                  label="Escolher"
                  onClick={() => confirmRide(driver)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <p>Erro ao buscar motoristas disponíveis</p>}
      {
        routeInfo && (
          <div>
            <h2>Mapa da Rota</h2>
            <Map encodedPolyline={routeInfo.encodedPolyline} googleApiKey={GOOGLE_API_KEY} />
          </div>
        )
      }
    </form>
  );
};
