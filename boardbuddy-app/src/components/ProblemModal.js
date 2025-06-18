// src/components/ProblemModal.js
import React from 'react';

export default function ProblemModal({ problem, onClose }) {
  if (!problem) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{problem.name}</h2>
        <div className="problem-details">
          <p>Difficulty: <span className="stars">{'★'.repeat(problem.difficulty)}</span></p>
          <p>Grade: <span className="grade">{problem.grade}</span></p>
          <p>Setter: {problem.setter}</p>
          <p>Rating: {'★'.repeat(problem.rating)}</p>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}