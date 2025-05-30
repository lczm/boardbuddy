import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BoardSelector({ boards, loading }) {
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
      <div className="board-grid">
        {Array.isArray(boards) && boards.map(board => (
          <div
            key={board.id}
            className="board-card"
            onClick={() => navigate('/dashboard', { state: { boardId: board.id, boardName: board.name } })}
          >
            <h3>{board.name}</h3>
          </div>
        ))}
      </div>
      <footer>
        <p>Made with ❤️ by Ze Ming and Gabriel. Source code <a href="https://github.com/lczm/boardbuddy">here</a></p>
      </footer>
    </div>
  );
}