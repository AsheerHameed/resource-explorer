interface StatusFilterProps {
  status: string;
  onChange: (value: string) => void;
}

const StatusFilter = ({ status, onChange }: StatusFilterProps) => {
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
    >
      <option value="">All Status</option>
      <option value="alive">Alive</option>
      <option value="dead">Dead</option>
      <option value="unknown">Unknown</option>
    </select>
  );
};

export default StatusFilter;
