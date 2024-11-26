import "./input.css";
import ErrorMessage from "../error/errorMessage";

interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
}

export default function Input({ label, value, onChange, placeholder, error }: InputProps) {
  return (
    <div className="input-container">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? "input-error" : ""}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
}