import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProblemModal from './ProblemModal'; 

export default function DesktopView() {
  const [climbs, setClimbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null); 
  const location = useLocation();
  const navigate = useNavigate();
  const boardId = location.state?.boardId;
  const boardName = location.state?.boardName;

  useEffect(() => {
    if (!boardId) {
      navigate('/');
      return;
    }
    axios.get(`https://lczm.me/boardbuddy/api/climbs?board_id=${boardId}`)
      .then(response => {
        setClimbs(response.data.climbs || []);
        setLoading(false);
      })
      .catch(error => {
        setClimbs([]);
        setLoading(false);
      });
  }, [boardId, navigate]);

  const getImageFilenames = () => {
    if (!climbs.length || !climbs[0].image_filenames) return [];
    return climbs
      .filter(climb => climb.image_filenames && climb.image_filenames.includes('/'))
      .map(climb => climb.image_filenames.split('/')[1]);
  };

  const getProblemForModal = (climb) => ({
    name: climb.climb_name,
    difficulty: climb.difficulty || 0,
    grade: climb.grade,
    setter: climb.setter_name,
    rating: climb.rating || 0,
  });

  if (loading) {
    return <div className="loading">Loading climbs...</div>;
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <button onClick={() => navigate('/')} className="back-button">
            ← Back to Boards
          </button>
          <h2>{boardName}</h2>
        </div>
        <div className="problem-list">
          {climbs.map(climb => (
            <div
              key={climb.uuid}
              className="problem-item"
              onClick={() => setSelectedProblem(getProblemForModal(climb))}
              style={{ cursor: 'pointer' }}
            >
              <h4>{climb.climb_name}</h4>
              <p>Grade: {climb.grade}</p>
              <p>Setter: {climb.setter_name}</p>
              <p>Rating: {'★'.repeat(climb.rating || 0)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="main-content">
        <div className="board-image">
          {getImageFilenames().map((filename, index) => (
            <div key={index} className="image-container">
              <img
                src={`https://lczm.me/boardbuddy/api/images/${filename}`}
                alt="Hold position"
                className="hold-image"
                crossOrigin="anonymous"
              />
            </div>
          ))}
        </div>
      </div>
      <ProblemModal
        problem={selectedProblem}
        onClose={() => setSelectedProblem(null)}
      />
    </div>
  );
}