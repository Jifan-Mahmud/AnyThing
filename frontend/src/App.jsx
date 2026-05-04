
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from './components/layout/AppLayout';
import Feed from './pages/Feed';
import Messages from './pages/Messages';
import Login from './pages/Login'; // This is the landing page
import Profile from './pages/Profile';
import Reels from './pages/Reels';
import Explore from './pages/Explore';
import Notifications from './pages/Notifications';
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Feed />} />
          <Route path="reels" element={<Reels />} />
          <Route path="explore" element={<Explore />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer theme="dark" position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
