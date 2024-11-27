import "./select.css";
import ErrorMessage from "../error/errorMessage";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
}: SelectProps) {
  return (
    <div className="select-container">
      <label className="select-label">{label}</label>
      <select className="select-input" value={value} onChange={onChange}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
