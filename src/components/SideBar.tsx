// components/Sidebar.tsx
import React from 'react';
import './Sidebar.css'; // Import the specific styles for the sidebar if necessary

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
        <li><a href="/">🏠 {isSidebarCollapsed ? '' : 'Dashboard'}</a></li>
        <li><a href="/profile">👤 {isSidebarCollapsed ? '' : 'Profile'}</a></li>
        {/* Add more links as needed */}
      </ul>
    </nav>
  );
};

export default Sidebar;
