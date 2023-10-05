import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="pcoded-main-container">
      <div className="pcoded-wrapper">
        <div className="pcoded-content">
          {/* Page-header start */}
          <div className="page-header">
            <div className="page-block">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="page-header-title">
                    <h5 className="m-b-10">Bảng điều khiển</h5>
                    <p className="m-b-0">
                      Chào mừng đến với ứng dụng Quản lý kho
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <ul className="breadcrumb-title">
                    <li className="breadcrumb-item">
                      <a href="index.html">
                        <i className="fa fa-home" />
                      </a>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to={"/"}>Trang Chủ</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Page-header end */}
          <div className="pcoded-inner-content">
            <div className="main-body">
              <div className="page-wrapper">
                <div className="page-body">
                  <div className="row">
                    <div className="col-xl-3 col-md-6">
                      <div className="card">
                        <div className="card-block">
                          <div className="row align-items-center">
                            <div className="col-8">
                              <h4 className="text-c-purple">$30200</h4>
                              <h6 className="text-muted m-b-0">All Earnings</h6>
                            </div>
                            <div className="col-4 text-right">
                              <i className="fa fa-bar-chart f-28" />
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-c-purple">
                          <div className="row align-items-center">
                            <div className="col-9">
                              <p className="text-white m-b-0">% change</p>
                            </div>
                            <div className="col-3 text-right">
                              <i className="fa fa-line-chart text-white f-16" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                      <div className="card">
                        <div className="card-block">
                          <div className="row align-items-center">
                            <div className="col-8">
                              <h4 className="text-c-green">290+</h4>
                              <h6 className="text-muted m-b-0">Page Views</h6>
                            </div>
                            <div className="col-4 text-right">
                              <i className="fa fa-file-text-o f-28" />
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-c-green">
                          <div className="row align-items-center">
                            <div className="col-9">
                              <p className="text-white m-b-0">% change</p>
                            </div>
                            <div className="col-3 text-right">
                              <i className="fa fa-line-chart text-white f-16" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                      <div className="card">
                        <div className="card-block">
                          <div className="row align-items-center">
                            <div className="col-8">
                              <h4 className="text-c-red">145</h4>
                              <h6 className="text-muted m-b-0">
                                Task Completed
                              </h6>
                            </div>
                            <div className="col-4 text-right">
                              <i className="fa fa-calendar-check-o f-28" />
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-c-red">
                          <div className="row align-items-center">
                            <div className="col-9">
                              <p className="text-white m-b-0">% change</p>
                            </div>
                            <div className="col-3 text-right">
                              <i className="fa fa-line-chart text-white f-16" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                      <div className="card">
                        <div className="card-block">
                          <div className="row align-items-center">
                            <div className="col-8">
                              <h4 className="text-c-blue">500</h4>
                              <h6 className="text-muted m-b-0">Downloads</h6>
                            </div>
                            <div className="col-4 text-right">
                              <i className="fa fa-hand-o-down f-28" />
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-c-blue">
                          <div className="row align-items-center">
                            <div className="col-9">
                              <p className="text-white m-b-0">% change</p>
                            </div>
                            <div className="col-3 text-right">
                              <i className="fa fa-line-chart text-white f-16" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
