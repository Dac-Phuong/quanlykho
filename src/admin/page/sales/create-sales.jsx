import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { CREATE_SALES } from "../../api";
import dayjs from "dayjs";
import { http } from "../../utils/http";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { showToastError, showToastSuccess } from "../../utils/toastmessage";
import Loading from "../../../components/loading";
import { useMutation, useQuery, useQueryClient } from "react-query";
import HeaderComponents from "../../../components/header";
import {
  TextField,
  Autocomplete,
  MenuItem,
  TextareaAutosize,
} from "@mui/material/";
import { DatePicker } from "@mui/x-date-pickers";
import Input from "../../../components/input";
import { useGetDataCreateSales } from "../../api/useFetchData";

export default function CreateSales() {
  const Title = "Bán hàng";
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const currentDate = new Date();
  const [date, setDate] = useState(dayjs(currentDate));
  const [warehouseId, setWarehouseId] = useState("");
  const [discount, setDiscount] = useState("");
  const [staffId, setStaffId] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [status, setSatus] = useState(0);
  const [note, setNote] = useState("");
  const queryKey = "sales_key";
  const [newArray, setNewArray] = useState([]);

  //   thêm sản phẩm vào mảng state
  const handleAutocompleteChange = (event, newValue) => {
    if (newValue && newValue.id) {
      const arrayData = newArray.some(
        (item) => item.product_id === newValue.id
      );
      if (!arrayData) {
        const array = {
          product_id: newValue.id,
          code: newValue.code,
          name: newValue.name,
          price: newValue.buy_price,
          quality: 0,
          get_more: 0,
          discount: 0,
          guarantee: 0,
        };
        setNewArray([...newArray, array]);
      } else {
        const updatedItems = newArray.filter(
          (item) => item.product_id !== newValue.id
        );
        setNewArray(updatedItems);
      }
    }
  };
  // lấy dữ liệu từ input của các item
  const handleInputChange = (value, itemId, fieldName) => {
    const updatedItems = newArray.map((item) => {
      if (item.product_id === itemId) {
        return {
          ...item,
          [fieldName]: value,
        };
      }
      return item;
    });

    setNewArray(updatedItems);
  };

  // xóa sản phẩm khỏi mảng
  const handleDeleteItem = (item) => {
    const updatedItems = newArray.filter(
      (selectedItem) => selectedItem.product_id !== item.product_id
    );
    setNewArray(updatedItems);
  };
  //
  const handleChange = (event) => {
    setWarehouseId(event?.target?.value);
  };
  const handleChangeDiscount = (event) => {
    setDiscount(event?.target?.value);
  };
  const handleChangeStatus = (event) => {
    setSatus(event?.target?.value);
  };
  const handleChangeStaff = (event, newValue) => {
    setStaffId(newValue);
  };
  const handleChangeCustomer = (event, newValue) => {
    setCustomerId(newValue);
  };
  // tạo fromdata
  const formData = {
    sales_item: newArray,
    sales: {
      user_id: "1",
      customer_id: customerId?.id,
      staff_id: staffId?.id,
      date: dayjs(date).format("YYYY-MM-DD"),
      warehouse_id: warehouseId,
      status: status,
      note: note,
      discount: discount || 0,
    },
  };
  // tạo bằng useQuery
  const createPurchase = async (formData) => {
    try {
      const response = await http.post(CREATE_SALES, formData);
      setLoading(false);
      showToastSuccess("Tạo đơn hàng thành công!");
      setNote("");
      setSatus(0);
      setStaffId(null);
      setCustomerId(null);
      return response.data;
    } catch (error) {
      setLoading(false);
      showToastError("Tạo đơn hàng thất bại!");
      console.log(error);
    }
  };
  // tạo useQuery
  const mutation = useMutation(createPurchase, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      setNewArray([]);
    },
    onError: (error) => {
      console.error("Lỗi khi gửi yêu cầu POST:", error);
    },
  });

  // get date từ useQuery
  const { data, isLoading, isError } = useQuery(
    queryKey,
    useGetDataCreateSales(queryKey)
  );
  useEffect(() => {
    if (warehouseId === "" && data?.warehouses?.length > 0) {
      setWarehouseId(data?.warehouses[0].id);
    }
  }, [data, warehouseId]);

  if (isLoading) {
    return <Loading />;
  }
  // kiểm tra dữ liệu đầu vào
  const validation = () => {
    let isValid = true;
    if (newArray.length === 0) {
      showToastError("Vui lòng chọn sản phẩm!");
      isValid = false;
    }
    for (let i = 0; i < newArray.length; i++) {
      if (newArray[i].quality === 0) {
        showToastError("Vui lòng nhập số lượng sản phẩm!");
        isValid = false;
        break;
      }
    }
    if (staffId === null) {
      showToastError("Vui lòng chọn nhân viên!");
      isValid = false;
    }
    if (customerId === null) {
      showToastError("Vui lòng chọn khách hàng!");
      isValid = false;
    }

    return isValid;
  };
  // handle tạo sản phẩm bằng useQuery
  const submitForm = () => {
    const isValid = validation();
    if (isValid) {
      setLoading(true);
      mutation.mutate(formData);
    }
  };
  // View
  return (
    <section className="pcoded-content">
      <Helmet>
        <title>{Title}</title>
      </Helmet>
      <HeaderComponents label={"Quản lý kho hàng"} title={"Bán Hàng"} />
      <div className="row my-4 mx-2 flex flex-wrap max-lg:flex-wrap">
        <div className="col-sm-8">
          <div className="card">
            <div className="card-header">
              <div className="card-header-left">
                <div className="header_title">
                  <h5>Thông tin</h5>
                </div>
                <small>Mặt hàng</small>
              </div>
            </div>
            <div className="card-block remove-label">
              <Autocomplete
                fullWidth
                id="disable-close-on-select"
                clearOnEscape
                options={data && data.products ? data.products : []}
                onChange={handleAutocompleteChange}
                getOptionLabel={(rows) => rows?.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Chọn mặt hàng"
                    variant="standard"
                    size="small"
                  />
                )}
              />
              <div className="mt-6 flex card-block table-border-style p-0">
                <div className="table-responsive">
                  <table className=" table">
                    <thead className="text-left">
                      <tr>
                        <th>Mã SP</th>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Hàng KM</th>
                        <th>Giá gốc</th>
                        <th>Chiết khấu</th>
                        <th>Bảo hành</th>
                        <th>Giá bán</th>
                        <th>Thành tiền</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="text-left">
                      {newArray?.map((item) => {
                        const subtotal = item?.quality * item?.price;
                        const discountAmount =
                          subtotal * (item?.discount / 100);
                        return (
                          <tr key={item?.product_id} className="">
                            <th>{item?.code}</th>
                            <th>{item?.name}</th>
                            <th>
                              <Input
                                className="pt-2"
                                type="number"
                                variant="standard"
                                name="quality"
                                placeholder="15"
                                value={item.quality}
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    item.product_id,
                                    "quality"
                                  )
                                }
                              />
                            </th>
                            <th>
                              <Input
                                className="pt-2"
                                type="number"
                                name="get_more"
                                variant="standard"
                                value={item.get_more}
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    item?.product_id,
                                    "get_more"
                                  )
                                }
                                placeholder="15"
                              />
                            </th>
                            <th>{item?.price.toLocaleString("en-US")}</th>
                            <th>
                              <Input
                                className="pt-2"
                                type="number"
                                value={item.discount}
                                variant="standard"
                                name="discount"
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    item?.product_id,
                                    "discount"
                                  )
                                }
                                placeholder="15%"
                              />
                            </th>
                            <th>
                              <Input
                                className="pt-2"
                                type="number"
                                value={item.guarantee}
                                variant="standard"
                                name="guarantee"
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    item?.product_id,
                                    "guarantee"
                                  )
                                }
                                placeholder="12th"
                              />
                            </th>
                            <th>{item?.price.toLocaleString("en-US")}</th>
                            <th>
                              {Math.round(
                                subtotal - discountAmount
                              ).toLocaleString("en-US")}
                            </th>
                            <th>
                              <button
                                onClick={() => handleDeleteItem(item)}
                                className="btn btn-button btn-danger waves-effect waves-light"
                                fdprocessedid="k4qcck"
                              >
                                xóa
                              </button>
                            </th>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-4 ">
          <div className="card">
            <div className="card-header">
              <div className="card-header-left">
                <div className="header_title">
                  <h5>Thông tin</h5>
                </div>
                <small>Nhập thông tin Nhập Hàng</small>
              </div>
              <div className="card-header-right"></div>
            </div>
            <div className="card-block remove-label">
              <div className=" text-[#555]">
                <TextField
                  fullWidth
                  select
                  value={warehouseId}
                  onChange={handleChange}
                  label="Chọn Kho bán "
                  id="standard-basic"
                  variant="standard"
                >
                  {data?.warehouses?.map((item, index) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.fullname}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </div>
              <div className="flex my-3">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="w-[49%] max-sm:w-2/4 mr-4 max-sm:mr-1"
                    label="Ngày tạo đơn"
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    slotProps={{ textField: { variant: "filled" } }}
                  />
                </LocalizationProvider>
                <TextField
                  className="w-[49%] max-sm:w-2/4 mt-2  max-sm:mr-1"
                  select
                  value={status}
                  onChange={handleChangeStatus}
                  label="Chọn trạng thái"
                  id="standard-basic"
                  variant="standard"
                >
                  <MenuItem value="0">Chưa thanh toán</MenuItem>
                  <MenuItem value="1">Đã thanh toán </MenuItem>
                </TextField>
              </div>
              <div className="flex justify-between my-3">
                <Autocomplete
                  className="w-[49%] max-sm:w-2/4 mt-2   mr-4 max-sm:mr-1"
                  id="disable-close-on-select"
                  clearOnEscape
                  options={data && data?.staff ? data?.staff : []}
                  onChange={handleChangeStaff}
                  getOptionLabel={(rows) => rows?.fullname || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Chọn nhân viên"
                      variant="standard"
                      size="small"
                    />
                  )}
                />
                <Autocomplete
                  className="w-[49%] max-sm:w-2/4 mt-2 max-sm:mr-1"
                  id="disable-close-on-select"
                  clearOnEscape
                  options={data && data?.customers ? data?.customers : []}
                  onChange={handleChangeCustomer}
                  getOptionLabel={(rows) =>
                    rows?.fullname + " - " + rows?.address || ""
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Chọn khách hàng"
                      variant="standard"
                      size="small"
                    />
                  )}
                />
              </div>
              <div
                className="form-group "
                style={{ width: "48%", marginTop: 10 }}
              >
                <TextField
                  label="Chiết khấu thêm"
                  type="number"
                  value={discount}
                  id="standard-basic"
                  variant="standard"
                  name="discount"
                  placeholder="5%"
                  onChange={handleChangeDiscount}
                />
              </div>
              <div className="form-textarea">
                <TextareaAutosize
                  id="group-description"
                  className="w-full mt-4 cursor-pointer text-black"
                  value={formData.description}
                  name="description"
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú đơn hàng. VD: Đơn hàng ngoài"
                  aria-label="minimum height"
                  minRows={3}
                />
              </div>
              <button
                className="btn mt-4 waves-effect waves-light btn-primary btn-block"
                fdprocessedid="gpxvki"
                onClick={() => submitForm()}
              >
                Thêm đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
      <>{loading ? <Loading /> : null}</>
    </section>
  );
}
