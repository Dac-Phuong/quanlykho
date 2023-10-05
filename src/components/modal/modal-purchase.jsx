import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { useReactToPrint } from "react-to-print";
import { AiFillPrinter } from "react-icons/ai";

export default function AlertDialogPurchase({
  handleCloseModal,
  isModalOpen,
  purchasesDetail,
  isLoadings,
}) {
  const total = purchasesDetail?.purchases_detail?.reduce(
    (acc, item) =>
      acc +
      item.price * item.quality -
      item.price * item.quality * (item.discount / 100),
    0
  );
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      {isLoadings ? null : (
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div ref={componentRef}>
            <div className="mx-4 mt-4 flex justify-between">
              <div>
                <h2 className="text-xl font-medium">Thông tin đơn hàng</h2>
                <small className="mt-2">
                  Ngày tạo đơn: {purchasesDetail?.created_at?.date}
                </small>
              </div>
              <button onClick={handlePrint}>
                <AiFillPrinter color="#999" size={22} />
              </button>
            </div>
            <DialogActions>
              <div className="m-3 w-full">
                <div className=" ml-auto w-full">
                  <div class="body table-responsive ">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Mã hàng</th>
                          <th>Tên hàng</th>
                          <th>Số lượng</th>
                          <th>KM</th>
                          <th>CK</th>
                          <th>Giá</th>
                          <th>Tổng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchasesDetail?.purchases_detail?.map(
                          (item, index) => {
                            const subtotal = item?.quality * item?.price;
                            const discountAmount =
                              subtotal * (item?.discount / 100);
                            return (
                              <tr key={item.id}>
                                <td>{++index}</td>
                                <td>{item.code}</td>
                                <td>{item.name}</td>
                                <td>{item.quality}</td>
                                <td>{item.get_more}</td>
                                <td>{item.discount}%</td>
                                <td>{item?.price?.toLocaleString("en-US")}</td>
                                <th>
                                  {Math.round(
                                    subtotal - discountAmount
                                  ).toLocaleString("en-US")}
                                </th>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-between">
                    <span className=" alert-info">
                      Tổng đơn: {Math.round(total).toLocaleString("en-US")} VND
                    </span>
                    <button
                      className="btn btn-button btn-danger waves-effect waves-light w-[80px] h-[35px] mt-auto"
                      onClick={handleCloseModal}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </DialogActions>
          </div>
        </Dialog>
      )}
    </div>
  );
}
