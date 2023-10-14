import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { Autocomplete, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  showToastError,
  showToastSuccess,
} from "../../admin/utils/toastmessage";
import { UPDATE_CUSTOMER } from "../../admin/api";
import Loading from "../loading";
import { useGetDataCustomers } from "../../admin/api/useFetchData";
import { http } from "../../admin/utils/http";

export default function AlertDialogUpdateCustomer({
  handleCloseModal,
  isShowModalOpen,
  isLoadings,
  customerId,
  item_customer,
}) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const queryKey = "customer_key";
  const [value, setValue] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    address: "",
    location: "",
    phone: "",
  });
  const { data, error, isLoading } = useQuery(
    queryKey,
    useGetDataCustomers(queryKey)
  );
  useEffect(() => {
    setFormData({
      fullname: item_customer?.fullname || "",
      address: item_customer?.address || "",
      location: item_customer?.location,
      phone: item_customer?.phone || "",
    });
    setValue(
      data?.location?.find((item) => item.id === item_customer?.location) || ""
    );
  }, [item_customer]);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setFormData({
      ...formData,
      location: newValue?.id,
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
  // Sửa dữ liệu
  const updateCustomer = async (formData) => {
    try {
      const response = await http.put(UPDATE_CUSTOMER + customerId, formData);
      setLoading(false);
      showToastSuccess("Sửa khách hàng thành công!");
      return response?.data;
    } catch (error) {
      setLoading(false);
      showToastError("Sửa khách hàng thất bại!");
      console.log(error);
    }
  };
  // Sửa dữ liệu useQuery
  const mutation = useMutation(updateCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      setFormData({
        fullname: "",
        address: "",
        location: "",
        phone: "",
      });
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
          open={isShowModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
        >
          <div className="mx-4 mt-4">
            <h2 className="text-xl font-medium">Thông tin khách hàng</h2>
          </div>
          <DialogActions>
            <div className="m-3 w-full">
              <TextField
                fullWidth
                className="form-control "
                label="Họ và tên"
                id="standard-basic"
                placeholder="15"
                variant="standard"
                name="fullname"
                type="text"
                value={formData.fullname}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                className="form-control mt-2"
                label="Đia chỉ"
                id="standard-basic"
                placeholder="15"
                variant="standard"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
              />
              <Autocomplete
                fullWidth
                className="mt-2"
                id="disable-close-on-select"
                clearOnEscape
                options={data?.location}
                value={value}
                onChange={handleChange}
                getOptionLabel={(rows) =>
                  rows?.desc
                    ? rows?.name + " - " + rows?.desc
                    : rows?.name || ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Chọn vị trí"
                    variant="standard"
                    size="small"
                  />
                )}
              />
              <TextField
                fullWidth
                className="form-control mt-2 mb-2"
                label="Số điện thoại"
                id="standard-basic"
                placeholder="15"
                variant="standard"
                name="phone"
                type="number"
                value={formData.phone}
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
