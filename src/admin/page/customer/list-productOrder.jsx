import React, { useEffect, useState } from "react";
import { LIST_PRODUCTS_ORDER } from "../../api";
import { Helmet } from "react-helmet";
import HeaderComponents from "../../../components/header";
import { http } from "../../utils/http";
import { useParams } from "react-router-dom";
import Loading from "../../../components/loading";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function ListproductOrder() {
  const Title = "Danh sách hàng đã lấy";
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  let { id } = useParams();
  //   lấy dữ liệu về
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await http
        .get(LIST_PRODUCTS_ORDER + id)
        .then((response) => {
          if (response.status === 200) {
            setLoading(false);
            setData(response.data.list_productOrder);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error(error.response);
        });
    };
    getData();
  }, [id]);

  const columns = [
    { field: "index", headerName: "STT" },
    { field: "code", headerName: "Mã sản phẩm", minWidth: 220, flex: 1 },
    { field: "name", headerName: "Tên sản phẩm", minWidth: 120, flex: 1 },
    { field: "quality", headerName: "Số lượng đã mua", minWidth: 120, flex: 1 },
    { field: "date", headerName: "Ngày nhập cuối", minWidth: 120, flex: 1 },
  ];
  const rows = data?.map((item, index) => ({
    index: ++index,
    id: item.id,
    name: item.name,
    code: item.code,
    date: item.date,
    quality: item.total_quality,
  }));
  console.log(data);
  return (
    <section className="pcoded-content">
      <Helmet>
        <title>{Title}</title>
      </Helmet>
      <HeaderComponents
        label={"Quản lý khách hàng"}
        title={"Danh sách đơn đã lấy"}
      />
      <div className="m-4">
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <div className="header_title">
                <h5>Thông tin</h5>
              </div>
              <small>Danh sách hàng đã lấy của khách!</small>
            </div>
          </div>
          {data?.length === 0 ? (
            <div
              style={{
                height: 600,
                position: "relative",
                justifyContent: "center",
              }}
            >
              <span className="ml-4 mt-4 absolute">Chưa có thông tin!</span>
              <img
                className="absolute left-0 right-0 mt-[100px] mx-auto"
                src="https://i1.wp.com/www.huratips.com/wp-content/uploads/2019/04/empty-cart.png?fit=603%2C288&ssl=1"
              />
            </div>
          ) : (
            <div className="body p-4 mt-24">
              <DataGrid
                rows={rows || []}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                showCellVerticalBorder
                showColumnVerticalBorder
                initialState={{
                  ...data?.initialState,
                  pagination: { paginationModel: { pageSize: 15 } },
                }}
                pageSizeOptions={[15, 50, 100]}
                columns={columns}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
      <>{loading ? <Loading /> : null}</>
    </section>
  );
}
