import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const Header = () => {
  const [sidetoggle, setSideToggle] = useState(false)

  const handletoggleBtn = () => {
    setSideToggle(!sidetoggle)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('login'); // Remove login status
    window.location.href='/login' // Redirect to login page
  };



  return (
    <>
      <header>
        <div className="top-head">
          <div className="right">
            <h2>Cake Admin Panel</h2>
            <div className="bar" onClick={handletoggleBtn}>
              <i class="fa-solid fa-bars"></i>
            </div>
          </div>
          <div className="left">
            <a href="https://www.cakecrazzy.com" target="_blank">
              <i class="fa-solid fa-globe"></i>
              Go To Website
            </a>

            <div className="logout" onClick={handleLogout}>
              Log Out <i className="fa-solid fa-right-from-bracket"></i>
            </div>
          </div>

        </div>

        <div className={`rightNav ${sidetoggle ? "active" : ""} `}>
          <ul>
            <li><Link to="/dashboard" onClick={handletoggleBtn}> <i class="fa-solid fa-gauge"></i> Dashboard</Link></li>
            <li><Link to="/all-orders" onClick={handletoggleBtn}> <i class="fa-solid fa-truck"></i> Manage Orders</Link></li>
            <li><Link to="/all-contact-query" onClick={handletoggleBtn}> <i class="fa-solid fa-users"></i> All Contact Query</Link></li>
            <li><Link to="/all-category" onClick={handletoggleBtn}> <i class="fa-solid fa-tags"></i> Manage Category</Link></li>
            <li><Link to="/all-subcategory" onClick={handletoggleBtn}> <i class="fa-solid fa-tag"></i> Manage Sub Category</Link></li>
            <li><Link to="/all-products" onClick={handletoggleBtn}> <i class="fa-solid fa-boxes-stacked"></i> Manage Product</Link></li>
            <li><Link to="/all-size" onClick={handletoggleBtn}> <i class="fa-solid fa-ruler-combined"></i> Manage Size</Link></li>
            <li><Link to="/all-banners" onClick={handletoggleBtn}> <i class="fa-regular fa-images"></i> Manage Banners</Link></li>
            <li><Link to="/all-users" onClick={handletoggleBtn}> <i class="fa-solid fa-users"></i> All Users</Link></li>

            <div className="logout" onClick={handleLogout}>
              Log Out <i className="fa-solid fa-right-from-bracket mb-4"></i>
            </div>

          </ul>
        </div>

      </header>
    </>
  )
}

export default Header