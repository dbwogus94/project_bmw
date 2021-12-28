import React, { memo } from 'react';

const Header = memo(({ onLogout, onMyBM, onEditBM, onBusSearch, onMetroSearch, onStopSearch }) => {
  return (
    <header className="header">
      <div className="logo">
        <img src={`${process.env.PUBLIC_URL}/img/logo2.png`} alt="BMW Logo" className="logo-img" />
        {/* <h1 className="logo-name">BMW</h1> */}
        {/* {username && <span className="logo-user">@{username}</span>} */}
      </div>
      {/* {username && ( */}
      <nav className="menu">
        <div className="menu-div">
          <button onClick={onMyBM}>MY BM</button>
          <button onClick={onEditBM}>EDIT MB</button>
          <button onClick={onLogout}>LOGOUT</button>
        </div>
        <div className="menu-div">
          <button onClick={onBusSearch}>BUS</button>
          <button onClick={onMetroSearch}>METRO</button>
          <button onClick={onStopSearch}>STOP</button>
        </div>
      </nav>
      {/* )} */}
    </header>
  );
});

export default Header;
