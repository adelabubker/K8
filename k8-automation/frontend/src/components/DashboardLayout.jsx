// src/components/DashboardLayout.jsx — Dashboard shell with sidebar
import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-void)' }}>
      <Sidebar />
      <main style={{
        flex: 1, overflow: 'auto',
        padding: '32px 36px',
        background: 'var(--bg-void)',
      }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
