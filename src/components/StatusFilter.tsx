interface StatusFilterProps {
  status: StatusValue;
  onChange: (value: StatusValue) => void;
}

export type StatusValue = "" | "alive" | "dead" | "unknown" | string;

const selectClass =
  "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer";

const statuses: { value: StatusValue; label: string }[] = [
  { value: "", label: "All Status" },
  { value: "alive", label: "Alive" },
  { value: "dead", label: "Dead" },
  { value: "unknown", label: "Unknown" },
];

export default function StatusFilter({ status, onChange }: StatusFilterProps) {
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as StatusValue)}
      className={selectClass}
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
