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
import { MenuItem, TextField } from '@mui/material'
import { FaCloudDownloadAlt } from 'react-icons/fa'
import Form from 'react-bootstrap/Form'
import { useGetDataListWareHouse } from '../../api/useFetchData'
import { http } from '../../utils/http'
import { UPLOAD_FILE_PURCHASES } from '../../api'
import { maxSizeInBytes } from '../../../constants'
import { WAREHOUSE_KEY } from '../../../constants/keyQuery'

export default function ImportPurchase() {
    const Title = 'Nhập hàng bằng excecl'
    const [loading, setIsLoading] = useState(false)
    const currentDate = new Date()
    const [date, setDate] = useState(dayjs(currentDate))
    const [file, setSelectedFile] = useState(null)
    const [warehouseId, setWarehouseId] = useState('')
    const csvData = [['Mã hàng', 'Tên hàng', 'Màu sắc', 'Số lượng']]
    const { data } = useQuery(WAREHOUSE_KEY, useGetDataListWareHouse(WAREHOUSE_KEY))
    useEffect(() => {
        if (warehouseId === '' && data?.data?.length > 0) {
            setWarehouseId(data?.data[0].id)
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
        e.preventDefault()
        if (!file) {
            showToastError('Vui lòng chọn 1 file Excel')
        } else {
            setIsLoading(true)
            const formData = new FormData()
            formData.append('file', file)
            formData.append('date', dayjs(date).format('YYYY-MM-DD'))
            formData.append('warehouse_id', warehouseId)
            try {
                const response = await http.post(UPLOAD_FILE_PURCHASES, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                setIsLoading(false)
                setSelectedFile(null)
                showToastSuccess('Nhập đơn hàng thành công')
                return response.data
            } catch (error) {
                setIsLoading(false)
                showToastError(
                    'Nhập đơn hàng thất bại ' + error.response.data.message + ' :' + error.response.data.product_code
                )
                console.error('File upload failed: ', error)
            }
        }
    }

    return (
        <div className='pcoded-content'>
            <div className=''>
                <Helmet>
                    <title>{Title}</title>
                </Helmet>
                <HeaderComponents label={'Quản lý kho hàng'} title={'Nhập hàng bằng Excel'} />
                <div className='card m-4'>
                    <div className='card-header'>
                        <div className='card-header-left'>
                            <div className='header_title'>
                                <h5>Nhập đơn bằng file excel</h5>
                            </div>
                            <div className='flex align-items-center mt-2'>
                                <small>File mẫu nhập đơn</small>
                                <CSVLink
                                    filename={'mau-file-don-nhap'}
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
                        <div className='flex mt-3 flex-wrap gap-3 justify-between max-sm:justify-normal'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    className='w-full sm:w-[48%]'
                                    label='Ngày tạo đơn'
                                    value={date}
                                    onChange={(newValue) => setDate(newValue)}
                                    slotProps={{ textField: { variant: 'filled' } }}
                                />
                            </LocalizationProvider>
                            <div className='text-[#555] mt-[9px] w-full sm:w-[48%]'>
                                <TextField
                                    fullWidth
                                    select
                                    value={warehouseId}
                                    onChange={handleChange}
                                    label='Chọn Kho nhập '
                                    id='standard-basic'
                                    variant='standard'
                                >
                                    {data?.data?.map((item, index) => {
                                        return (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.fullname}
                                            </MenuItem>
                                        )
                                    })}
                                </TextField>
                            </div>
                        </div>
                        <div className='mt-10'>
                            <Form.Group controlId='formFile' className='mb-3 w-full md:w-[48%]'>
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
