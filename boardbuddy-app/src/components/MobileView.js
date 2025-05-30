import React from 'react';
import axios from 'axios';

export default function MobileView({ climbs, setClimbs, onSelect }) {
  React.useEffect(() => {
    axios.get('https://lczm.me/boardbuddy/api/climbs?board_id=1')
      .then(response => setClimbs(response.data))
      .catch(console.error);
  }, [setClimbs]);

  return (
    <div className="mobile-dashboard">
      <select 
        onChange={(e) => onSelect(climbs.find(c => c.id === parseInt(e.target.value)))}
        className="problem-dropdown"
      >
        <option value="">Select a problem</option>
        {climbs.map(climb => (
          <option key={climb.id} value={climb.id}>
            {climb.name}
          </option>
        ))}
      </select>
      
      <div className="board-image">
        {climbs[0]?.image_filenames.map((filename, index) => (
          <img
            key={index}
            src={`https://api.kilterboardapp.com/img/${filename}`}
            alt="Hold position"
            className="hold-image"
          />
        ))}
      </div>
    </div>
  );
}