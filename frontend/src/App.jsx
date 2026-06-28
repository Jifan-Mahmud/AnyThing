import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader2 } from 'lucide-react';

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
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-primary-pink" size={40} />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-primary-pink" size={40} />
      </div>
    );
  }
  if (user) {
    return <Navigate to="/app" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupForm /></PublicRoute>} />
        
        <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
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



// Reel gulo (/app) valo kore dekha jache nah.er (/app) 🎬
// Reels secsone click kore reels (app/reels) open hoy nah .
