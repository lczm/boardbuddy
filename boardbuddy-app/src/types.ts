export interface Board {
  id: string;
  name: string;
}

export interface GradeInfo {
  boulder: string;
  route: string;
}

export interface Climb {
  uuid: string;
  climb_name: string;
  difficulty?: number;
  grade: string; // Keep for backward compatibility
  grades?: Record<string, GradeInfo>; // New grades structure
  setter_name: string;
  rating?: number;
  image_filenames?: string[];
  board_id: string;
}

export interface Problem {
  name: string;
  difficulty: number;
  grade: string;
  setter: string;
  rating: number;
}

export interface ApiResponse {
  boards?: Board[];
  climbs?: Climb[];
}

export interface LocationState {
  boardId: string;
  boardName: string;
}

// Utility function to get grade for a specific angle
export function getGradeForAngle(climb: Climb, angle: number): string {
  if (climb.grades && climb.grades[angle.toString()]) {
    return climb.grades[angle.toString()].boulder;
  }
  // Fallback to old grade field if grades object doesn't exist or angle not found
  return climb.grade || "N/A";
}
