import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import dayjs from "dayjs";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { startOfMonth, endOfMonth } from "date-fns";
import Loading from "../../../components/loading";
import {
  CREATE_DISCOUNT,
  DELETE_DISCOUNT,
  FILTER_DISCOUNT,
  GET_ITEM_DISCOUNT,
} from "../../api";
import { showToastError, showToastSuccess } from "../../utils/toastmessage";
import HeaderComponents from "../../../components/header";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Autocomplete, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AlertDialog from "../../../components/modal/modal-discount";
import { useGetDataDiscount } from "../../api/useFetchData";
import { http } from "../../utils/http";

const deteteItem = async (id) => {
  try {
    const response = await http.delete(DELETE_DISCOUNT + id);
    showToastSuccess("Xóa chiết khấu thành công");
    return response.data;
  } catch (error) {
    showToastError("Xóa chiết khấu không thành công");
  }
};

export default function ListDiscount() {
  const Title = "Thêm Chiết khấu";
  const [loading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const firstDayOfMonth = startOfMonth(new Date());
  const lastDayOfMonth = endOfMonth(new Date());
  const mutationDelete = useMutation(deteteItem);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [from_date, setFrom_Date] = useState(dayjs(firstDayOfMonth));
  const [to_date, setTo_Date] = useState(dayjs(lastDayOfMonth));
  const [discount, setDiscount] = useState("");
  const [get_more, setGet_more] = useState("");
  const [inv_condition, setInv_condition] = useState("");
  const [newData, setNewData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [newId, setNewId] = useState(null);
  const queryKey = "discount_key";

  const formData = {
    product_id: selectedProducts,
    from_date: dayjs(from_date).format("YYYY-MM-DD"),
    to_date: dayjs(to_date).format("YYYY-MM-DD"),
    discount: discount || 0,
    get_more: get_more || 0,
    inv_condition: inv_condition || 0,
  };

  const handleAutocompleteChange = (event, newValue) => {
    setSelectedProducts(newValue.map((option) => option.id));
  };
  // lấy dữ liệu về
  const { data, error, isLoading } = useQuery(queryKey,useGetDataDiscount(queryKey));
  const handleGetDiscount = async (newId) => {
    const response = await http.get(GET_ITEM_DISCOUNT + newId);
    return response.data;
  };
  const {
    data: item_discount,
    isLoading: isLoadings,
    isError: isErrors,
  } = useQuery(["get_discount", newId], () => handleGetDiscount(newId), {
    enabled: !!newId,
  });

  // hàm tạo kho từ useQuery
  const createDiscount = async (formData) => {
    try {
      const response = await http.post(CREATE_DISCOUNT, formData);
      setIsLoading(false);
      showToastSuccess("Thêm chiết khấu thành công!");
      setSelectedProducts([]);
      setDiscount("");
      setGet_more("");
      setInv_condition("");
      return response.data;
    } catch (error) {
      setIsLoading(false);
      showToastError("Thêm chiết khấu thất bại!");
      console.log(error);
    }
  };

  // hàm xóa
  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Bạn có chắn muốn xóa không?");
    if (isConfirmed) {
      mutationDelete.mutate(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKey });
        },
      });
    }
  };
  // hàm lọc chiết khấu
  const submitFilter = async () => {
    await http
      .post(FILTER_DISCOUNT, {
        from_date,
        to_date,
      })
      .then((response) => {
        if (response.status === 200) {
          setNewData(response.data.list_discount);
        }
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  const handleGetItem = async (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
    setNewId(id);
  };

  const handleCloseModal = () => {
    setSelectedId(null);
    setIsModalOpen(false);
  };

  // hàm tạo
  const mutation = useMutation(createDiscount, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
    onError: (error) => {
      console.error("Lỗi khi gửi yêu cầu POST:", error);
    },
  });

  const columns = [
    { field: "index", headerName: "STT" },
    { field: "code", headerName: "Mã hàng", minWidth: 120, flex: 1 },
    { field: "name", headerName: "Tên mặt hàng", minWidth: 220, flex: 1 },
    { field: "discount", headerName: "Chiết khấu", minWidth: 120 },
    { field: "get_more", headerName: "Tặng thêm", minWidth: 120 },
    { field: "inv_condition", headerName: "Điều kiện", minWidth: 120 },
    { field: "from_date", headerName: "Ngày bắt đầu", minWidth: 140, flex: 1 },
    { field: "to_date", headerName: "Ngày kết thúc", minWidth: 140, flex: 1 },
    {
      field: "active",
      headerName: "Thao tác",
      minWidth: 145,
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            <button
              className="btn btn-button btn-danger waves-effect waves-light"
              fdprocessedid="k4qcck"
              onClick={() => handleDelete(params?.row?.id)}
            >
              Xóa
            </button>
            <button
              className="btn btn-button btn-primary ml-2"
              onClick={() => handleGetItem(params?.row?.id)}
            >
              sửa
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
      setNewData(data.list_discount);
    }
  }, [isLoading, data]);

  const rows = newData?.map((item, index) => ({
    id: item.id,
    index: ++index,
    code: item.code,
    name: item.name,
    discount: item.discount + "%",
    get_more: item.get_more,
    inv_condition: item.inv_condition,
    from_date: item.from_date,
    to_date: item.to_date,
  }));
  if (isLoading) {
    return <Loading />;
  }
  // kiểm tra dữ liệu
  const validation = () => {
    let isValid = true;
    if (selectedProducts.length === 0) {
      showToastError("Vui lòng chọn sản phẩm!");
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
              <small>Nhập thông tin chiết khấu</small>
            </div>
          </div>
          <div className="card-block remove-label">
            <div className="flex nowrap">
              <Autocomplete
                multiple
                fullWidth
                id="tags-standard"
                options={data?.products || []}
                value={data?.products?.filter((option) =>
                  selectedProducts.includes(option.id)
                )}
                onChange={handleAutocompleteChange}
                getOptionLabel={(option) => option?.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Chọn sản phẩm"
                    placeholder="Chọn sản phẩm"
                  />
                )}
              />
            </div>
            <div className="flex justify-between mt-4">
              <TextField
                className="form-control w-[32%]"
                label="Chiết khấu"
                id="standard-basic"
                placeholder="15%"
                variant="standard"
                name="discount"
                type="number"
                value={discount}
                onChange={(event) => setDiscount(event.target.value)}
              />
              <TextField
                className="form-control w-[32%]"
                id="standard-basic"
                variant="standard"
                name="get_more"
                type="number"
                placeholder="15 cái"
                label="Tặng thêm"
                value={get_more}
                onChange={(event) => setGet_more(event.target.value)}
              />
              <TextField
                className="form-control w-[32%]"
                id="standard-basic"
                variant="standard"
                name="inv_condition"
                type="number"
                placeholder="150 cái"
                label="Điều kiện"
                value={inv_condition}
                onChange={(event) => setInv_condition(event.target.value)}
              />
            </div>
            <div className="flex mt-3">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="w-[33%] max-sm:w-2/4 mr-4 max-sm:mr-1"
                  label="Ngày bắt đầu"
                  value={from_date}
                  onChange={(newValue) => setFrom_Date(newValue)}
                  slotProps={{ textField: { variant: "filled" } }}
                />
                <DatePicker
                  className="w-[33%] max-sm:w-2/4"
                  label="Ngày kết thúc"
                  value={to_date}
                  onChange={(newValue) => setTo_Date(newValue)}
                  slotProps={{ textField: { variant: "filled" } }}
                />
              </LocalizationProvider>
            </div>
            <div className="form-inline py-8 mt-2">
              <button
                className="btn btn-primary waves-effect waves-light w-full"
                type="submit"
                fdprocessedid="88fg6k"
                onClick={() => submitForm()}
              >
                Lưu Chiết khấu
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
                <h5>Danh sách chiết khấu</h5>
              </div>
              <small>Thông tin chiết khấu</small>
            </div>
          </div>
          <div className="card-block remove-label">
            <div className="flex mt-3 justify-between max-sm:justify-normal flex-wrap ">
              <LocalizationProvider
                className="flex flex-nowrap w-[100%]"
                dateAdapter={AdapterDayjs}
              >
                <DatePicker
                  className="w-[32%] max-sm:w-[48%] mr-2 max-sm:mr-1"
                  label="Ngày bắt đầu"
                  value={from_date}
                  onChange={(newValue) => setFrom_Date(newValue)}
                  slotProps={{ textField: { variant: "filled" } }}
                />
                <DatePicker
                  className="w-[32%] max-sm:w-[48%]"
                  label="Ngày kết thúc"
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
                  Tìm Chiết khấu
                </button>
              </div>
            </div>
            <div className="body mt-20" style={{ width: "100%" }}>
              <DataGrid
                rows={rows || []}
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
        <AlertDialog
          handleCloseModal={handleCloseModal}
          isModalOpen={isModalOpen}
          selectedId={selectedId}
          item_discount={item_discount}
          isLoadings={isLoadings}
        />
      </div>
      <>{loading ? <Loading /> : null}</>
    </div>
  );
}
