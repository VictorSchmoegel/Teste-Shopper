import { useState } from "react";
import Input from "../input/Input";
import Button from "../button/Button";
import "./Form.css";

export default function Form() {
  const [formData, setFormData] = useState({
    customer_id: "",
    origin: "",
    destination: ""
  });
  const [driverOptions, setDriverOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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
      setDriverOptions(data.options);
      console.log(data);
      console.log(data.options);
    } catch (error) {
      console.error("Erro ao buscar motoristas disponíveis", error);
      setError(true);
    } finally {
      setLoading(false);
    };
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
      {loading ? (
        <p>Carregando opções de motoristas...</p>
      ) : driverOptions.length > 0 ? (
        <div>
          <h2>Motoristas disponíveis</h2>
          <ul>
            {driverOptions.map((driver: any) => (
              <li key={driver.id}>
                <div className="drive_card">
                  <span>Motorista: {driver.name} </span>
                  <span>Descrição: {driver.description} </span>
                  <span>Veículo: {driver.vehicle} </span>
                  <span>Nota: {driver.review.rating} </span>
                  <span>Valor: R${driver.value} </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        error && <p>Erro ao buscar motoristas disponíveis</p>
      )}
    </form>
  );
};
