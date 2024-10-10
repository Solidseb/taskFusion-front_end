import React from 'react';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import './Sidebar.css';

interface SidebarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarCollapsed, toggleSidebar }) => {
  return (
    <nav className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">{isSidebarCollapsed ? 'TF' : 'TaskFusion'}</h2>
        <button className="collapse-button" onClick={toggleSidebar}>
          {isSidebarCollapsed ? '>' : '<'}
        </button>
      </div>
      <ul className="sidebar-menu">
        <li className={window.location.pathname === '/' ? 'active' : ''}>
          <Link to="/">
            <DashboardIcon /> {isSidebarCollapsed ? '' : 'Dashboard'}
          </Link>
        </li>
        <li className={window.location.pathname === '/profile' ? 'active' : ''}>
          <Link to="/profile">
            <PersonIcon /> {isSidebarCollapsed ? '' : 'Profile'}
          </Link>
        </li>
        <li className={window.location.pathname === '/settings' ? 'active' : ''}>
          <Link to="/settings">
            <SettingsIcon /> {isSidebarCollapsed ? '' : 'Settings'}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
