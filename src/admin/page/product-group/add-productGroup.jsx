import React, { useState } from "react";
import { Helmet } from "react-helmet";
import "./style.css";
import { CREATE_PRODUCT_GROUP } from "../../api";
import Loading from "../../../components/loading";
import { showToastError, showToastSuccess } from "../../utils/toastmessage";
import { useMutation, useQueryClient } from "react-query";
import { TextField, MenuItem } from "@mui/material/";
import HeaderComponents from "../../../components/header";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { http } from "../../utils/http";

export default function AddProductGroup() {
  const Title = "Thêm nhóm hàng";
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const queryKey = "productgroup_key";
  const [selected, setSelected] = useState(0);
  const [formData, setFormData] = useState({
    group_name: "",
    group_code: "",
    description: "",
    commission: "",
    commission_target: "",
    commission_type: 0,
  });
  // lấy dữ liệu từ select
  const handleChange = (event) => {
    setSelected(event?.target?.value);
    setFormData({
      ...formData,
      commission_type: event?.target?.value,
    });
  };
  // lấy dữ liệu từ input
  const handleInputChange = (event) => {
    const { name, value } = event?.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // kiểm tra dữ liệu đầu vào
  const validation = () => {
    let isValid = true;
    const regex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/;
    if (formData.group_name.trim() === "") {
      showToastError("Vui lòng nhập tên nhóm hàng!");
      isValid = false;
    } else if (regex.test(formData.group_name)) {
      showToastError("Tên nhóm hàng không được chứa ký tự đặc biệt!");
      isValid = false;
    }
    if (formData.group_code.trim() === "") {
      showToastError("Vui lòng nhập mã nhóm hàng!");
      isValid = false;
    } else if (regex.test(formData.group_code)) {
      showToastError("Mã nhóm hàng không được chứa ký tự đặc biệt!");
      isValid = false;
    }
    return isValid;
  };
  // hàm tạo product group từ useQuery
  const createData = async (formData) => {
    try {
      const response = await http.post(CREATE_PRODUCT_GROUP, formData);
      setIsLoading(false);
      showToastSuccess("Thêm nhóm hàng thành công!");
      setFormData({
        group_name: "",
        group_code: "",
        description: "",
        commission: "",
        commission_target: "",
      });
      return response.data;
    } catch (error) {
      setIsLoading(false);
      showToastError("Thêm nhóm hàng thất bại!");
      console.log(error);
    }
  };
  // hàm tạo product group từ useQuery
  const mutation = useMutation(createData, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.error("Lỗi khi gửi yêu cầu POST:", error);
    },
  });
  // hàm tạo product group từ useQuery
  const submitForm = () => {
    const isValid = validation();
    if (isValid) {
      setIsLoading(true);
      mutation.mutate(formData);
    }
  };

  return (
    <section className="pcoded-content">
      <HeaderComponents
        label={"Quản lý nhóm hàng"}
        title={"Thêm nhóm hàng mới"}
      />
      <div className="p-4">
        <Helmet>
          <title>{Title}</title>
        </Helmet>
        <div className="row">
          <div className="col-sm-6">
            <div className="card">
              <div className="card-header">
                <div className="card-header-left">
                  <div className="header_title">
                    <h5>Thông tin</h5>
                  </div>
                  <small>Nhập thông tin của nhóm hàng</small>
                </div>
              </div>
              <div className="card-block remove-label">
                <div className="form-group">
                  <div className="form-line">
                    <TextField
                      className="form-control"
                      label="Tên nhóm hàng"
                      id="standard-basic"
                      variant="standard"
                      name="group_name"
                      value={formData.group_name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-line">
                    <TextField
                      className="form-control "
                      onChange={handleInputChange}
                      value={formData.group_code}
                      label="Mã nhóm hàng"
                      id="standard-basic"
                      name="group_code"
                      variant="standard"
                    />
                  </div>
                </div>
                <div className=" flex justify-between">
                  <div className="w-[48%]">
                    <TextField
                      style={{ width: "100%" }}
                      label="Công thức"
                      name="commission"
                      value={formData.commission}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: 8, 5000"
                      id="standard-basic"
                      variant="standard"
                    />
                  </div>
                  <div className="w-[48%] ">
                    <TextField
                      fullWidth
                      select
                      value={selected}
                      onChange={handleChange}
                      label="Chọn Cách tính "
                      id="standard-basic"
                      variant="standard"
                    >
                      <MenuItem value="0">%</MenuItem>
                      <MenuItem value="1">đơn vị(mét, cái, sản phẩm)</MenuItem>
                    </TextField>
                  </div>
                </div>
                <div
                  className="form-group "
                  style={{ width: "48%", marginTop: 6 }}
                >
                  <TextField
                    style={{ width: "100%", marginTop: 20 }}
                    label={"Số đơn vị"}
                    type="number"
                    value={formData.commission_target}
                    id="standard-basic"
                    variant="standard"
                    name="commission_target"
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 1, 10, 100, 1000"
                  />
                </div>
                <div className="form-textarea mt-4">
                  <TextareaAutosize
                    id="group-description"
                    className="w-full cursor-pointer text-black"
                    value={formData.description}
                    name="description"
                    onChange={handleInputChange}
                    placeholder="Mô tả nhóm hàng"
                    aria-label="minimum height"
                    minRows={3}
                  />
                </div>
                <div className="form-group  mt-10">
                  <div className="form-inline">
                    <button
                      onClick={() => submitForm()}
                      className="btn  waves-effect waves-light btn-primary btn-block"
                      fdprocessedid="gpxvki"
                    >
                      Lưu nhóm hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <div className="card-header">
                <div className="card-header-left">
                  <div className="header_title">
                    <h5>Trùng</h5>
                  </div>
                  <small>Thông tin nhóm hàng đã tồn tại</small>
                </div>
                <div className="card-header-right"></div>
              </div>
              <div className="card-block remove-label">
                <div className="m-4 text-[#555]">
                  <span>Chưa có dữ liệu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>{isLoading ? <Loading /> : null}</>
    </section>
  );
}
