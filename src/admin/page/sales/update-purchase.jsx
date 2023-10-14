import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { EDIT_ITEM_SALES, UPDATE_SALES } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
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
  Select,
} from "@mui/material/";
import { DatePicker } from "@mui/x-date-pickers";
import Input from "../../../components/input";
import { useGetDataCreateSales } from "../../api/useFetchData";
import { getUserData } from "../../utils/function";

export default function UpdateSales() {
  const Title = "Sửa đơn hàng";
  const queryKey = "update_sales_key";
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const currentDate = new Date();
  const [date, setDate] = useState(dayjs(currentDate));
  const [warehouseId, setWarehouseId] = useState("");
  const [discount, setDiscount] = useState("");
  const [staff, setStaff] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [status, setSatus] = useState(0);
  const [note, setNote] = useState("");
  const userData = getUserData();
  const navigate = useNavigate();
  const [newArray, setNewArray] = useState([]);
  let { id } = useParams();
  // get date từ useQuery
  const { data, isLoading, isError } = useQuery(
    queryKey,
    useGetDataCreateSales(queryKey)
  );
  //   lấy dữ liệu về
  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (data) {
      const getData = async () => {
        setLoading(true);
        await http
          .get(EDIT_ITEM_SALES + id)
          .then((response) => {
            if (response.status === 200) {
              setLoading(false);
              setStaff(
                data?.staff.find(
                  (ite) => ite.id == response?.data?.Sales?.staff_id
                ) || null
              );
              setCustomer(
                data?.customers.find(
                  (item) => item.id == response?.data?.Sales?.customer_id
                ) || null
              );
              setNewArray(response?.data?.sales_items);
              setSatus(response?.data?.Sales?.status);
              setNote(response?.data?.Sales?.note);
              setWarehouseId(response?.data?.Sales?.warehouse_id);
              setDate(dayjs(response?.data?.Sales.date));
              setDiscount(response?.data?.Sales?.discount);
            }
          })
          .catch((error) => {
            setLoading(false);

            console.error(error.response);
          });
      };
      getData();
    }
  }, [id, isLoading]);
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
    setStaff(newValue);
  };
  const handleChangeCustomer = (event, newValue) => {
    setCustomer(newValue);
  };
  // tạo fromdata
  const formData = {
    sales_item: newArray,
    sales: {
      user_id: userData.user.id,
      customer_id: customer?.id,
      staff_id: staff?.id,
      date: dayjs(date).format("YYYY-MM-DD"),
      warehouse_id: warehouseId,
      status: status,
      note: note,
      discount: discount || 0,
    },
  };
  // tạo bằng useQuery
  const updateSales = async (formData) => {
    try {
      const response = await http.put(UPDATE_SALES + id, formData);
      setLoading(false);
      showToastSuccess("Sửa đơn hàng thành công!");
      navigate("/xuat-kho/danh-sach-ban-hang");
      setNote("");
      return response.data;
    } catch (error) {
      setLoading(false);
      if (error?.response.status === 400) {
        showToastError(
          error?.response?.data?.product_name +
            " không đủ số lượng bán. số lượng còn lại trong kho: " +
            error?.response?.data?.quality
        );
      } else {
        showToastError("Sửa đơn hàng thất bại!");
      }
    }
  };

  // cập nhật bán hàng
  const mutation = useMutation(updateSales, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.error("Lỗi khi gửi yêu cầu POST:", error);
    },
  });

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
    if (newArray?.length === 0) {
      showToastError("Vui lòng chọn mặt hàng!");
      isValid = false;
    }
    for (let i = 0; i < newArray?.length; i++) {
      if (newArray[i].quality === 0) {
        showToastError("Vui lòng nhập số lượng sản phẩm!");
        isValid = false;
        break;
      }
    }
    if (staff === null) {
      showToastError("Vui lòng chọn nhân viên!");
      isValid = false;
    }
    if (customer === null) {
      showToastError("Vui lòng chọn khách hàng!");
      isValid = false;
    }

    return isValid;
  };
  // cập nhật bán hàng
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
      <HeaderComponents label={"Quản lý kho hàng"} title={"Sửa đơn hàng"} />
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
                <Select
                  fullWidth
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
                </Select>
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
                <Select
                  className="w-[49%] max-sm:w-2/4 mt-2  max-sm:mr-1"
                  value={status}
                  onChange={handleChangeStatus}
                  label="Chọn trạng thái"
                  id="standard-basic"
                  variant="standard"
                >
                  <MenuItem value="0">Chưa thanh toán</MenuItem>
                  <MenuItem value="1">Đã thanh toán </MenuItem>
                </Select>
              </div>
              <div className="flex justify-between my-3">
                <Autocomplete
                  className="w-[49%] max-sm:w-2/4 mt-2   mr-4 max-sm:mr-1"
                  id="disable-close-on-select"
                  clearOnEscape
                  value={staff}
                  options={data && data?.staff ? data?.staff : []}
                  onChange={handleChangeStaff}
                  getOptionLabel={(rows) => rows?.fullname || {}}
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
                  value={customer}
                  getOptionLabel={(rows) =>
                    rows?.fullname + " - " + rows?.address || {}
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
                Lưu đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
      <>{loading ? <Loading /> : null}</>
    </section>
  );
}
