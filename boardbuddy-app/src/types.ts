export interface Board {
  id: string;
  name: string;
}

export interface Climb {
  uuid: string;
  climb_name: string;
  difficulty?: number;
  grade: string;
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
