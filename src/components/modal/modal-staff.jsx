import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { TextField } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import {
  showToastError,
  showToastSuccess,
} from "../../admin/utils/toastmessage";
import { UPDATE_ITEM_STAFF } from "../../admin/api";
import Loading from "../loading";
import { http } from "../../admin/utils/http";

export default function AlertDialogStaff({
  handleCloseModal,
  isModalOpen,
  staffId,
  isLoadings,
  item_staff,
}) {
  const [formData, setFormData] = useState({
    discount: "",
    get_more: "",
    inv_condition: "",
  });
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const queryKey = "staff_key";

  // lấy dữ liệu từ input
  const handleInputChange = (event) => {
    const { name, value } = event?.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // Sửa dữ liệu
  const updateDiscount = async (formData) => {
    try {
      const response = await http.put(UPDATE_ITEM_STAFF + staffId, formData);
      setLoading(false);
      showToastSuccess("Sửa công nợ thành công!");
      return response?.data;
    } catch (error) {
      setLoading(false);
      showToastError("Sửa công nợ thất bại!");
      console.log(error);
    }
  };
  // Sửa dữ liệu useQuery
  const mutation = useMutation(updateDiscount, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      setFormData({});
    },
    onError: (error) => {
      console.error("Lỗi khi gửi yêu cầu POST:", error);
    },
  });
  // gửi dữ liệu useQuery
  const submitForm = () => {
    setLoading(true);
    handleCloseModal();
    mutation.mutate(formData);
  };
  return (
    <div>
      {isLoadings ? null : (
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
        >
          <div className="mx-4 mt-4">
            <h2 className="text-xl font-medium">
              Thêm công nợ: {item_staff?.fullname}
            </h2>
          </div>
          <DialogActions>
            <div className="m-3 w-full">
              <TextField
                fullWidth
                className="form-control "
                label="Thêm công nợ"
                id="standard-basic"
                placeholder="15"
                variant="standard"
                name="debt"
                type="number"
                value={formData.debt}
                onChange={handleInputChange}
              />
              <div className="mt-3 ml-auto">
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
