import { useNavigate } from "react-router-dom";
import AngleSelector from "./AngleSelector";
import type { Board } from "../types";

interface BoardSelectorProps {
  boards: Board[];
  loading: boolean;
  angle: number;
  onAngleChange: (angle: number) => void;
}

export default function BoardSelector({
  boards,
  loading,
  angle,
  onAngleChange,
}: BoardSelectorProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="landing">
        <h1>BoardBuddy</h1>
        <div>Loading boards...</div>
      </div>
    );
  }

  return (
    <div className="landing">
      <h1>BoardBuddy</h1>
      <div className="mb-6 flex justify-center">
        <AngleSelector
          angle={angle}
          onAngleChange={onAngleChange}
          className="bg-white p-3 rounded-lg shadow-sm border"
        />
      </div>
      <div className="board-grid">
        {Array.isArray(boards) &&
          boards.map((board) => (
            <div
              key={board.id}
              className="board-card"
              onClick={() =>
                navigate("/dashboard", {
                  state: { boardId: board.id, boardName: board.name },
                })
              }
            >
              <h3>{board.name}</h3>
            </div>
          ))}
      </div>
      <footer>
        <p>
          Made with ❤️ by Ze Ming and Gabriel. Source code{" "}
          <a href="https://github.com/lczm/boardbuddy">here</a>
        </p>
      </footer>
    </div>
  );
}
