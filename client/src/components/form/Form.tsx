import { useState } from "react";
import Input from "../input/Input";
import Button from "../button/Button";

export default function Form() {
  const [formData, setFormData] = useState({
    customer_id: "",
    origin: "",
    destination: ""
  });

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
    try {
      const res = await fetch('/api/ride/estimate', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
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
    </form>
  );
};
