import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import dayjs from 'dayjs'
import { useQuery } from 'react-query'
import { CSVLink } from 'react-csv'
import Loading from '../../../components/loading'
import { showToastError, showToastSuccess } from '../../utils/toastmessage'
import HeaderComponents from '../../../components/header'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Autocomplete, MenuItem, TextField, TextareaAutosize } from '@mui/material'
import { FaCloudDownloadAlt } from 'react-icons/fa'
import Form from 'react-bootstrap/Form'
import { useGetDataCreateSales } from '../../api/useFetchData'
import { http } from '../../utils/http'
import { UPLOAD_FILE_PURCHASES } from '../../api'

export default function ImportSalesExcel() {
    const Title = 'Xuất hàng bằng excecl'
    const [loading, setIsLoading] = useState(false)
    const currentDate = new Date()
    const [date, setDate] = useState(dayjs(currentDate))
    const [file, setSelectedFile] = useState(null)
    const [warehouseId, setWarehouseId] = useState(null)
    const [staffId, setStafseId] = useState(null)
    const queryKey = 'sales_key'
    const maxSizeInBytes = 52428800
    const [formData, setFormData] = useState({
        fullname: '',
        address: '',
        phone: '',
        debt: 0,
        location: 0
    })
    //   lấy dữ liệu từ input
    const handleInputChange = (event) => {
        const { name, value } = event?.target
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const csvData = [['Mã hàng', 'Tên hàng', 'Màu sắc', 'Số lượng', 'Khuyến mãi', 'Chiết khấu', 'Giá gốc']]
    const { data, isLoading, isError } = useQuery(queryKey, useGetDataCreateSales(queryKey))
    useEffect(() => {
        if (warehouseId === '' && data?.staff?.length > 0) {
            setWarehouseId(data?.staff[0].id)
        }
    }, [data, warehouseId])

    const handleChange = (event) => {
        setWarehouseId(event?.target?.value)
    }

    const handleFileSelect = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            const file = event.target.files[0]
            if (file.size > maxSizeInBytes) {
                showToastError('Vui lòng chọn một tệp Excel có dung lượng nhỏ hơn 50MB')
                return
            }
            if (
                file &&
                (file.name.endsWith('.xls') || file.name.endsWith('.xlsx') || file.name.endsWith('.csv')) &&
                file.size <= maxSizeInBytes
            ) {
                setSelectedFile(file)
            } else {
                showToastError('Vui lòng chọn một tệp Excel hoặc CSV có đuôi (.xls or .xlsx or .csv)')
                event.target.value = null
            }
        }
    }
    const handleSubmitFile = async (e) => {
        showToastError('Đang chờ update')
        // e.preventDefault();
        // if (!file) {
        //   showToastError("Vui lòng chọn 1 file Excel");
        // } else {
        //   setIsLoading(true);
        //   const formData = new FormData();
        //   formData.append("file", file);
        //   formData.append("date", dayjs(date).format("YYYY-MM-DD"));
        //   formData.append("warehouse_id", warehouseId);
        //   try {
        //     const response = await http.post(UPLOAD_FILE_PURCHASES, formData, {
        //       headers: {
        //         "Content-Type": "multipart/form-data",
        //       },
        //     });
        //     setIsLoading(false);
        //     setSelectedFile(null);
        //     showToastSuccess("Nhập đơn hàng thành công");
        //     return response.data;
        //   } catch (error) {
        //     setIsLoading(false);
        //     showToastError(
        //       "Nhập đơn hàng thất bại " +
        //         error.response.data.message +
        //         " :" +
        //         error.response.data.product_code
        //     );
        //     console.error("File upload failed: ", error);
        //   }
        // }
    }

    return (
        <div className='pcoded-content'>
            <div className=''>
                <Helmet>
                    <title>{Title}</title>
                </Helmet>
                <HeaderComponents label={'Quản lý kho hàng'} title={'Xuất hàng bằng Excel'} />
                <div className='card m-4'>
                    <div className='card-header'>
                        <div className='card-header-left'>
                            <div className='header_title'>
                                <h5>Xuất hàng bằng file excel</h5>
                            </div>
                            <div className='flex align-items-center mt-2'>
                                <small>File mẫu đơn xuất</small>
                                <CSVLink
                                    filename={'mau-file-don-xuat'}
                                    className='btn btn-button flex waves-effect waves-light ml-2 btn-danger btn-block w-[52%] h-[35px]'
                                    data={csvData}
                                >
                                    <FaCloudDownloadAlt className='mr-1 -mt-[2px]' size={20} />
                                    Download
                                </CSVLink>
                            </div>
                        </div>
                    </div>
                    <div className='card-block remove-label'>
                        <div className='flex mt-1 justify-between max-sm:justify-normal max-sm:flex-col'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    className=' sm:w-[49%] w-full mr-3  max-sm:mr-1'
                                    label='Ngày tạo đơn'
                                    value={date}
                                    onChange={(newValue) => setDate(newValue)}
                                    slotProps={{ textField: { variant: 'filled' } }}
                                />
                            </LocalizationProvider>
                            <div className='sm:w-[49%] w-full mt-[8px] max-sm:mr-1'>
                                <TextField
                                    fullWidth
                                    select
                                    value={warehouseId}
                                    onChange={handleChange}
                                    label='Chọn Kho bán '
                                    id='standard-basic'
                                    variant='standard'
                                >
                                    {data?.warehouses?.map((item) => {
                                        return (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.fullname}
                                            </MenuItem>
                                        )
                                    })}
                                </TextField>
                            </div>
                        </div>
                        <div className='flex flex-wrap gap-3 justify-between my-1'>
                            <Autocomplete
                                className='w-full lg:w-[49%]'
                                id='disable-close-on-select'
                                clearOnEscape
                                options={data && data?.staff ? data?.staff : []}
                                // onChange={handleChangeStaff}
                                // value={staffId}
                                getOptionLabel={(rows) => rows?.fullname || ''}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label='Chọn nhân viên'
                                        variant='standard'
                                        size='small'
                                    />
                                )}
                            />
                            <Autocomplete
                                className='w-full lg:w-[49%]'
                                id='disable-close-on-select'
                                clearOnEscape
                                options={data && data?.customers ? data?.customers : []}
                                // onChange={handleChangeCustomer}
                                // value={customerId}
                                getOptionLabel={(rows) => rows?.fullname + ' - ' + rows?.address || ''}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label='Chọn khách hàng'
                                        variant='standard'
                                        size='small'
                                    />
                                )}
                            />
                        </div>
                        <div className='form-group w-full lg:w-[49%] mt-[5px] max-sm:mr-1'>
                            <TextField
                                label='Chiết khấu thêm'
                                type='number'
                                fullWidth
                                // value={discount}
                                id='standard-basic'
                                variant='standard'
                                name='discount'
                                placeholder='5%'
                                // onChange={handleChangeDiscount}
                            />
                        </div>
                        <div className='form-textarea w-full'>
                            <TextareaAutosize
                                id='group-description'
                                className='w-full mt-3 cursor-pointer text-black'
                                // value={formData.description}
                                name='description'
                                // onChange={(e) => setNote(e.target.value)}
                                placeholder='Ghi chú đơn hàng. VD: Đơn hàng ngoài'
                                aria-label='minimum height'
                                minRows={3}
                            />
                        </div>
                        <div className='mt-10'>
                            <Form.Group controlId='formFile' className='mb-3 w-full sm:w-[49%]'>
                                <Form.Control onChange={handleFileSelect} type='file' />
                            </Form.Group>
                        </div>
                        <div className='form-inline mt-5 max-sm:mt-5 max-sm:w-full w-[100%]'>
                            <button
                                className='btn  waves-effect waves-light btn-primary btn-block w-full'
                                type='submit'
                                onClick={(e) => handleSubmitFile(e)}
                                fdprocessedid='88fg6k'
                            >
                                Tải đơn hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <>{loading ? <Loading /> : null}</>
        </div>
    )
}
