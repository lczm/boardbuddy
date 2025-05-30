import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DesktopView() {
  const [climbs, setClimbs] = useState([]);
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
        console.log('Climbs API Response:', response.data);
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
            <div key={climb.id} className="problem-item">
              <h4>{climb.name}</h4>
              <p>Grade: {climb.grade}</p>
              <p>Setter: {climb.setter}</p>
              <p>Rating: {'★'.repeat(climb.rating || 0)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="main-content">
        <div className="board-image">
          {climbs[0]?.image_filenames?.map((filename, index) => (
            <img
              key={index}
              src={`https://api.kilterboardapp.com/img/${filename}`}
              alt="Hold position"
              className="hold-image"
            />
          ))}
        </div>
      </div>
    </div>
  );
}