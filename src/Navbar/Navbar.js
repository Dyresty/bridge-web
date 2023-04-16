import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import './Navbar.css';
import logo from './images/logo.png'

function NavBar() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
          <a href="#"><img class="img-responsive" src={logo} style={{"width":"150px", "height":"130px"}}/></a>
          </NavLink>
          
          <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
              <NavLink
                exact
                to="/homepage"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/eventspage"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Rewards
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/contactpage"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Leaderboard
              </NavLink>
            </li>
            
            
            
            
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;

/*
<li className="nav-item">
              <NavLink
                exact
                to="/aboutpage"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                About
              </NavLink>
            </li>
*/