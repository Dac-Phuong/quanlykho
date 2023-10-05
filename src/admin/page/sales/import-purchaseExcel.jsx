import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import dayjs from "dayjs";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { CSVLink } from "react-csv";
import Loading from "../../../components/loading";
import axios from "axios";
import { showToastError, showToastSuccess } from "../../utils/toastmessage";
import HeaderComponents from "../../../components/header";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MenuItem, TextField } from "@mui/material";
import { FaCloudDownloadAlt } from "react-icons/fa";
import Button from "@mui/joy/Button";
import SvgIcon from "@mui/joy/SvgIcon";
import { styled } from "@mui/joy";
import { useGetDataListWareHouse } from "../../api/useFetchData";

export default function ImportPurchase() {
  const Title = "Nhập hàng bằng excecl";
  const [loading, setIsLoading] = useState(false);
  const [warehouseId, setWarehouseId] = useState("");
  const currentDate = new Date();
  const [date, setDate] = useState(dayjs(currentDate));
  const queryKey = "warehouse_key";
  const csvData = [["Mã hàng", "Tên hàng", "Màu sắc", "Số lượng"]];
  const { data, error, isLoading } = useQuery(
    queryKey,
    useGetDataListWareHouse(queryKey)
  );
  useEffect(() => {
    if (warehouseId === "" && data?.data?.length > 0) {
      setWarehouseId(data?.data[0].id);
    }
  }, [data, warehouseId]);
  const handleChange = (event) => {
    setWarehouseId(event?.target?.value);
  };
  const VisuallyHiddenInput = styled("input")`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;
  return (
    <div className="pcoded-content">
      <div className="">
        <Helmet>
          <title>{Title}</title>
        </Helmet>
        <HeaderComponents
          label={"Quản lý kho hàng"}
          title={"Nhập hàng bằng Excel"}
        />
        <div className="card m-4">
          <div className="card-header">
            <div className="card-header-left">
              <div className="header_title">
                <h5>Nhập đơn bằng file excel</h5>
              </div>
              <div className="flex align-items-center mt-2">
                <small>File mẫu nhập đơn</small>
                <CSVLink
                  filename={"mau-file-don-nhap"}
                  class="btn btn-button flex waves-effect waves-light ml-2 btn-danger btn-block w-[52%] h-[35px]"
                  data={csvData}
                >
                  <FaCloudDownloadAlt className="mr-1 -mt-[2px]" size={20} />
                  Download
                </CSVLink>
              </div>
            </div>
          </div>
          <div className="card-block remove-label">
            <div className="flex mt-3 justify-between max-sm:justify-normal">
              <LocalizationProvider
                className="flex flex-nowrap w-[100%]"
                dateAdapter={AdapterDayjs}
              >
                <DatePicker
                  className="w-[49%] max-sm:w-2/4 mr-4 max-sm:mr-1"
                  label="Ngày tạo đơn"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  slotProps={{ textField: { variant: "filled" } }}
                />
              </LocalizationProvider>
              <div className=" text-[#555] mt-2 w-[49%]">
                <TextField
                  select
                  fullWidth
                  value={warehouseId}
                  onChange={handleChange}
                  label="Chọn Kho nhập "
                  id="standard-basic"
                  variant="standard"
                >
                  {data?.data?.map((item, index) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.fullname}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </div>
            </div>
            <div className=" mt-4">
              <Button
                component="label"
                role={undefined}
                tabIndex={-1}
                variant="outlined"
                color="neutral"
                startDecorator={
                  <SvgIcon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                      />
                    </svg>
                  </SvgIcon>
                }
              >
                Upload a file
                <VisuallyHiddenInput type="file" />
              </Button>
            </div>
            <div className="form-inline mt-5 max-sm:mt-5 max-sm:w-full w-[100%]">
              <button
                className="btn  waves-effect waves-light btn-primary btn-block w-full"
                type="submit"
                fdprocessedid="88fg6k"
              >
                Tải đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
      <>{loading ? <Loading /> : null}</>
    </div>
  );
}
