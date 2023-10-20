import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Loading from "../../../components/loading";
import HeaderComponents from "../../../components/header";
import { useGetDataGroup } from "../../api/useFetchData";

// hàm xóa nhóm phẩm
export default function CalculateWage() {
  const Title = "Danh sách nhóm hàng";
  const queryKey = "productgroup_key";
  const { data, isLoading, error } = useGetDataGroup(queryKey);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="pcoded-content">
      <Helmet>
        <title>{Title}</title>
      </Helmet>
      <HeaderComponents
        label={"Quản lý nhóm hàng"}
        title={"Danh sách bảng tính lương"}
      />
      <div className="card m-4">
        <div className="card-header">
          <div className="card-header-left">
            <div className="header_title">
              <h5>Thông tin</h5>
            </div>
            <small>Bảng tính lương</small>
          </div>
        </div>
        <div className=" card-block remove-label">
          <table className="table table-bordered table-striped table-hover dataTable js-exportable">
            <thead className="text-left">
              <tr>
                <th>STT</th>
                <th>Mã nhóm</th>
                <th>Tên nhóm</th>
                <th>Tính lương</th>
              </tr>
            </thead>
            <tbody className="text-left">
              {data?.data?.map((item, index) => {
                return (
                  <tr key={item.id} className="">
                    <th>{++index}</th>
                    <th>{item.group_code}</th>
                    <th>{item.group_name}</th>
                    {item.commission_type == 0 ? (
                      <th>{item.commission_type}%</th>
                    ) : (
                      <th>
                        {item.commission}/{item.commission_target}
                      </th>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
