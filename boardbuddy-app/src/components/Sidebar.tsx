import type { Climb } from "../types";

interface SidebarProps {
  boardName: string;
  climbs: Climb[];
  selectedClimb: Climb | null;
  onClimbSelect: (climb: Climb) => void;
  onBackClick: () => void;
}

export default function Sidebar({
  boardName,
  climbs,
  selectedClimb,
  onClimbSelect,
  onBackClick,
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
        <h2 className="text-xl font-bold text-gray-900">{boardName}</h2>
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
              <p className="text-sm text-gray-600">Grade: {climb.grade}</p>
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
