import { useState, useEffect } from "react";
import Input from "../input/Input";
import Button from "../button/Button";
import Select from "../select/Select";
import "./History.css";

export default function History() {
  const [formData, setFormData] = useState({
    customer_id: "",
    driver_id: "all",
  });

  const [driverOptions, setDriverOptions] = useState([
    { value: "all", label: "Todos" },
  ]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/drivers");
      const data = await res.json();

      if (res.ok) {
        const options = data.drivers.map((driver: any) => ({
          value: driver.id.toString(),
          label: driver.name,
        }));
        setDriverOptions([{ value: "all", label: "Todos" }, ...options]);
      } else {
        setError(data.error_description || "Erro ao carregar motoristas.");
      }
    } catch (err) {
      setError("Não foi possível carregar a lista de motoristas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleFilter = async () => {
    if (!formData.customer_id) {
      setError("Por favor, insira o ID do cliente.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const driverQuery =
        formData.driver_id !== "all" ? `&driver_id=${formData.driver_id}` : "";
      const response = await fetch(
        `/api/ride/${formData.customer_id}?${driverQuery}`
      );
      const data = await response.json();

      if (response.ok) {
        setTrips(data.rides);
      } else {
        setError(data.error_description || "Erro ao buscar histórico.");
      }
    } catch (err) {
      setError("Não foi possível buscar o histórico de viagens.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-container">
      <h1>Histórico de Viagens</h1>
      <div className="filter-section">
        <Input
          label="ID do Cliente"
          value={formData.customer_id}
          onChange={handleChange("customer_id")}
          placeholder="Digite o ID do cliente"
        />
        <Select
          label="Motorista"
          value={formData.driver_id}
          onChange={handleChange("driver_id")}
          options={driverOptions}
        />
        <Button label="Aplicar Filtro" onClick={handleFilter} />
      </div>
      {loading && <p>Carregando...</p>}
      {error && <p className="error">{error}</p>}
      {trips.length > 0 ? (
        <div className="trips-list">
          <h2>Viagens Realizadas</h2>
          <table>
            <thead>
              <tr>
                <th>Data e Hora</th>
                <th>Motorista</th>
                <th>Origem</th>
                <th>Destino</th>
                <th>Distância</th>
                <th>Tempo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip: any) => (
                <tr key={trip.id}>
                  <td>{new Date(trip.date).toLocaleString()}</td>
                  <td>{trip.driver.name}</td>
                  <td>{trip.origin}</td>
                  <td>{trip.destination}</td>
                  <td>{trip.distance.toFixed(2)} km</td>
                  <td>{trip.duration} min</td>
                  <td>R${trip.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p>Nenhuma viagem encontrada.</p>
      )}
    </div>
  );
}
