import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import CapsuleDetail from "./components/CapsuleDetail";
import Auth from "./components/Auth";
import Profile from "./components/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskDetail from "./components/TaskDetail";
import TopBar from "./components/TopBar"; // Import your new TopBar
import Sidebar from "./components/SideBar"; // Import the new Sidebar
import "./App.css";  // Main layout styles
import "./components/TopBar.css"; // New TopBar styles

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Router>
      <div className={`app-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Conditional Rendering for Sidebar and TopBar */}
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/*"
            element={
              <>
                <Sidebar isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
                <div className="main-content">
                  <TopBar /> {/* Top bar at the top */}
                  <div className="content">
                    <ToastContainer />
                    <Routes>
                      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                      <Route path="/capsules/:id" element={<PrivateRoute><CapsuleDetail /></PrivateRoute>} />
                      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                      <Route path="/tasks/:taskId" element={<PrivateRoute><TaskDetail capsuleId={0} /></PrivateRoute>} />
                    </Routes>
                  </div>
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
