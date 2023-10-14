import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { TextField } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import {
  showToastError,
  showToastSuccess,
} from "../../admin/utils/toastmessage";
import { CREATE_PAID } from "../../admin/api";
import Loading from "../loading";
import { http } from "../../admin/utils/http";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function AlertDialogSales({
  handleCloseModal,
  isModalOpen,
  isLoadings,
  salesId,
}) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const currentDate = new Date();
  const queryKey = "sales_key";
  const [date, setDate] = useState(dayjs(currentDate));
  const [formData, setFormData] = useState({
    sales_id: "",
    date: "",
    money: "",
  });
  useEffect(() => {
    setFormData({
      ...formData,
      sales_id: salesId,
      date: dayjs(currentDate).format("YYYY-MM-DD"),
    });
  }, [salesId, date]);
  // lấy dữ liệu từ input
  const handleInputChange = (event) => {
    const { name, value } = event?.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // kiểm tra dữ liệu
  const validation = () => {
    let isValid = true;
    if (formData.money.trim() === "" && formData.money == 0) {
      showToastError("Vui lòng nhập số tiền cần thanh toán");
      isValid = false;
    }
    return isValid;
  };
  // Sửa dữ liệu
  const CreatePaid = async (formData) => {
    try {
      const response = await http.post(CREATE_PAID, formData);
      setLoading(false);
      setFormData({
        money: "",
      });
      showToastSuccess("Trả trước thành công!");
      return response?.data;
    } catch (error) {
      setLoading(false);
      showToastError("Trả trước thất bại!");
      console.log(error);
    }
  };
  // Sửa dữ liệu useQuery
  const mutation = useMutation(CreatePaid, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.error("Lỗi khi gửi yêu cầu POST:", error);
    },
  });
  // gửi dữ liệu useQuery
  const submitForm = () => {
    const valid = validation();
    if (valid) {
      setLoading(true);
      mutation.mutate(formData);
      handleCloseModal();
    }
  };
  return (
    <div>
      {isLoadings ? null : (
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className="mx-4 mt-4 ">
            <h2 className="text-xl font-medium">Thanh toán hóa đơn</h2>
            <span className="font-medium">Thông tin thanh toán</span>
          </div>
          <DialogActions>
            <div className="m-3 w-full">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="w-full max-sm:w-2/4 max-sm:mr-1"
                  label="Ngày thanh toán"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  slotProps={{ textField: { variant: "filled" } }}
                />
              </LocalizationProvider>
              <TextField
                className="form-control mt-2 mb-3"
                id="standard-basic"
                variant="standard"
                name="money"
                type="number"
                fullWidth
                placeholder="15000vnd"
                label="Nhập số tiền"
                value={formData.money}
                onChange={handleInputChange}
              />
              <span>Đơn hàng chưa được thanh toán</span>
              <div className="mt-4 ml-auto">
                <button
                  className="btn btn-button  waves-effect waves-light bg-green mr-3"
                  onClick={() => submitForm()}
                  autoFocus
                >
                  Lưu Lại
                </button>
                <button
                  className="btn btn-button btn-danger waves-effect waves-light"
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>
              </div>
            </div>
          </DialogActions>
        </Dialog>
      )}
      <>{loading ? <Loading /> : null}</>
    </div>
  );
}
