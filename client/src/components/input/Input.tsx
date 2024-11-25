import "./input.css";

interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export default function Input({ label, value, onChange, placeholder }: InputProps) {
  return (
    <div>
      <label>
        {label}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </label>
    </div>
  );
}