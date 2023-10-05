import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";
export default function Header() {
  return (
    <nav className="navbar header-navbar pcoded-header">
      <div className="navbar-wrapper">
        <div className="navbar-logo">
          <a
            className="mobile-menu waves-effect waves-light"
            id="mobile-collapse"
          >
            <i className="ti-menu" />
          </a>
          <div className="mobile-search waves-effect waves-light">
            <div className="header-search">
              <div className="main-search morphsearch-search">
                <div className="input-group">
                  <span className="input-group-addon search-close">
                    <i className="ti-close" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Keyword"
                  />
                  <span className="input-group-addon search-btn">
                    <i className="ti-search" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Link to={"/"}>
            <img
              className="img-fluid"
              src="/assets/images/logo.png"
              alt="Theme-Logo"
            />
          </Link>
          <a className="mobile-options waves-effect waves-light">
            <i className="ti-more" />
          </a>
        </div>
        <div className="navbar-container container-fluid">
          <ul className="nav-left">
            <li>
              <div className="sidebar_toggle">
                <a href="">
                  <i className="ti-menu" />
                </a>
              </div>
            </li>
          </ul>
          <ul className="nav-right">
            <li className="header-notification">
              <ul className="show-notification">
                <li>
                  <h6>Notifications</h6>
                  <label className="label label-danger">New</label>
                </li>
                <li className="waves-effect waves-light">
                  <div className="media">
                    <img
                      className="d-flex align-self-center img-radius"
                      src="assets/images/avatar-2.jpg"
                      alt="Generic placeholder image"
                    />
                    <div className="media-body">
                      <h5 className="notification-user">John Doe</h5>
                      <p className="notification-msg">
                        Lorem ipsum dolor sit amet, consectetuer elit.
                      </p>
                      <span className="notification-time">30 minutes ago</span>
                    </div>
                  </div>
                </li>
                <li className="waves-effect waves-light">
                  <div className="media">
                    <img
                      className="d-flex align-self-center img-radius"
                      src="assets/images/avatar-4.jpg"
                      alt="Generic placeholder image"
                    />
                    <div className="media-body">
                      <h5 className="notification-user">Joseph William</h5>
                      <p className="notification-msg">
                        Lorem ipsum dolor sit amet, consectetuer elit.
                      </p>
                      <span className="notification-time">30 minutes ago</span>
                    </div>
                  </div>
                </li>
                <li className="waves-effect waves-light">
                  <div className="media">
                    <img
                      className="d-flex align-self-center img-radius"
                      src="assets/images/avatar-3.jpg"
                      alt="Generic placeholder image"
                    />
                    <div className="media-body">
                      <h5 className="notification-user">Sara Soudein</h5>
                      <p className="notification-msg">
                        Lorem ipsum dolor sit amet, consectetuer elit.
                      </p>
                      <span className="notification-time">30 minutes ago</span>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
