import React, { useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import vnNum2Words from "vn-num2words";
import { useReactToPrint } from "react-to-print";

export default function AlertDialogSalesBill({
  handleCloseModal,
  isModalOpen,
  dataBill,
  loading,
}) {
  const componentRef = useRef();

  const total = dataBill?.sales_bill?.reduce(
    (acc, item) =>
      acc +
      item.price * item.quality -
      item.price * item.quality * (item.discount / 100),
    0
  );
  const total_price = Math.round(
    total - total * (dataBill?.created_at?.discount / 100)
  );
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      {loading ? null : (
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogActions className="modal-main">
            <div className="w-full">
              <div className="modal-content print_only" ref={componentRef}>
                <div className="modal-header">
                  <h4
                    className="modal-title text-[#333]"
                    id="defaultModalLabel"
                  >
                    Thông tin đơn hàng
                  </h4>
                </div>
                <div className="modal-body" id="content-invoice">
                  <table
                    style={{
                      textAlign: "center",
                      borderCollapse: "collapse",
                      fontWeight: "bold",
                      width: "99.9976%",
                    }}
                    cellPadding={0}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            width: "38%",
                          }}
                        >
                          <p className="text-[16px]">
                            NPP-Hiếu Hồng "CẦN LÀ CÓ" <br /> ĐC: Tổ 4 Phường Cam
                            Giá - TPTN
                            <br />
                            MR Hiếu : 0973.495.704-0878.725.999
                            <br />
                            ⭐⭐⭐⭐⭐
                            <br />
                            STK.0920119849999.Ngân hàng Quân
                            <br />
                            Đội.CTK.Đỗ Thị Hồng
                          </p>
                        </td>
                        <td
                          style={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            width: "53.7449%",
                            textAlign: "center",
                            height: "76.5px",
                          }}
                        >
                          <p className="text-[16px]">
                            Chuyên phân phối các mặt hàng:
                            <br />
                            Thiết bị điện NEWSTAR-EROSUPer-KAWachi-Hàng kim khí-
                            <br />
                            Điện máy-OSHIMA-MAXPRO-máy Rửa xe-đầu xịt rửa
                          </p>
                          <p className="text-[16px] mt-2">
                            máy bơm nước WeLle-DÂY CÁP ĐIỆN TRẦN PHÚ-DÂY CÁP
                            <br />
                            NHÔM-CÁP ĐỒNG
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    style={{
                      textAlign: "center",
                      width: "100%",
                      borderCollapse: "collapse",
                      fontWeight: "bold",
                      marginTop: "15px",
                    }}
                    cellPadding={0}
                  >
                    <tbody>
                      <tr>
                        <td className="text-[23px]" colSpan={9}>
                          PHIẾU XUẤT KHO
                        </td>
                      </tr>
                      <tr>
                        <td>NVBH</td>
                        <td colSpan={2}>
                          {dataBill?.sales_staff?.name_staff} &nbsp;
                        </td>
                        <td>ĐT:</td>
                        <td>&nbsp;{dataBill?.sales_staff?.phone_staff}</td>
                        <td>Ngày:</td>
                        <td colSpan={2}>{dataBill?.created_at?.date} &nbsp;</td>
                        <td>PXK:&nbsp;{dataBill?.created_at?.id} </td>
                      </tr>
                      <tr>
                        <td>KH</td>
                        <td colSpan={2}>
                          {dataBill?.customer?.name_customers}
                        </td>
                        <td>ĐC:</td>
                        <td colSpan={3}>
                          {dataBill?.customer?.address_customers}
                        </td>
                        <td>Điện thoại:</td>
                        <td>{dataBill?.customer?.phone_customers}</td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    cellPadding={0}
                    className=" border  "
                    border={1}
                    style={{
                      textAlign: "center",
                      width: "100%",
                      borderCollapse: "collapse",
                      fontWeight: "bold",
                    }}
                  >
                    <tbody>
                      <tr className="border">
                        <td className="border">STT</td>
                        <td className="border">Mã SP</td>
                        <td className="border">Tên sản phẩm</td>
                        <td className="border">SL</td>
                        <td className="border">KM</td>
                        <td className="border">Giá gốc</td>
                        <td className="border">CK</td>
                        <td className="border">Giá bán</td>
                        <td className="border">Thành tiền</td>
                      </tr>
                      {dataBill?.sales_bill?.map((item, index) => {
                        const subtotal = item?.quality * item?.price;
                        const discountAmount =
                          subtotal * (item?.discount / 100);
                        return (
                          <tr key={item.id} className="tr-body">
                            <td className="border">{++index}</td>
                            <td className="border">{item.code}</td>
                            <td className="border">{item.name}</td>
                            <td className="border">{item.quality}</td>
                            <td className="border">0</td>
                            <td className="border">
                              {item.price.toLocaleString("en-US")}
                            </td>
                            <td className="border">{item.discount}</td>
                            <td className="border">
                              {item.price.toLocaleString("en-US")}
                            </td>
                            <td className="border">
                              {Math.round(
                                subtotal - discountAmount
                              ).toLocaleString("en-US")}
                            </td>
                          </tr>
                        );
                      })}

                      <tr className="tr-body">
                        <td colSpan={8}>Tổng cộng:</td>
                        <td style={{ fontWeight: "bold" }}>
                          {Math.round(total).toLocaleString("en-US")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    cellPadding={0}
                    style={{
                      textAlign: "center",
                      width: "100%",
                      borderCollapse: "collapse",
                      fontWeight: "bold",
                      marginTop: 5,
                    }}
                  >
                    <tbody>
                      <tr>
                        <td colSpan={2}>Bằng chữ:</td>
                        <td colSpan={3}>
                          {isNaN(total_price) || total_price === "NaN"
                            ? vnNum2Words(0)
                            : vnNum2Words(total_price)}
                        </td>
                        <td colSpan={3}>CK Thương Mại:</td>
                        <td>{dataBill?.created_at?.discount}%</td>
                      </tr>
                      <tr>
                        <td colSpan={6} />
                        <td colSpan={2}>Tổng hóa đơn:</td>
                        <td style={{ fontWeight: "bold" }}>
                          {Math.round(
                            total -
                              total * (dataBill?.created_at?.discount / 100)
                          ).toLocaleString("en-US")}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={9} style={{ textAlign: "left" }}>
                          Ghi chú:
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    style={{
                      textAlign: "center",
                      borderCollapse: "collapse",
                      fontWeight: "bold",
                      width: "100%",
                    }}
                  >
                    <tbody>
                      <tr style={{ height: "92.5px" }}>
                        <td style={{ height: "92.5px" }}>Kế toán</td>
                        <td style={{ height: "92.5px" }}>Nhân viên trả hàng</td>
                        <td style={{ height: "92.5px" }}>Khách hàng</td>
                      </tr>
                      <tr style={{ height: "92.5px" }}>
                        <td style={{ height: "92.5px" }} colSpan={3}>
                          &nbsp;
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="w-full justify-end mb-3">
                <div className="w-[28%] ml-auto">
                  <button
                    className="btn btn-success btn-button mr-2 waves-effect"
                    id="print_retail"
                    target="_blank"
                  >
                    Bán lẻ
                  </button>
                  <button
                    onClick={handlePrint}
                    className="btn btn-success btn-button mr-2 waves-effect"
                    id="print_page"
                    target="_blank"
                  >
                    In đơn
                  </button>
                  <button
                    className="btn btn-button btn-danger waves-effect waves-light"
                    data-dismiss="modal"
                    fdprocessedid="jbzlnt"
                    onClick={handleCloseModal}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
