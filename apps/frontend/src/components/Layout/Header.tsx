import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => (
  <header style={{ padding: 12, background: '#222', color: '#fff' }}>
    <Link to="/videos" style={{ color: '#fff', textDecoration: 'none' }}>
      <h1>Vision Insights</h1>
    </Link>
  </header>
);