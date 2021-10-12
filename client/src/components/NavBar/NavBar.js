import React from "react";
import { Link } from "react-router-dom";
import { useSnapshot } from "valtio";
import {theme} from '../../theme'
import "./NavBar.css";

function NavBar() {
  const snap = useSnapshot(theme);
  return (
    <div className="navbar">
            <div className="nav-logo">
                <Link to='/' className="nav-logo">MOTORQ</Link>
            </div>
            <div className='nav-item'>
                <Link to='/' className='nav-item'>Dashboard</Link>
            </div>
            <div className='nav-item'>
                <Link to='/vehicles' className='nav-item'>Vehicles</Link>
            </div>
            <div onClick={()=>theme.isDarkTheme = !theme.isDarkTheme} className='nav-item-toggle'>
              {snap.isDarkTheme ? 'Light' : 'Dark'}
            </div>
    </div>
  );
}

export default NavBar;
