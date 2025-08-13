import SortDropdown, { type SortKey } from "./SortDropdown";
import StatusFilter, { type StatusValue } from "./StatusFilter";

interface FilterProps {
  searchTerm?: string;
  sortKey: SortKey | string;
  statusFilter: StatusValue | string;
  onSearchChange?: (val: string) => void;
  onSortChange: (val: string) => void;
  onStatusChange: (val: string) => void;
}

const Filter = ({
  searchTerm = "",
  sortKey,
  statusFilter,
  onSearchChange,
  onSortChange,
  onStatusChange,
}: FilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      {onSearchChange && (
        <input
          type="search"
          placeholder="Search characters..."
          defaultValue={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      )}
      <div className="flex gap-3">
        <SortDropdown sortKey={sortKey} onChange={onSortChange} />
        <StatusFilter status={statusFilter} onChange={onStatusChange} />
      </div>
    </div>
  );
};

export default Filter;
