import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "react-query";
import Loading from "../../../components/loading";
import { EDIT_WAREHOUSE, UPDATE_WAREHOUSE } from "../../api";
import { showToastError, showToastSuccess } from "../../utils/toastmessage";
import HeaderComponents from "../../../components/header";
import { TextField } from "@mui/material";
import { useGetDataListWareHouse } from "../../api/useFetchData";
import { http } from "../../utils/http";

export default function UpdateWareHouse() {
  const Title = "Thêm kho hàng mới";
  const [loading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  let { id } = useParams();
  const queryKey = "warehouse_key";
  const [newId, setNewId] = useState(id);
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    address: "",
  });
  
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      await http
        .get(EDIT_WAREHOUSE + newId)
        .then((response) => {
          if (response.status === 200) {
            setIsLoading(false);
            setFormData({
              fullname: response.data.item.fullname,
              phone: response.data.item.phone,
              address: response.data.item.address,
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
    if (formData.fullname.trim() === "") {
      showToastError("Vui lòng nhập tên kho!");
      isValid = false;
    } else if (regex.test(formData.fullname)) {
      showToastError("Tên kho không được chứa ký tự đặc biệt!");
      isValid = false;
    }
    if (formData.address.trim() === "") {
      showToastError("Vui lòng nhập địa chỉ!");
      isValid = false;
    } else if (regex.test(formData.address)) {
      showToastError("Địa chỉ không được chứa ký tự đặc biệt!");
      isValid = false;
    }
    return isValid;
  };
  // hàm tạo kho từ useQuery
  const createWareHouse = async (formData) => {
    try {
      const response = await http.put(UPDATE_WAREHOUSE + id, formData);
      setIsLoading(false);
      showToastSuccess("Sửa kho hàng thành công!");
      navigate("/quan-ly-kho/them-kho-hang");
      return response.data;
    } catch (error) {
      setIsLoading(false);
      showToastError("Sửa kho hàng thất bại!");
      console.log(error);
    }
  };
  // hàm tạo kho từ useQuery
  const mutation = useMutation(createWareHouse, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
    onError: (error) => {
      console.error("Lỗi khi gửi yêu cầu POST:", error);
    },
  });
  // hàm tạo kho từ useQuery
  const submitForm = () => {
    const isValid = validation();
    if (isValid) {
      setIsLoading(true);
      mutation.mutate(formData);
    }
  };

  const { data, error, isLoading } = useQuery(
    queryKey,
    useGetDataListWareHouse(queryKey)
  );

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return console.log(error.message);
  }
  return (
    <div className="pcoded-content">
      <div className="">
        <Helmet>
          <title>{Title}</title>
        </Helmet>
        <HeaderComponents
          label={"Quản lý kho hàng"}
          title={"Thêm kho hàng mới"}
        />

        <div className="card  m-4">
          <div className="card-header">
            <div className="card-header-left">
              <div className="header_title">
                <h5>Thông tin</h5>
              </div>
              <small>Nhập thông tin của kho hàng</small>
            </div>
          </div>
          <div className="card-block remove-label">
            <div className="flex nowrap">
              <TextField
                className="form-control"
                label="Tên NPP"
                id="standard-basic"
                variant="standard"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex  nowrap">
              <TextField
                className="form-control"
                label="Số điện thoại"
                id="standard-basic"
                variant="standard"
                name="phone"
                type="number"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex  nowrap">
              <TextField
                className="form-control"
                id="standard-basic"
                variant="standard"
                name="address"
                type="text"
                label="Địa chỉ"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-inline  py-8">
              <button
                className="btn btn-primary waves-effect waves-light w-full"
                type="submit"
                fdprocessedid="88fg6k"
                onClick={() => submitForm()}
              >
                Lưu thông tin
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
                <h5>Danh sách kho hàng</h5>
              </div>
            </div>
          </div>
          <div className="card-block remove-label">
            <div className="body">
              <table className="table table-bordered table-striped table-hover dataTable js-exportable">
                <thead>
                  <tr className="text-left">
                    <th>STT</th>
                    <th>Tên kho</th>
                    <th>SĐT</th>
                    <th>Địa chỉ</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>{++index}</td>
                        <td>{item.fullname}</td>
                        <td>{item.phone}</td>
                        <td>{item.address}</td>
                        <td>
                          <button
                            className="btn btn-button btn-primary waves-effect waves-light"
                            onClick={() => setNewId(item.id)}
                          >
                            Sửa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <>{loading ? <Loading /> : null}</>
    </div>
  );
}
