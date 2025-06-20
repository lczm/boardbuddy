import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";
import Sidebar from "./Sidebar";
import MobileDropdown from "./MobileDropdown";
import ProblemView from "./ProblemView";
import type { Climb, LocationState } from "../types";

interface ClimbViewProps {
  angle: number;
  onAngleChange: (angle: number) => void;
}

export default function ClimbView({ angle, onAngleChange }: ClimbViewProps) {
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClimb, setSelectedClimb] = useState<Climb | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const boardId = state?.boardId;
  const boardName = state?.boardName;

  useEffect(() => {
    if (!boardId) {
      navigate("/");
      return;
    }

    const fetchClimbs = async () => {
      try {
        const climbsData = await api.getClimbs(boardId);
        setClimbs(climbsData);
        // Default to first problem
        if (climbsData.length > 0) {
          setSelectedClimb(climbsData[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("API Error:", error);
        setClimbs([]);
        setLoading(false);
      }
    };

    fetchClimbs();
  }, [boardId, navigate]);

  const handleClimbSelect = (climb: Climb) => {
    setSelectedClimb(climb);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading climbs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
          >
            ← Back
          </button>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{boardName}</h2>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col md:flex-row"
        style={{ height: "calc(100vh - 64px)" }}
      >
        {/* Sidebar - Desktop */}
        <Sidebar
          boardName={boardName}
          climbs={climbs}
          selectedClimb={selectedClimb}
          onClimbSelect={handleClimbSelect}
          onBackClick={handleBackClick}
          angle={angle}
          onAngleChange={onAngleChange}
        />

        {/* Mobile Dropdown */}
        <MobileDropdown
          climbs={climbs}
          selectedClimb={selectedClimb}
          onClimbSelect={handleClimbSelect}
          angle={angle}
          onAngleChange={onAngleChange}
        />

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 flex flex-col">
          <ProblemView selectedClimb={selectedClimb} />
        </div>
      </div>
    </div>
  );
}
