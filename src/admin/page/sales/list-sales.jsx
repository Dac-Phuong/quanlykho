import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Loading from "../../../components/loading";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DELETE_PURCHASES,
  FILTER_PURCHASES,
  GET_PURCHASES_DETAIL,
} from "../../api";
import { showToastError, showToastSuccess } from "../../utils/toastmessage";
import HeaderComponents from "../../../components/header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AlertDialogPurchase from "../../../components/modal/modal-purchase";
import { useGetListDataSales } from "../../api/useFetchData";
import { http } from "../../utils/http";

// xóa mặt hàng
const deteteItemPurchases = async (id) => {
  try {
    const response = await http.delete(DELETE_PURCHASES + id);
    showToastSuccess("Xóa đơn hàng công");
    return response.data;
  } catch (error) {
    showToastError("Xóa đơn hàng thành công");
  }
};

export default function ListSales() {
  const Title = "Danh sách đơn bán";
  const [newdata, setNewData] = useState([]);
  const firstDayOfMonth = dayjs().startOf("month");
  const lastDayOfMonth = dayjs().endOf("month");
  const [from_date, setFrom_Date] = useState(dayjs(firstDayOfMonth));
  const [to_date, setTo_Date] = useState(dayjs(lastDayOfMonth));
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteMutation = useMutation(deteteItemPurchases);
  const [newId, setNewId] = useState(null);
  const queryKey = "list_sales";
  const purchaseDetail = async (newId) => {
    const response = await http.get(GET_PURCHASES_DETAIL + newId);
    return response.data;
  };
  // lấy data về
  const { data, isLoading } = useQuery(queryKey, useGetListDataSales(queryKey));
  const {
    data: purchases_detail,
    isLoading: isLoadings,
    isError: isErrors,
  } = useQuery(["purchases_detail", newId], () => purchaseDetail(newId), {
    enabled: !!newId,
  });
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  // hàm xóa purchases
  const handleDeletePurchases = (id) => {
    const isConfirmed = window.confirm("Bạn có chắn muốn xóa không?");
    if (isConfirmed) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKey });
        },
      });
    }
  };
  // hàm lọc bán hàng
  const submitFilter = async () => {
    await http
      .post(FILTER_PURCHASES, {
        from_date,
        to_date,
      })
      .then((response) => {
        if (response.status === 200) {
          setNewData(response.data.list_item);
        }
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (data) {
      setNewData(data?.purchases);
    }
  }, [isLoading, data]);

  if (isLoading) {
    return <Loading />;
  }
  const columns = [
    { field: "index", headerName: "STT", minWidth: 70 },
    { field: "date", headerName: "Ngày bán", minWidth: 110, flex: 1 },
    { field: "staff_name", headerName: "Nhân viên", minWidth: 130 },
    { field: "customer_name", headerName: "Khách hàng", minWidth: 130 },
    { field: "warehouse_name", headerName: "Kho xuất", minWidth: 130 },
    { field: "debt", headerName: "Chiết khấu", minWidth: 130 },
    { field: "status", headerName: "Trạng thái", minWidth: 130 },
    {
      field: "paid",
      headerName: "Đã thanh toán",
      flex: 1,
      minWidth: 160,
    },
    { field: "total_price", headerName: "Tổng tiền", flex: 1, minWidth: 140 },
    {
      field: "active",
      headerName: "Thao tác",
      minWidth: 215,
      flex: 1,
      renderCell: (params) => {
        return (
          <div class="dropdown-primary  selection:dropdown open show">
            <button
              class="btn btn-primary  btn-button dropdown-toggle waves-effect waves-light "
              type="button"
              id="dropdown-3"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true"
              fdprocessedid="1jjah"
            >
              primary 
            </button>
            <div
              class="dropdown-menu show"
              aria-labelledby="dropdown-3"
              data-dropdown-in="fadeIn"
              data-dropdown-out="fadeOut"
              x-placement="bottom-start"
            >
              <a class="dropdown-item waves-light waves-effect" href="#">
                Action
              </a>
              <a class="dropdown-item waves-light waves-effect" href="#">
                Another action
              </a>
              <a class="dropdown-item waves-light waves-effect" href="#">
                Something else
              </a>
            </div>
          </div>
        );
      },
    },
  ];
  const rows = newdata?.map((item, index) => ({
    id: item?.id,
    index: ++index,
    date: item?.date,
    status: item?.status === 0 ? "Chưa nhận hàng" : "Đã nhận hàng",
    warehouse_name: item?.warehouse_name,
    staff_name: item?.staff_name,
    customer_name: item?.customer_name,
    debt: item?.debt + "%",
    paid: "0 đồng",
    total_price:
      parseFloat(Math.round(item?.total_price)).toLocaleString("en-US") +
      " đồng",
  }));

  return (
    <section className="pcoded-content">
      <Helmet>
        <title>{Title}</title>
      </Helmet>
      <HeaderComponents
        label={"Quản lý bán hàng"}
        title={"Danh sách đơn bán"}
      />
      <div className="m-4">
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <div className="header_title">
                <h5>Thông tin</h5>
              </div>
              <small>
                Các đơn hàng đã bán! Thêm đơn hàng mới
                <Link
                  className="pl-2 text-[#777] font-bold"
                  to={"/quan-ly-kho/them-hang-moi"}
                >
                  TẠI ĐÂY
                </Link>
              </small>
            </div>
          </div>
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
                              <h6 className="text-muted m-b-0">
                                Tổng doanh số
                              </h6>
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
                              <h4 className="text-c-green">$30200</h4>
                              <h6 className="text-muted m-b-0">
                                Đã thanh toán
                              </h6>
                            </div>
                            <div className="col-4 text-right">
                              <i className="fa fa-bar-chart f-28" />
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
                                Chưa thanh toán
                              </h6>
                            </div>
                            <div className="col-4 text-right">
                              <i className="fa fa-bar-chart f-28" />
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between max-sm:justify-normal flex-wrap ">
              <LocalizationProvider
                className="flex flex-nowrap w-[100%]"
                dateAdapter={AdapterDayjs}
              >
                <DatePicker
                  className="w-[32%] max-sm:w-[48%] mr-2 max-sm:mr-1"
                  label="Từ ngày"
                  value={from_date}
                  onChange={(newValue) => setFrom_Date(newValue)}
                  slotProps={{ textField: { variant: "filled" } }}
                />
                <DatePicker
                  className="w-[32%] max-sm:w-[48%]"
                  label="Đến ngày"
                  value={to_date}
                  onChange={(newValue) => setTo_Date(newValue)}
                  slotProps={{ textField: { variant: "filled" } }}
                />
              </LocalizationProvider>
              <div className="form-inline max-sm:mt-5 max-sm:w-full w-[32%]">
                <button
                  className="btn btn-button btn-danger waves-effect waves-light w-full"
                  type="submit"
                  fdprocessedid="88fg6k"
                  onClick={() => submitFilter()}
                >
                  Lọc đơn hàng
                </button>
              </div>
            </div>
            <div className="body mt-24">
              <DataGrid
                rows={rows}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                showCellVerticalBorder
                showColumnVerticalBorder
                initialState={{
                  ...data?.initialState,
                  pagination: { paginationModel: { pageSize: 20 } },
                }}
                pageSizeOptions={[20, 50, 100]}
                columns={columns}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
              />
            </div>
          </div>
        </div>
        <AlertDialogPurchase
          handleCloseModal={handleCloseModal}
          isModalOpen={isModalOpen}
          purchasesDetail={purchases_detail}
          isLoadings={isLoadings}
        />
      </div>
    </section>
  );
}
