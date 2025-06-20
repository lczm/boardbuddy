import AngleSelector from "./AngleSelector";
import type { Climb } from "../types";

interface MobileDropdownProps {
  climbs: Climb[];
  selectedClimb: Climb | null;
  onClimbSelect: (climb: Climb) => void;
  angle: number;
  onAngleChange: (angle: number) => void;
}

export default function MobileDropdown({
  climbs,
  selectedClimb,
  onClimbSelect,
  angle,
  onAngleChange,
}: MobileDropdownProps) {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selected = climbs.find((c) => c.uuid === selectedId);
    if (selected) {
      onClimbSelect(selected);
    }
  };

  return (
    <div className="md:hidden p-4 bg-white border-b space-y-3">
      <div className="flex gap-2">
        <AngleSelector
          angle={angle}
          onAngleChange={onAngleChange}
          className="flex-shrink-0 bg-gray-50 p-2 rounded-lg"
        />
        <select
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </div>
  );
}
