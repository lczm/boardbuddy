import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { api } from "../api";
import type { Climb, LocationState } from "../types";
import Sidebar from "./Sidebar";
import MobileDropdown from "./MobileDropdown";
import ProblemView from "./ProblemView";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
        const climbsData = await api.getClimbs(boardId, angle);
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
  }, [boardId, angle, navigate]);

  const handleClimbSelect = (climb: Climb) => {
    setSelectedClimb(climb);
  };

  const handleAngleChange = (newAngle: number) => {
    setLoading(true);
    setSelectedClimb(null); // Clear selected climb when angle changes
    onAngleChange(newAngle);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading climbs...</div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar
          boardName={boardName}
          climbs={climbs}
          selectedClimb={selectedClimb}
          onClimbSelect={handleClimbSelect}
          onBackClick={handleBackClick}
          angle={angle}
          onAngleChange={handleAngleChange}
        />

        {/* Main Content */}
        <SidebarInset>
          <div className="flex flex-col h-screen">
            {/* Mobile Header */}
            <div className="md:hidden bg-card shadow-sm border-b">
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <SidebarTrigger className="md:hidden" />
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl">{boardName}</h2>
                </div>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex items-center gap-2 p-4 border-b bg-card">
              <SidebarTrigger />
              <h2 className="text-xl">{boardName}</h2>
            </div>

            {/* Mobile Dropdown - only show when sidebar is hidden */}
            <div className="md:hidden">
              <MobileDropdown
                climbs={climbs}
                selectedClimb={selectedClimb}
                onClimbSelect={handleClimbSelect}
                angle={angle}
                onAngleChange={handleAngleChange}
              />
            </div>

            {/* Problem View */}
            <div className="flex-1 p-4 md:p-6 overflow-auto">
              <ProblemView selectedClimb={selectedClimb} angle={angle} />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
