import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { Autocomplete, TextField } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { FaEdit } from 'react-icons/fa'
import { AiFillDollarCircle } from 'react-icons/ai'
import { MdAddShoppingCart, MdShoppingCart } from 'react-icons/md'
import { Link } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip'

import HeaderComponents from '../../../components/header'
import { showToastError, showToastSuccess } from '../../utils/toastmessage'
import AlertDialogCustomer from '../../../components/modal/modal-customer'
import { useGetDataCustomers } from '../../api/useFetchData'
import AlertDialogUpdateCustomer from '../../../components/modal/modal-updateCustomer'
import Loading from '../../../components/loading'
import { CREATE_CUSTOMER, GET_DEBT_CUSTOMER } from '../../api'
import { http } from '../../utils/http'

export default function ListCustomers() {
    const Title = 'Khách hàng'
    const queryKey = 'customer_key'
    const [loading, setIsLoading] = useState(false)
    const queryClient = useQueryClient()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isShowModalOpen, setIsShowModalOpen] = useState(false)
    const [customerId, setCustomerId] = useState(null)
    const [value, setValue] = useState(null)
    const [newId, setNewId] = useState(null)
    const [formData, setFormData] = useState({
        fullname: '',
        address: '',
        phone: '',
        debt: 0,
        location: 0
    })
    const handleChange = (event, newValue) => {
        setValue(newValue)
        setFormData({
            ...formData,
            location: newValue?.id
        })
    }
    //   lấy dữ liệu từ input
    const handleInputChange = (event) => {
        const { name, value } = event?.target
        if (name === 'debt') {
            if (value === '') {
                setFormData({
                    ...formData,
                    [name]: 0
                })
            } else if (value[0] === '0' && value.length > 1) {
                setFormData({
                    ...formData,
                    [name]: value.slice(1)
                })
            } else {
                setFormData({
                    ...formData,
                    [name]: value
                })
            }
            return
        }
        setFormData({
            ...formData,
            [name]: value
        })
    }
    // lấy dữ liệu về
    const { data, error, isLoading } = useQuery(queryKey, useGetDataCustomers(queryKey))
    const handleGetItemCustomer = async (newId) => {
        const response = await http.get(GET_DEBT_CUSTOMER + newId)
        return response.data
    }
    const { data: item_customer, isLoading: isLoadings } = useQuery(
        ['customer_key', newId],
        () => handleGetItemCustomer(newId),
        {
            enabled: !!newId
        }
    )

    // hàm tạo kho từ useQuery
    const createCustomer = async (formData) => {
        try {
            const response = await http.post(CREATE_CUSTOMER, formData)
            setIsLoading(false)
            setFormData({
                fullname: '',
                address: '',
                phone: '',
                debt: 0,
                location: 0
            })
            setValue(null)
            showToastSuccess('Thêm khách hàng thành công!')
            return response.data
        } catch (error) {
            setIsLoading(false)
            showToastError('Thêm khách hàng thất bại!')
            console.log(error)
        }
    }

    const handleGetItem = (id) => {
        setCustomerId(id)
        setIsModalOpen(true)
        setNewId(id)
    }
    const handleOpenModal = (id) => {
        setCustomerId(id)
        setIsShowModalOpen(true)
        setNewId(id)
    }
    const handleCloseModal = () => {
        setCustomerId(null)
        setIsModalOpen(false)
        setIsShowModalOpen(false)
    }

    // hàm tạo
    const mutation = useMutation(createCustomer, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customer_key'] })
        },
        onError: (error) => {
            console.error('Lỗi khi gửi yêu cầu POST:', error)
        }
    })

    const columns = [
        { field: 'index', headerName: 'STT' },
        { field: 'fullname', headerName: 'Họ và tên', minWidth: 120, flex: 1 },
        { field: 'address', headerName: 'Địa chỉ', minWidth: 220, flex: 1 },
        { field: 'phone', headerName: 'Số điện thoại', minWidth: 140, flex: 1 },
        { field: 'order', headerName: 'Đơn hàng', minWidth: 140, flex: 1 },
        { field: 'debt', headerName: 'Công nợ', minWidth: 120, flex: 1 },
        { field: 'location', headerName: 'Tuyến', minWidth: 120, flex: 1 },
        {
            field: 'action',
            headerName: 'Thao tác',
            minWidth: 270,
            flex: 1,
            renderCell: (params) => {
                return (
                    <div>
                        <Tooltip title='Sửa'>
                            <button
                                className='btn btn-button btn-danger btn-edit  ml-2'
                                onClick={() => handleOpenModal(params?.row?.id)}
                            >
                                <FaEdit size={20} />
                            </button>
                        </Tooltip>
                        <Tooltip title='Công nợ'>
                            <button
                                className='btn btn-button  btn-warning waves-effect waves-light ml-2'
                                onClick={() => handleGetItem(params?.row?.id)}
                            >
                                <AiFillDollarCircle size={20} />
                            </button>
                        </Tooltip>
                        <Tooltip title='Danh sách đơn hàng'>
                            <Link
                                to={`/khach-hang/don-hang/${params?.row?.id}`}
                                className='btn btn-info btn-button waves-effect waves-light ml-2'
                            >
                                <MdShoppingCart size={20} />
                            </Link>
                        </Tooltip>
                        <Tooltip title='Danh sách đơn hàng đã lấy'>
                            <Link
                                to={`/khach-hang/hang-da-lay/${params?.row?.id}`}
                                className='btn btn-primary btn-button waves-effect waves-light ml-2'
                            >
                                <MdAddShoppingCart size={20} />
                            </Link>
                        </Tooltip>
                    </div>
                )
            }
        }
    ]
    const rows = data?.data?.map((item, index) => ({
        id: item.id,
        index: ++index,
        fullname: item.fullname,
        address: item.address,
        debt: item.debt.toLocaleString('en-US'),
        order: item.total_orders,
        phone: item.phone,
        location: item?.location ? data?.location?.find((ite) => ite.id === item?.location)?.name : 'Không xác định',
        to_date: item.to_date
    }))

    if (isLoading) {
        return <Loading />
    }
    // kiểm tra dữ liệu
    const validation = () => {
        let isValid = true
        const regex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\]/
        const regexNumber = /[1-9]/
        if (formData.fullname.trim() === '') {
            showToastError('Vui nhập tên khách hàng!')
            isValid = false
        } else if (regex.test(formData.fullname)) {
            showToastError('Tên khách hàng không được chứa ký tự đặc biệt!')
            isValid = false
        }
        if (formData.phone.trim() === '') {
            showToastError('Vui nhập số điện thoại khách hàng!')
            isValid = false
        } else if (regex.test(formData.phone)) {
            showToastError('Số điện thoại không được chứa ký tự đặc biệt!')
            isValid = false
        }
        if (formData.address.trim() === '') {
            showToastError('Vui nhập địa chỉ khách hàng!')
            isValid = false
        } else if (regex.test(formData.address)) {
            showToastError('Địa chỉ không được chứa ký tự đặc biệt!')
            isValid = false
        }
        if (formData.debt.trim() === '') {
            showToastError('Vui nhập công nợ khách hàng!')
            isValid = false
        } else if (!regexNumber.test(formData.debt)) {
            showToastError('Công nợ phải là số!')
            isValid = false
        }
        return isValid
    }
    // hàm tạo
    const submitForm = () => {
        const isValid = validation()
        if (isValid) {
            setIsLoading(true)
            mutation.mutate(formData)
        }
    }

    return (
        <div className='pcoded-content'>
            <div className=''>
                <Helmet>
                    <title>{Title}</title>
                </Helmet>
                <HeaderComponents label={'Quản lý nhân viên'} title={'Thêm Khách hàng'} />
                <div className='card m-4'>
                    <div className='card-header'>
                        <div className='card-header-left'>
                            <div className='header_title'>
                                <h5>Thông tin</h5>
                            </div>
                            <small>Nhập thông tin Khách hàng</small>
                        </div>
                    </div>
                    <div className='card-block remove-label'>
                        <div className=''>
                            <TextField
                                className='form-control '
                                label='Họ và tên'
                                id='standard-basic'
                                placeholder='Nguyễn Đắc Phương'
                                variant='standard'
                                name='fullname'
                                type='text'
                                value={formData.fullname}
                                onChange={handleInputChange}
                            />
                            <TextField
                                className='form-control'
                                id='standard-basic'
                                variant='standard'
                                name='address'
                                type='text'
                                placeholder='Bắc Giang'
                                label='Nhập địa chỉ '
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                            <Autocomplete
                                fullWidth
                                className='mt-2'
                                id='disable-close-on-select'
                                clearOnEscape
                                value={value}
                                onChange={handleChange}
                                options={data?.location}
                                getOptionLabel={(rows) =>
                                    rows?.desc ? rows?.name + ' - ' + rows?.desc : rows?.name || ''
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label='Chọn vị trí'
                                        variant='standard'
                                        size='small'
                                    />
                                )}
                            />
                            <div className='flex mt-3 justify-between'>
                                <TextField
                                    className='form-control w-[49%] mr-2'
                                    id='standard-basic'
                                    variant='standard'
                                    name='phone'
                                    type='text'
                                    placeholder='0334262754'
                                    label='Số điện thoại'
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    className='form-control w-[49%]'
                                    id='standard-basic'
                                    variant='standard'
                                    name='debt'
                                    type='text'
                                    placeholder='500000'
                                    label='Công nợ'
                                    value={formData.debt}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className='form-inline py-8 mt-2'>
                            <button
                                className='btn btn-primary waves-effect waves-light w-full'
                                type='submit'
                                fdprocessedid='88fg6k'
                                onClick={() => submitForm()}
                            >
                                Lưu khách hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className=' m-4'>
                <div className='card'>
                    <div className='card-header'>
                        <div className='card-header-left'>
                            <div className='header_title'>
                                <h5>Danh sách Khách Hàng</h5>
                            </div>
                            <small>Thông tin danh sách khách hàng</small>
                        </div>
                    </div>
                    <div className='card-block remove-label'>
                        <div className='body mt-16' style={{ width: '100%' }}>
                            <DataGrid
                                rows={rows || []}
                                disableColumnFilter
                                disableColumnSelector
                                disableDensitySelector
                                showCellVerticalBorder
                                showColumnVerticalBorder
                                autoHeight
                                initialState={{
                                    ...data?.initialState,
                                    pagination: { paginationModel: { pageSize: 20 } }
                                }}
                                pageSizeOptions={[20, 50, 100]}
                                columns={columns}
                                slots={{ toolbar: GridToolbar }}
                                slotProps={{
                                    toolbar: {
                                        showQuickFilter: true
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                <AlertDialogCustomer
                    handleCloseModal={handleCloseModal}
                    isModalOpen={isModalOpen}
                    isLoadings={isLoadings}
                    customerId={customerId}
                    item_customer={item_customer}
                />
                <AlertDialogUpdateCustomer
                    handleCloseModal={handleCloseModal}
                    isShowModalOpen={isShowModalOpen}
                    isLoadings={isLoadings}
                    customerId={customerId}
                    item_customer={item_customer}
                />
            </div>
            <>{loading ? <Loading /> : null}</>
        </div>
    )
}
