import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MobileView() {
  const [climbs, setClimbs] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
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
        console.error('Error fetching climbs:', error);
        setClimbs([]);
        setLoading(false);
      });
  }, [boardId, navigate]);

  if (loading) {
    return <div className="loading">Loading climbs...</div>;
  }

  return (
    <div className="mobile-dashboard">
      <div className="mobile-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back
        </button>
        <h2>{boardName}</h2>
      </div>
      
      <select 
        onChange={(e) => {
          const climb = climbs.find(c => c.id === parseInt(e.target.value));
          setSelectedProblem(climb);
        }}
        className="problem-dropdown"
      >
        <option value="">Select a problem</option>
        {climbs.map(climb => (
          <option key={climb.id} value={climb.id}>
            {climb.name} - {climb.grade}
          </option>
        ))}
      </select>
      
      <div className="board-image">
        {(selectedProblem?.image_filenames || climbs[0]?.image_filenames)?.map((filename, index) => (
          <img
            key={index}
            src={`https://api.kilterboardapp.com/img/${filename}`}
            alt="Hold position"
            className="hold-image"
          />
        ))}
      </div>
      
      {selectedProblem && (
        <div className="problem-details-mobile">
          <h3>{selectedProblem.name}</h3>
          <p>Grade: {selectedProblem.grade}</p>
          <p>Setter: {selectedProblem.setter}</p>
          <p>Rating: {'★'.repeat(selectedProblem.rating || 0)}</p>
        </div>
      )}
    </div>
  );
}