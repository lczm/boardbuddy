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

  const getImageFilenames = () => {
    if (!climbs.length || !climbs[0].image_filenames) return [];
    return climbs
      .filter(climb => climb.image_filenames && climb.image_filenames.includes('/'))
      .map(climb => climb.image_filenames.split('/')[1]);
  };

  // const getImageFilenames = () => {
  //   if (!climbs.length || !climbs[0].image_filenames) return []; 
  //   console.log('Formattted image filenames:', climbs[0].image_filenames.split('/')[1]);
  //   try {
  //     console.log('Parsed image filenames:', JSON.parse(climbs[0].image_filenames));
  //     return JSON.parse(climbs[0].image_filenames) || []; 
  //   } catch (e) {
  //     console.error('Error parsing image filenames:', e, climbs[0].image_filenames);
  //     return [];
  //   }
  // };

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
            <div key={climb.uuid} className="problem-item">
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
            <img
              key={index}
              src={`https://lczm.me/boardbuddy/api/images/${filename}`}
              alt="Hold position"
              className="hold-image"
              crossOrigin="anonymous" // urr gonna put this here for now hopefully it lets me bypass 
            />
          ))}
        </div>
      </div>
    </div>
  );
}