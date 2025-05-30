import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import BoardSelector from './components/BoardSelector';
import DesktopView from './components/DesktopView';
import MobileView from './components/MobileView';
import './App.css';

function App() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });

  useEffect(() => {
    axios.get('https://lczm.me/boardbuddy/api/boards')
      .then(response => {
        console.log('API Response:', response.data);
        setBoards(response.data.boards || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('API Error:', error);
        setBoards([]);
        setLoading(false);
      });
  }, []);

  return (
    <Routes>
      <Route 
        path="/" 
        element={<BoardSelector boards={boards} loading={loading} />} 
      />
      <Route 
        path="/dashboard" 
        element={
          isDesktop ? 
          <DesktopView /> : 
          <MobileView />
        }
      />
    </Routes>
  );
}

export default App;