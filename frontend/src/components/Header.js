import React from 'react';

function Header({ title }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="/logo.svg" alt="NyaySadhak Logo" />
      </div>
      <h1>{title}</h1>
    </header>
  );
}

export default Header;