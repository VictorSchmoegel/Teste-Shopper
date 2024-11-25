import "./button.css";

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return (
    <button
      className=""
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
);
}
