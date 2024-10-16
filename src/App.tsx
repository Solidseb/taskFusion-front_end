import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import CapsuleDetail from './components/CapsuleDetail';
import Auth from './components/Auth';
import Profile from './components/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskDetail from './components/TaskDetail';
import TopBar from './components/TopBar';
import Sidebar from './components/SideBar';
import { CapsuleProvider } from './context/CapsuleContext'; // Import CapsuleProvider

import './App.css';
import './components/TopBar.css';

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <CapsuleProvider> {/* Wrap entire app with CapsuleProvider */}
      <Router>
        <div className={`app-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/*"
              element={
                <>
                  <Sidebar isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
                  <div className="main-content">
                    <TopBar />
                    <div className="content">
                      <ToastContainer />
                      <Routes>
                        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/capsules/:id" element={<PrivateRoute><CapsuleDetail /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                        <Route path="/tasks/:taskId" element={<PrivateRoute><TaskDetail /></PrivateRoute>} />
                      </Routes>
                    </div>
                  </div>
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </CapsuleProvider>
  );
};

export default App;
