import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { BsFillCartPlusFill } from "react-icons/bs";
import { useQuery } from "react-query";
import { useGetDataHome } from "../admin/api/useFetchData";

export default function Home() {
  const Title = "Quản lý kho";
  const queryKey = "home_key";
  const { data, error, isLoading } = useQuery(
    queryKey,
    useGetDataHome(queryKey)
  );
  console.log(data);
  return (
    <div className="pcoded-main-container">
      <Helmet>
        <title>{Title}</title>
      </Helmet>
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
                              <h4 className="text-c-purple">
                                {parseFloat(
                                  Math.round(data?.totalSales || 0)
                                ).toLocaleString("en-US") + " VNĐ"}
                              </h4>
                              <h6 className="text-muted m-b-0">
                                Doanh số tháng (cả hàng ngoài)
                              </h6>
                            </div>
                            <div className="col-4 text-right">
                              <span className="text-5xl font-medium">$</span>
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
                              <h4 className="text-c-green">
                                {parseFloat(
                                  Math.round(data?.totalOrder || 0)
                                ).toLocaleString("en-US") + " Đơn"}
                              </h4>
                              <h6 className="text-muted m-b-0">
                                Đơn hàng trong tháng
                              </h6>
                            </div>
                            <div className="col-4">
                              <BsFillCartPlusFill
                                className="ml-auto"
                                size={30}
                              />
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
                              <h4 className="text-c-red">131,500 VND</h4>
                              <h6 className="text-muted m-b-0">
                                Doanh số tháng (Sopoka)
                              </h6>
                            </div>
                            <div className="col-4 text-right">
                              <span className="text-5xl font-medium">$</span>
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
                              <h4 className="text-[#BDC3C7]">
                                {parseFloat(
                                  Math.round(data?.totalPrice || 0)
                                ).toLocaleString("en-US") + " VNĐ"}
                              </h4>
                              <h6 className="text-muted m-b-0">
                                Tổng số tiền nhập trong tháng
                              </h6>
                            </div>
                            <div className="col-4 text-right">
                              <span className="text-5xl font-medium">$</span>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-[#BDC3C7]">
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
                    {/*  */}
                    <div className="col-xl-3 col-md-6">
                      <div className="card">
                        <div className="card-block">
                          <div className="row align-items-center">
                            <div className="col-8">
                              <h4 className="text-[#34495E]">
                                {parseFloat(
                                  Math.round(data?.totalStaffDebt || 0)
                                ).toLocaleString("en-US") + " VNĐ"}
                              </h4>
                              <h6 className="text-muted m-b-0">
                                Công nợ nhân viên
                              </h6>
                            </div>
                            <div className="col-4 text-right">
                              <span className="text-5xl font-medium">$</span>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-[#34495E]">
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
                              <h4 className="text-[#3498DB]">
                                {parseFloat(
                                  Math.round(data?.totalCustomerDebt || 0)
                                ).toLocaleString("en-US") + " VNĐ"}
                              </h4>
                              <h6 className="text-muted m-b-0">
                                Công nợ khách hàng
                              </h6>
                            </div>
                            <div className="col-4 text-right">
                              <span className="text-5xl font-medium">$</span>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-[#3498DB]">
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
