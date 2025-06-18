import React from 'react';

export default function ProblemModal({ problem, onClose }) {
  if (!problem) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        minWidth: '300px',
        maxWidth: '90vw'
      }}>
        <h2>{problem.name}</h2>
        <div className="problem-details">
          <p>Difficulty: <span className="stars">{'★'.repeat(problem.difficulty || 0)}</span></p>
          <p>Grade: <span className="grade">{problem.grade}</span></p>
          <p>Setter: {problem.setter}</p>
          <p>Rating: {'★'.repeat(problem.rating || 0)}</p>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}