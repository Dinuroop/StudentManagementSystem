import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import ham from './assests/ham.png'
import './Navbar.css'

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false)

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
  }

  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo" onClick={()=>navigate('/')}>
          <strong>Student Management System</strong>
        </div>
        <div className="menu-icon" onClick={handleShowNavbar}>
            <img src={ham} alt="ham"/>
        </div>
        <div className={`nav-elements  ${showNavbar && 'active'}`}>
          <ul>
            <li>
              <NavLink to="/AddStudent">Add Student</NavLink>
            </li>
            <li>
              <NavLink to="/StudentDetails">Students</NavLink>
            </li>
            <li>
              <NavLink to="/Edit&Delete">Edit</NavLink>
            </li>
            <li>
              <NavLink to="/ShowSubs">Subject Details</NavLink>
            </li>
            <li>
              <NavLink to="/MultiSearch">Search</NavLink>
            </li>
            <li>
              <NavLink to="/Average">Average</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar