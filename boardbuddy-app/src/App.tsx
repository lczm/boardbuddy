import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { api } from "./api";
import BoardSelector from "./components/BoardSelector";
import ClimbView from "./components/ClimbView";
import type { Board } from "./types";
import "./App.css";

function App() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const boardsData = await api.getBoards();
        console.log("API Response:", boardsData);
        setBoards(boardsData);
        setLoading(false);
      } catch (error) {
        console.error("API Error:", error);
        setBoards([]);
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={<BoardSelector boards={boards} loading={loading} />}
      />
      <Route path="/dashboard" element={<ClimbView />} />
    </Routes>
  );
}

export default App;
