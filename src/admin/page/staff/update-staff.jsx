import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useQueryClient, useMutation, useQuery } from "react-query";
import Loading from "../../../components/loading";
import {
  GET_ITEM_STAFF,
  UPDATE_STAFF_STATUS,
  EDIT_STAFF,
  UPDATE_STAFF,
} from "../../api";
import { showToastError, showToastSuccess } from "../../utils/toastmessage";
import HeaderComponents from "../../../components/header";
import { TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getUserData } from "../../utils/function";
import AlertDialogStaff from "../../../components/modal/modal-staff";
import { useNavigate, useParams } from "react-router-dom";
import { useGetDataListStaff } from "../../api/useFetchData";
import { http } from "../../utils/http";


export default function UpdateStaff() {
  const Title = "Sửa nhân viên";
  const navigate = useNavigate();
  const [loading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const [newData, setNewData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffId, setStaffId] = useState(null);
  let { id } = useParams();
  const [newId, setNewId] = useState(id);
  const [item_staff, setItem_staff] = useState({});
  const queryKey = "staff_key";
  const userData = getUserData();
  const [formData, setFormData] = useState({
    user_id: userData?.user?.id,
    fullname: "",
    address: "",
    phone: "",
    debt: 0,
  });

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      await http
        .get(EDIT_STAFF + newId)
        .then((response) => {
          if (response.status === 200) {
            setIsLoading(false);
            setFormData({
              fullname: response?.data?.item_staff?.fullname,
              address: response?.data?.item_staff.address,
              phone: response?.data?.item_staff?.phone,
              debt: response?.data?.item_staff?.debt,
            });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error(error.response);
        });
    };
    getData();
  }, [newId]);
  //   lấy dữ liệu từ input
  const handleInputChange = (event) => {
    const { name, value } = event?.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // lấy dữ liệu về
  const { data, isLoading } = useQuery(queryKey,useGetDataListStaff(queryKey)
  );

  // hàm tạo kho từ useQuery
  const updateStaff = async (formData) => {
    try {
      const response = await http.put(UPDATE_STAFF + id, formData);
      setIsLoading(false);
      showToastSuccess("Sửa nhân viên thành công!");
      navigate("/nhan-vien/them-nhan-vien");
      return response?.data;
    } catch (error) {
      setIsLoading(false);
      showToastError("Sửa nhân viên thất bại!");
      console.log(error);
    }
  };
  //   cập nhật
  const updateStatus = async (id) => {
    try {
      const response = await http.put(UPDATE_STAFF_STATUS + id, formData);
      showToastSuccess("Thay đổi trạng thái thành công");
      return response.data;
    } catch (error) {
      showToastError("Thay đổi trạng thái thất bại");
    }
  };
  const updateStatuss = useMutation(updateStatus);
  const handleUpdateStatus = (id) => {
    updateStatuss.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKey });
      },
    });
  };
  // hàm update
  const mutation = useMutation(updateStaff, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
    onError: (error) => {
      console.error("Lỗi khi gửi yêu cầu POST:", error);
    },
  });
  // kiểm tra dữ liệu
  const validation = () => {
    let isValid = true;
    const regex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/;
    if (formData.fullname.trim() === "") {
      showToastError("Vui nhập tên nhân viên!");
      isValid = false;
    } else if (regex.test(formData.fullname)) {
      showToastError("Tên nhân viên không được chứa ký tự đặc biệt!");
      isValid = false;
    }
    if (formData.phone === "") {
      showToastError("Vui nhập số điện thoại nhân viên!");
      isValid = false;
    } else if (regex.test(formData.phone)) {
      showToastError("Số điện thoại không được chứa ký tự đặc biệt!");
      isValid = false;
    }
    if (formData.address.trim() === "") {
      showToastError("Vui nhập địa chỉ nhân viên!");
      isValid = false;
    } else if (regex.test(formData.address)) {
      showToastError("Địa chỉ không được chứa ký tự đặc biệt!");
      isValid = false;
    }
    return isValid;
  };

  // hàm update
  const submitForm = () => {
    const isValid = validation();
    if (isValid) {
      setIsLoading(true);
      mutation.mutate(formData);
    }
  };

  const handleGetItem = async (id) => {
    setStaffId(id);
    setIsModalOpen(true);
    await http
      .get(GET_ITEM_STAFF + id)
      .then((response) => {
        if (response.status === 200) {
          setItem_staff(response.data);
        }
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  const handleCloseModal = () => {
    setStaffId(null);
    setIsModalOpen(false);
  };

  const columns = [
    { field: "index", headerName: "STT" },
    { field: "fullname", headerName: "Họ và tên", minWidth: 120, flex: 1 },
    { field: "address", headerName: "Địa chỉ", minWidth: 220, flex: 1 },
    { field: "phone", headerName: "Số điện thoại", minWidth: 140 },
    { field: "debt", headerName: "Công nợ", minWidth: 120 },
    { field: "active", headerName: "Trạng thái", minWidth: 120 },
    {
      field: "action",
      headerName: "Thao tác",
      minWidth: 390,
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            <button
              className="btn btn-button  btn-primary ml-2"
              onClick={() => setNewId(params?.row?.id)}
            >
              sửa
            </button>
            <button className="btn btn-info btn-button waves-effect waves-light ml-2">
              Báo cáo
            </button>
            <button
              className="btn btn-button  btn-warning waves-effect waves-light ml-2"
              onClick={() => handleGetItem(params?.row?.id)}
            >
              Công nợ
            </button>
            <button
              className={
                params?.row?.active === "đang làm"
                  ? "btn btn-button btn-danger waves-effect waves-light ml-2"
                  : "btn btn-button btn-success waves-effect waves-light ml-2"
              }
              fdprocessedid="k4qcck"
              onClick={() => handleUpdateStatus(params?.row?.id)}
            >
              {params?.row?.active === "đang làm" ? "Nghỉ việc" : "Làm lại"}
            </button>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (data) {
      setNewData(data?.data);
    }
  }, [isLoading, data]);

  const rows = newData?.map((item, index) => ({
    id: item.id,
    index: ++index,
    fullname: item.fullname,
    address: item.address,
    debt: item.debt.toLocaleString("en-US"),
    phone: item.phone,
    active: item.active === 0 ? "đang làm" : "nghỉ việc",
    to_date: item.to_date,
  }));

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="pcoded-content">
      <AlertDialogStaff
        handleCloseModal={handleCloseModal}
        isModalOpen={isModalOpen}
        staffId={staffId}
        item_staff={item_staff}
      />
      <div className="">
        <Helmet>
          <title>{Title}</title>
        </Helmet>
        <HeaderComponents
          label={"Quản lý kho hàng"}
          title={"Thêm chiết khấu"}
        />
        <div className="card m-4">
          <div className="card-header">
            <div className="card-header-left">
              <div className="header_title">
                <h5>Thông tin</h5>
              </div>
              <small>Nhập thông tin Nhân Viên</small>
            </div>
          </div>
          <div className="card-block remove-label">
            <div className="">
              <TextField
                className="form-control "
                label="Họ và tên"
                id="standard-basic"
                placeholder="Nguyễn Đắc Phương"
                variant="standard"
                name="fullname"
                type="text"
                value={formData.fullname}
                onChange={handleInputChange}
              />
              <TextField
                className="form-control"
                id="standard-basic"
                variant="standard"
                name="address"
                type="text"
                placeholder="Bắc Giang"
                label="Nhập địa chỉ "
                value={formData.address}
                onChange={handleInputChange}
              />
              <div className="flex justify-between">
                <TextField
                  className="form-control w-[49%] mr-2"
                  id="standard-basic"
                  variant="standard"
                  name="phone"
                  type="text"
                  placeholder="0334262754"
                  label="Số điện thoại"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <TextField
                  className="form-control w-[49%]"
                  id="standard-basic"
                  variant="standard"
                  name="debt"
                  type="text"
                  placeholder="500000"
                  label="Công nợ"
                  value={formData.debt}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-inline py-8 mt-2">
              <button
                className="btn btn-primary waves-effect waves-light w-full"
                type="submit"
                fdprocessedid="88fg6k"
                onClick={() => submitForm()}
              >
                Lưu nhân viên
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className=" m-4">
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <div className="header_title">
                <h5>Danh sách Nhân Viên</h5>
              </div>
              <small>Thông tin của các nhân viên</small>
            </div>
          </div>
          <div className="card-block remove-label">
            <div className="body mt-16" style={{ width: "100%" }}>
              <DataGrid
                rows={rows.map((row, index) => ({ ...row, id: index }))}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                showCellVerticalBorder
                showColumnVerticalBorder
                autoHeight
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
      </div>
      <>{loading ? <Loading /> : null}</>
    </div>
  );
}
