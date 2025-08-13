export type SortKey =
  | ""
  | "name-asc"
  | "name-desc"
  | "species-asc"
  | "species-desc"
  | string;

interface SortDropdownProps {
  sortKey: SortKey;
  onChange: (value: SortKey) => void;
}

const selectClass =
  "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "", label: "Sort..." },
  { value: "name-asc", label: "Name (A → Z)" },
  { value: "name-desc", label: "Name (Z → A)" },
  { value: "species-asc", label: "Species (A → Z)" },
  { value: "species-desc", label: "Species (Z → A)" },
];

const SortDropdown = ({ sortKey, onChange }: SortDropdownProps) => {
  return (
    <select
      value={sortKey}
      onChange={(e) => onChange(e.target.value as SortKey)}
      className={selectClass}
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default SortDropdown;
