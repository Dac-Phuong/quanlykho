import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useQueryClient, useMutation, useQuery } from "react-query";
import Loading from "../../../components/loading";
import dayjs from "dayjs";
import { EDIT_LOCATION, LIST_LOCATION, UPDATE_LOCATION } from "../../api";
import { showToastError, showToastSuccess } from "../../utils/toastmessage";
import HeaderComponents from "../../../components/header";
import { TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link, useParams } from "react-router-dom";
import { http } from "../../utils/http";

export const getlistLocation = async () => {
  const response = await http.get(LIST_LOCATION);
  return response.data;
};


export default function UpdateLcation() {
  const Title = "Quản lý tuyến";
  const [loading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  // const mutationDelete = useMutation(deteteItemStaff);
  let { id } = useParams();
  const [newId, setNewId] = useState(id);
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
  });
  //   lấy dữ liệu từ input
  const handleInputChange = (event) => {
    const { name, value } = event?.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // lấy dữ liệu về
  const { data, error, isLoading } = useQuery(
    ["location_key"],
    getlistLocation
  );

  // get item location
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      await http
        .get(EDIT_LOCATION + newId)
        .then((response) => {
          if (response.status === 200) {
            setIsLoading(false);
            setFormData({
              name: response?.data?.item?.name,
              desc: response?.data?.item?.desc,
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

  // hàm tạo useQuery
  const updateLocation = async (formData) => {
    try {
      const response = await http.put(UPDATE_LOCATION + newId, formData);
      setIsLoading(false);
      showToastSuccess("Sửa tuyến thành công!");
      return response.data;
    } catch (error) {
      setIsLoading(false);
      showToastError("Sửa tuyến thất bại!");
      console.log(error);
    }
  };

  // hàm tạo
  const mutation = useMutation(updateLocation, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["location_key"] });
    },
    onError: (error) => {
      console.error("Lỗi khi gửi yêu cầu POST:", error);
    },
  });

  const columns = [
    { field: "index", headerName: "STT" },
    { field: "name", headerName: "Tên tuyến", minWidth: 120, flex: 1 },
    { field: "desc", headerName: "Mô tả tuyến", minWidth: 180, flex: 1 },
    { field: "created_at", headerName: "Ngày tạo", minWidth: 120, flex: 1 },
    {
      field: "action",
      headerName: "Thao tác",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            <Link
              className="btn btn-button  btn-primary ml-2"
              onClick={() => setNewId(params?.row?.id)}
            >
              sửa
            </Link>
          </div>
        );
      },
    },
  ];

  const rows = data?.data?.map((item, index) => ({
    id: item.id,
    index: ++index,
    name: item.name,
    desc: item.desc,
    created_at:
      item.created_at != null
        ? dayjs(item.created_at).format("YYYY-MM-DD")
        : null,
  }));

  if (isLoading) {
    return <Loading />;
  }
  // kiểm tra dữ liệu
  const validation = () => {
    const regex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/;
    let isValid = true;
    if (formData.name.trim() === "") {
      showToastError("Vui nhập tên tuyến!");
      isValid = false;
    } else if (regex.test(formData.name)) {
      showToastError("Tên tuyến không được chứa ký tự đặc biệt!");
      isValid = false;
    }
    if (formData.desc.trim() === "") {
      showToastError("Vui nhập mô tả tuyến!");
      isValid = false;
    } else if (regex.test(formData.desc)) {
      showToastError("Mô tả tuyến không được chứa ký tự đặc biệt!");
      isValid = false;
    }
    return isValid;
  };
  // hàm tạo
  const submitForm = () => {
    const isValid = validation();
    if (isValid) {
      setIsLoading(true);
      mutation.mutate(formData);
    }
  };

  return (
    <div className="pcoded-content">
      <div className="">
        <Helmet>
          <title>{Title}</title>
        </Helmet>
        <HeaderComponents label={"Quản lý tuyến"} title={"Thêm tuyến"} />
        <div className="card m-4">
          <div className="card-header">
            <div className="card-header-left">
              <div className="header_title">
                <h5>Thông tin</h5>
              </div>
              <small>Nhập thông tin tuyến</small>
            </div>
          </div>
          <div className="card-block remove-label">
            <div className="">
              <TextField
                className="form-control "
                label="Tên tuyến"
                id="standard-basic"
                placeholder="Gang thép"
                variant="standard"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
              />
              <TextField
                className="form-control"
                id="standard-basic"
                variant="standard"
                name="desc"
                type="text"
                placeholder="Bắn đầu từ ... đến..."
                label="Mô tả tuyến "
                value={formData.desc}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-inline py-8 mt-2">
              <button
                className="btn btn-primary waves-effect waves-light w-full"
                type="submit"
                fdprocessedid="88fg6k"
                onClick={() => submitForm()}
              >
                Lưu tuyến
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
                <h5>Danh sách tuyến</h5>
              </div>
              <small>Thông tin của các tuyến</small>
            </div>
          </div>
          <div className="card-block remove-label">
            <div className="body mt-16" style={{ width: "100%" }}>
              <DataGrid
                rows={rows}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                showCellVerticalBorder
                showColumnVerticalBorder
                autoHeight
                initialState={{
                  ...data?.initialState,
                  pagination: { paginationModel: { pageSize: 15 } },
                }}
                pageSizeOptions={[15, 25, 50]}
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
