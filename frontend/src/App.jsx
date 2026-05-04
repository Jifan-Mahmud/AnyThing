import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from './components/layout/AppLayout';
import Feed from './pages/Feed';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Feed />} />
          <Route path="reels" element={<div className="p-4">Reels Page (Coming Soon)</div>} />
          <Route path="explore" element={<div className="p-4">Explore Page (Coming Soon)</div>} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<div className="p-4">Notifications Page (Coming Soon)</div>} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <ToastContainer theme="dark" position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
