import AngleSelector from "./AngleSelector";
import type { Climb } from "../types";
import { getGradeForAngle } from "../types";

interface SidebarProps {
  boardName: string;
  climbs: Climb[];
  selectedClimb: Climb | null;
  onClimbSelect: (climb: Climb) => void;
  onBackClick: () => void;
  angle: number;
  onAngleChange: (angle: number) => void;
}

export default function Sidebar({
  boardName,
  climbs,
  selectedClimb,
  onClimbSelect,
  onBackClick,
  angle,
  onAngleChange,
}: SidebarProps) {
  return (
    <div className="hidden md:flex md:w-80 bg-white shadow-lg flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onBackClick}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-3"
        >
          ← Back to Boards
        </button>
        <div className="flex flex-col space-y-3">
          <h2 className="text-xl font-bold text-gray-900">{boardName}</h2>
          <div className="flex gap-2">
            <AngleSelector
              angle={angle}
              onAngleChange={onAngleChange}
              className="flex-shrink-0"
            />
            <select
              className="flex-1 min-w-0 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const selectedId = e.target.value;
                const selected = climbs.find((c) => c.uuid === selectedId);
                if (selected) {
                  onClimbSelect(selected);
                }
              }}
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
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {climbs.map((climb) => (
            <div
              key={climb.uuid}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedClimb?.uuid === climb.uuid
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => onClimbSelect(climb)}
            >
              <h4 className="font-semibold text-gray-900">
                {climb.climb_name}
              </h4>
              <p className="text-sm text-gray-600">
                Grade: {getGradeForAngle(climb, angle)}
              </p>
              <p className="text-sm text-gray-600">
                Setter: {climb.setter_name}
              </p>
              <p className="text-sm text-yellow-600">
                {"★".repeat(climb.rating || 0)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
