import React, { useState } from "react";
import { Link } from "react-router-dom";
export default function HeaderComponents({ label, title }) {
  return (
    <div className="page-header" style={{ marginTop: 56, height: 114.5 }}>
      <div className="page-block">
        <div className="row align-items-center">
          <div className="col-md-8">
            <div className="page-header-title">
              <h5 className="m-b-10">{label}</h5>
              <p className="m-b-0">{title}</p>
            </div>
          </div>
          <div className="col-md-4">
            <ul className="breadcrumb-title">
              <li className="breadcrumb-item">
                <div>
                  <i className="fa fa-home" />
                </div>
              </li>
              <li className="breadcrumb-item">
                <Link to={"/"}>Trang Chủ</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
