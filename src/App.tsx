import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import CapsuleDetail from './components/CapsuleDetail';
import Auth from './components/Auth';
import Profile from './components/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskDetail from './components/TaskDetail';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/capsules/:id" element={<PrivateRoute><CapsuleDetail /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/tasks/:taskId" element={<PrivateRoute><TaskDetail capsuleId={0} /></PrivateRoute>} />
        {/* Public Routes */}
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
