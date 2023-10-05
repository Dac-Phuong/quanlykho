import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { TextField } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import {
  showToastError,
  showToastSuccess,
} from "../../admin/utils/toastmessage";
import { UPDATE_ITEM_DISCOUNT } from "../../admin/api";
import Loading from "../loading";
import { http } from "../../admin/utils/http";

export default function AlertDialog({
  handleCloseModal,
  isModalOpen,
  selectedId,
  item_discount,
  isLoadings,
}) {
  const [formData, setFormData] = useState({
    discount: "",
    get_more: "",
    inv_condition: "",
  });
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const queryKey = "discount_key";

  useEffect(() => {
    setFormData({
      discount: item_discount?.item_discount?.discount,
      get_more: item_discount?.item_discount?.get_more,
      inv_condition: item_discount?.item_discount?.inv_condition,
    });
  }, [item_discount]);

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
      const response = await http.put(
        UPDATE_ITEM_DISCOUNT + selectedId,
        formData
      );
      setLoading(false);
      showToastSuccess("Sửa mặt hàng thành công!");
      return response?.data;
    } catch (error) {
      setLoading(false);
      showToastError("Sửa mặt hàng thất bại!");
      console.log(error);
    }
  };
  // Sửa dữ liệu useQuery
  const mutation = useMutation(updateDiscount, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
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
          aria-describedby="alert-dialog-description"
        >
          <div className="mx-4 mt-4">
            <h2 className="text-xl font-medium">
              Sửa sản phẩm: {item_discount?.name}
            </h2>
          </div>
          <DialogActions>
            <div className="m-3">
              <TextField
                className="form-control "
                label="Chiết khấu"
                id="standard-basic"
                placeholder="15%"
                variant="standard"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleInputChange}
              />
              <TextField
                className="form-control"
                id="standard-basic"
                variant="standard"
                name="get_more"
                type="number"
                placeholder="15 cái"
                label="Tặng thêm"
                value={formData.get_more}
                onChange={handleInputChange}
              />
              <TextField
                className="form-control"
                id="standard-basic"
                variant="standard"
                name="inv_condition"
                type="number"
                placeholder="150 cái"
                label="Điều kiện"
                value={formData.inv_condition}
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
