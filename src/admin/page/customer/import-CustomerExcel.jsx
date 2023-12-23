import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import dayjs from 'dayjs'
import { useQuery } from 'react-query'
import { CSVLink } from 'react-csv'
import Loading from '../../../components/loading'
import { showToastError, showToastSuccess } from '../../utils/toastmessage'
import Select from '@mui/material/Select'
import HeaderComponents from '../../../components/header'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Autocomplete, MenuItem, TextField } from '@mui/material'
import { FaCloudDownloadAlt } from 'react-icons/fa'
import Form from 'react-bootstrap/Form'
import { useGetDataLocation } from '../../api/useFetchData'
import { http } from '../../utils/http'
import { UPLOAD_FILE_PURCHASES } from '../../api'

export default function ImportCustomers() {
    const Title = 'Nhập khách hàng bằng excecl'
    const [loading, setIsLoading] = useState(false)
    const currentDate = new Date()
    const [date, setDate] = useState(dayjs(currentDate))
    const [file, setSelectedFile] = useState(null)
    const [value, setValue] = useState(null)
    const [warehouseId, setWarehouseId] = useState('')
    const queryKey = 'warehouse_key'
    const maxSizeInBytes = 52428800
    const csvData = [['Họ tên', 'Đia chỉ', 'Số điện thoại']]
    const { data, error, isLoading } = useQuery(queryKey, useGetDataLocation(queryKey))

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
            formData.append('warehouse_id', warehouseId)
            try {
                const response = await http.post(UPLOAD_FILE_PURCHASES, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                setIsLoading(false)
                setSelectedFile(null)
                showToastSuccess('Nhập khách hàng thành công!')
                return response.data
            } catch (error) {
                setIsLoading(false)
                showToastError('Nhập khách hàng thất bại!')
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
                                <h5>Nhập khách hàng bằng file excel</h5>
                            </div>
                            <div className='flex align-items-center mt-2'>
                                <small>File mẫu nhập đơn</small>
                                <CSVLink
                                    filename={'mau-file-don-nhap-khach-hang'}
                                    className='btn btn-button flex waves-effect waves-light ml-2 btn-danger btn-block w-[48%] h-[35px]'
                                    data={csvData}
                                >
                                    <FaCloudDownloadAlt className='mr-1 -mt-[2px]' size={20} />
                                    Download
                                </CSVLink>
                            </div>
                        </div>
                    </div>
                    <div className='card-block remove-label'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-3'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    className=''
                                    label='Ngày tạo đơn'
                                    value={date}
                                    onChange={(newValue) => setDate(newValue)}
                                    slotProps={{ textField: { variant: 'filled' } }}
                                />
                            </LocalizationProvider>
                            <div className='text-[#555] mt-[11px]'>
                                <Autocomplete
                                    fullWidth
                                    id='disable-close-on-select'
                                    clearOnEscape
                                    value={value}
                                    onChange={handleChange}
                                    options={data?.data}
                                    getOptionLabel={(rows) =>
                                        rows?.desc ? rows?.name + ' - ' + rows?.desc : rows?.name || ''
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            label='Chọn tuyến'
                                            variant='standard'
                                            size='small'
                                        />
                                    )}
                                />
                            </div>
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
