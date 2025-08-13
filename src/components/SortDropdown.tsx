interface SortDropdownProps {
  sortKey: string;
  onChange: (value: string) => void;
}

const SortDropdown = ({ sortKey, onChange }: SortDropdownProps) => {
  return (
    <select
      value={sortKey}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
    >
      <option value="">Sort...</option>
      <option value="name-asc">Name (A → Z)</option>
      <option value="name-desc">Name (Z → A)</option>
      <option value="species-asc">Species (A → Z)</option>
      <option value="species-desc">Species (Z → A)</option>
    </select>
  );
};

export default SortDropdown;
