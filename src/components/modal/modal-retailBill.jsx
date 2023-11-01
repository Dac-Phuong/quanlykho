import React, { useRef } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import vnNum2Words from 'vn-num2words'
import { useReactToPrint } from 'react-to-print'

export default function AlertDialogRetailBill({ handleCloseModal, isModalOpen, dataBill, loading }) {
    const componentRef = useRef()

    const total = dataBill?.sales_bill?.reduce(
        (acc, item) => acc + item.price * item.quality - item.price * item.quality * (item.discount / 100),
        0
    )
    const total_price = Math.round(total - total * (dataBill?.created_at?.discount / 100))
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    })
    return (
        <div>
            {loading ? null : (
                <Dialog
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogActions className='modal-main'>
                        <div className='w-full'>
                            <div className='modal-content print_only' ref={componentRef}>
                                <div className='modal-body' id='content-invoice'>
                                    <div className='pb-2.5 font-bold'>
                                        <div className='text-center'>HÓA ĐƠN BÁN LẺ</div>
                                        <div className='flex justify-around'>
                                            <p>Ngày: {dataBill?.created_at?.date}</p>
                                            <p>Số hóa đơn:&nbsp; {dataBill?.created_at?.id}</p>
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <p>Tên người mua hàng: {dataBill?.customer?.name_customers}</p>
                                            <p>Địa chỉ: {dataBill?.customer?.address_customers}</p>
                                            <p>SĐT: {dataBill?.customer?.phone_customers}</p>
                                        </div>
                                    </div>
                                    <table
                                        cellPadding={0}
                                        className=' '
                                        style={{
                                            textAlign: 'center',
                                            width: '100%',
                                            borderCollapse: 'collapse',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        <tbody>
                                            <tr className='border'>
                                                <td className='border'>STT</td>
                                                <td className='border'>Mã SP</td>
                                                <td className='border'>Tên sản phẩm</td>
                                                <td className='border'>SL</td>
                                                <td className='border'>KM</td>
                                                <td className='border'>Giá gốc</td>
                                                <td className='border'>CK</td>
                                                <td className='border'>Giá bán</td>
                                                <td className='border'>Thành tiền</td>
                                            </tr>
                                            {dataBill?.sales_bill?.map((item, index) => {
                                                const subtotal = item?.quality * item?.price
                                                const discountAmount = subtotal * (item?.discount / 100)
                                                return (
                                                    <tr key={item.id} className='tr-body'>
                                                        <td className='border'>{++index}</td>
                                                        <td className='border'>{item.code}</td>
                                                        <td className='border'>{item.name}</td>
                                                        <td className='border'>{item.quality}</td>
                                                        <td className='border'>{item.get_more}</td>
                                                        <td className='border'>{item.price.toLocaleString('en-US')}</td>
                                                        <td className='border'>{item.discount}</td>
                                                        <td className='border'>{item.price.toLocaleString('en-US')}</td>
                                                        <td className='border'>
                                                            {Math.round(subtotal - discountAmount).toLocaleString(
                                                                'en-US'
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                    <table
                                        cellPadding={0}
                                        style={{
                                            textAlign: 'center',
                                            width: '100%',
                                            borderCollapse: 'collapse',
                                            fontWeight: 'bold',
                                            marginTop: 5
                                        }}
                                    >
                                        <tbody className='text-start'>
                                            <tr>
                                                <td>Tổng hóa đơn:</td>
                                                <td style={{ fontWeight: 'bold' }}>
                                                    {Math.round(
                                                        total - total * (dataBill?.created_at?.discount / 100)
                                                    ).toLocaleString('en-US')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Bằng chữ:</td>
                                                <td className='capitalize'>
                                                    {isNaN(total_price) || total_price === 'NaN'
                                                        ? vnNum2Words(0)
                                                        : vnNum2Words(total_price)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={9} style={{ textAlign: 'left' }}>
                                                    Ghi chú:
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table
                                        style={{
                                            textAlign: 'center',
                                            borderCollapse: 'collapse',
                                            fontWeight: 'bold',
                                            width: '100%'
                                        }}
                                    >
                                        <tbody>
                                            <tr style={{ height: '92.5px' }}>
                                                <td style={{ height: '92.5px' }}>Người nhận hàng</td>
                                                <td style={{ height: '92.5px' }}>Người giao hàng</td>
                                            </tr>
                                            <tr style={{ height: '92.5px' }}>
                                                <td style={{ height: '92.5px' }} colSpan={3}>
                                                    &nbsp;
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='w-full justify-end mb-3'>
                                <div className='w-[28%] ml-auto'>
                                    <button
                                        onClick={handlePrint}
                                        className='btn btn-success btn-button mr-2 waves-effect'
                                        id='print_page'
                                        target='_blank'
                                    >
                                        In đơn
                                    </button>
                                    <button
                                        className='btn btn-button btn-danger waves-effect waves-light'
                                        data-dismiss='modal'
                                        fdprocessedid='jbzlnt'
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
    )
}
