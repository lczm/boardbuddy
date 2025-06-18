import React from 'react';
import axios from 'axios';

export default function MobileView({ climbs, setClimbs, onSelect }) {
  const getFormattedImageFilenames = () => {
    if (!climbs.length || !climbs[0].image_filenames) return [];
    return climbs
      .filter(climb => typeof climb.image_filenames === 'string' && climb.image_filenames.includes('/'))
      .map(climb => climb.image_filenames.split('/')[1]);
  };

  React.useEffect(() => {
    axios.get('https://lczm.me/boardbuddy/api/climbs?board_id=1')
      .then(response => setClimbs(response.data))
      .catch(console.error);
  }, [setClimbs]);

  const formattedFilenames = getFormattedImageFilenames();

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
        {formattedFilenames.map((filename, index) => (
          <img
            key={index}
            src={`https://lczm.me/boardbuddy/api/images/${filename}`}
            alt="Hold position"
            className="hold-image"
          />
        ))}
      </div>
    </div>
  );
}