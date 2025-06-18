import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProblemModal from './ProblemModal';

export default function MobileView() {
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
      .filter(climb => climb.image_filenames?.includes('/'))
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
    <div className="mobile-dashboard">
      <div className="mobile-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back
        </button>
        <h2 className="board-title">{boardName}</h2>
      </div>
      
      <select 
        className="problem-dropdown"
        onChange={(e) => {
          const selectedId = e.target.value;
          const selected = climbs.find(c => c.uuid === selectedId);
          setSelectedProblem(selected ? getProblemForModal(selected) : null);
        }}
        value={selectedProblem?.name || ''}
      >
        <option value="">Select a problem</option>
        {climbs.map(climb => (
          <option key={climb.uuid} value={climb.uuid}>
            {climb.climb_name} ({climb.grade})
          </option>
        ))}
      </select>

      <div className="board-image">
        {getImageFilenames().map((filename, index) => (
          <div key={index} className="mobile-image-container">
            <img
              src={`https://lczm.me/boardbuddy/api/images/${filename}`}
              alt="Climb holds"
              className="hold-image"
              crossOrigin="anonymous"
            />
          </div>
        ))}
      </div>

      <ProblemModal
        problem={selectedProblem}
        onClose={() => setSelectedProblem(null)}
      />
    </div>
  );
}