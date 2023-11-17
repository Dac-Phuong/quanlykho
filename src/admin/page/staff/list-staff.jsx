import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useQueryClient, useMutation, useQuery } from 'react-query'
import Loading from '../../../components/loading'
import { CREATE_STAFF, GET_ITEM_STAFF, UPDATE_STAFF_STATUS } from '../../api'
import { showToastError, showToastSuccess } from '../../utils/toastmessage'
import HeaderComponents from '../../../components/header'
import { TextField } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { getUserData } from '../../utils/function'
import AlertDialogStaff from '../../../components/modal/modal-staff'
import { Link } from 'react-router-dom'
import { useGetDataListStaff } from '../../api/useFetchData'
import { http } from '../../utils/http'
import { STAFF_KEY } from '../../../constants/keyQuery'
import DataGridCustom from '../../../components/dataGridCustom'

export default function ListStaff() {
    const Title = 'Nhân viên'
    const [loading, setIsLoading] = useState(false)
    const queryClient = useQueryClient()
    const [newData, setNewData] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [staffId, setStaffId] = useState(null)
    const [newId, setNewId] = useState(null)
    const userData = getUserData()

    const [formData, setFormData] = useState({
        user_id: userData?.user?.id,
        fullname: '',
        address: '',
        phone: '',
        debt: 0
    })
    //   lấy dữ liệu từ input
    const handleInputChange = (event) => {
        const { name, value } = event?.target
        setFormData({
            ...formData,
            [name]: value
        })
    }
    // lấy dữ liệu về
    const { data, error, isLoading } = useQuery(STAFF_KEY, useGetDataListStaff(STAFF_KEY))

    const handleGetStaff = async (newId) => {
        const response = await http.get(GET_ITEM_STAFF + newId)
        return response.data
    }
    const { data: staff_debt, isLoading: isLoadings } = useQuery(
        ['purchases_detail', newId],
        () => handleGetStaff(newId),
        {
            enabled: !!newId
        }
    )

    // hàm tạo kho từ useQuery
    const createStaff = async (formData) => {
        try {
            const response = await http.post(CREATE_STAFF, formData)
            setIsLoading(false)
            setFormData({
                user_id: '',
                fullname: '',
                address: '',
                phone: '',
                debt: 0
            })
            showToastSuccess('Thêm nhân viên thành công!')
            return response.data
        } catch (error) {
            setIsLoading(false)
            showToastError('Thêm nhân viên thất bại!')
            console.log(error)
        }
    }
    //   cập nhật
    const updateStatus = async (id) => {
        try {
            const response = await http.put(UPDATE_STAFF_STATUS + id)
            showToastSuccess('Thay đổi trạng thái thành công')
            return response.data
        } catch (error) {
            showToastError('Thay đổi trạng thái thất bại')
        }
    }
    const updateStatuss = useMutation(updateStatus)

    const handleUpdateStatus = (id) => {
        updateStatuss.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['staff_key'] })
            }
        })
    }
    const handleGetItem = async (id) => {
        setStaffId(id)
        setIsModalOpen(true)
        setNewId(id)
    }

    const handleCloseModal = () => {
        setStaffId(null)
        setIsModalOpen(false)
    }

    // hàm tạo
    const mutation = useMutation(createStaff, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff_key'] })
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
        { field: 'debt', headerName: 'Công nợ', minWidth: 120, flex: 1 },
        { field: 'active', headerName: 'Trạng thái', minWidth: 120, flex: 1 },
        {
            field: 'action',
            headerName: 'Thao tác',
            minWidth: 390,
            flex: 1,
            renderCell: (params) => {
                return (
                    <div>
                        <Link
                            to={`/nhan-vien/sua-nhan-vien/${params?.row?.id}`}
                            className='btn btn-button  btn-primary ml-2'
                        >
                            sửa
                        </Link>
                        <button className='btn btn-info btn-button waves-effect waves-light ml-2'>Báo cáo</button>
                        <button
                            className='btn btn-button  btn-warning waves-effect waves-light ml-2'
                            onClick={() => handleGetItem(params?.row?.id)}
                        >
                            Công nợ
                        </button>
                        <button
                            className={
                                params?.row?.active === 'đang làm'
                                    ? 'btn btn-button btn-danger waves-effect waves-light ml-2'
                                    : 'btn btn-button btn-success waves-effect waves-light ml-2'
                            }
                            fdprocessedid='k4qcck'
                            onClick={() => handleUpdateStatus(params?.row?.id)}
                        >
                            {params?.row?.active === 'đang làm' ? 'Nghỉ việc' : 'Làm lại'}
                        </button>
                    </div>
                )
            }
        }
    ]
    useEffect(() => {
        if (isLoading) {
            return
        }
        if (data) {
            setNewData(data?.data)
        }
    }, [isLoading, data])

    const rows =
        newData?.map((item, index) => ({
            id: item.id,
            index: ++index,
            fullname: item.fullname,
            address: item.address,
            debt: item.debt.toLocaleString('en-US'),
            phone: item.phone,
            active: item.active === 0 ? 'đang làm' : 'nghỉ việc',
            to_date: item.to_date
        })) || []

    if (isLoading) {
        return <Loading />
    }
    // kiểm tra dữ liệu
    const validation = () => {
        let isValid = true
        const regex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/
        if (formData.fullname.trim() === '') {
            showToastError('Vui nhập tên nhân viên!')
            isValid = false
        } else if (regex.test(formData.fullname)) {
            showToastError('Tên nhân viên không được chứa ký tự đặc biệt!')
            isValid = false
        }
        if (formData.phone.trim() === '') {
            showToastError('Vui nhập số điện thoại nhân viên!')
            isValid = false
        } else if (regex.test(formData.phone) || !/^[0-9]+$/.test(formData.phone)) {
            showToastError('Số điện thoại không đúng đúng định dạng!')
            isValid = false
        }
        if (formData.address.trim() === '') {
            showToastError('Vui nhập địa chỉ nhân viên!')
            isValid = false
        } else if (regex.test(formData.address)) {
            showToastError('Địa chỉ không được chứa ký tự đặc biệt!')
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
                <HeaderComponents label={'Quản lý kho hàng'} title={'Thêm chiết khấu'} />
                <div className='card m-4'>
                    <div className='card-header'>
                        <div className='card-header-left'>
                            <div className='header_title'>
                                <h5>Thông tin</h5>
                            </div>
                            <small>Nhập thông tin Nhân Viên</small>
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
                            <div className='flex justify-between'>
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
                                Lưu nhân viên
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
                                <h5>Danh sách Nhân Viên</h5>
                            </div>
                            <small>Thông tin của các nhân viên</small>
                        </div>
                    </div>
                    <div className='card-block remove-label'>
                        <DataGridCustom rows={rows} columns={columns} nameItem={'nhân viên'} />
                    </div>
                </div>
                <AlertDialogStaff
                    handleCloseModal={handleCloseModal}
                    isModalOpen={isModalOpen}
                    staffId={staffId}
                    item_staff={staff_debt}
                    isLoadings={isLoadings}
                />
            </div>
            <>{loading ? <Loading /> : null}</>
        </div>
    )
}
