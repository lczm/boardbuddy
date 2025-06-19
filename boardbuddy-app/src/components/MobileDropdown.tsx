import type { Climb } from "../types";

interface MobileDropdownProps {
  climbs: Climb[];
  selectedClimb: Climb | null;
  onClimbSelect: (climb: Climb) => void;
}

export default function MobileDropdown({
  climbs,
  selectedClimb,
  onClimbSelect,
}: MobileDropdownProps) {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selected = climbs.find((c) => c.uuid === selectedId);
    if (selected) {
      onClimbSelect(selected);
    }
  };

  return (
    <div className="md:hidden p-4 bg-white border-b">
      <select
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleSelectChange}
        value={selectedClimb?.uuid || ""}
      >
        <option value="">Select a problem</option>
        {climbs.map((climb) => (
          <option key={climb.uuid} value={climb.uuid}>
            {climb.climb_name} ({climb.grade})
          </option>
        ))}
      </select>
    </div>
  );
}
