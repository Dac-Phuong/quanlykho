import { useEffect, useState, Fragment } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'

import { FormControl, FormHelperText } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import dayjs from 'dayjs'

import Loading from '../../../components/loading'
import HeaderComponents from '../../../components/header'
import { useGetDataListStaffSalary } from '../../api/useFetchData'
import { STAFF_SALARY_KEY } from '../../../constants/keyQuery'
import BoxInformation from '../../../components/boxInformation'
import { http } from '../../utils/http'
import { STAFF_SALARY } from '../../api'
import DataGridCustom from '../../../components/dataGridCustom'
const schema = yup
    .object({
        dayBegin: yup
            .date()
            .test({
                name: 'dayBegin',
                message: 'Ngày bắt đầu không được lớn hơn ngày kết thúc',
                test: function (value) {
                    return dayjs(value).isBefore(this.parent.dayEnd)
                }
            })
            .required(),
        dayEnd: yup
            .date()
            .test({
                name: 'dayEnd',
                message: 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu',
                test: function (value) {
                    return dayjs(value).isAfter(this.parent.dayBegin)
                }
            })
            .required()
    })
    .required()

const defaultValues = {
    dayBegin: dayjs(new Date()).subtract(1, 'day'),
    dayEnd: dayjs(new Date())
}

const StaffSalary = () => {
    const [selectedStaff, setSelectedStaff] = useState([])
    const [selectGroup, setSelectGroup] = useState([])
    const [newData, setNewData] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(15)

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const { data, isLoading } = useQuery(STAFF_SALARY_KEY, useGetDataListStaffSalary(STAFF_SALARY_KEY))

    const columns = [
        { field: 'index', headerName: 'STT', minWidth: 70, flex: 0.5 },
        { field: 'sale_date', headerName: 'Ngày bán', minWidth: 110, flex: 1 },
        { field: 'staff', headerName: 'Nhân viên', minWidth: 210, flex: 1 },
        { field: 'customer', headerName: 'Khách hàng', flex: 1 },
        { field: 'product', headerName: 'Mã hàng', flex: 1 },
        { field: 'quantity', headerName: 'Số lượng', flex: 1 },
        { field: 'price', headerName: 'Đơn giá', minWidth: 110, flex: 1 },
        { field: 'allPrice', headerName: 'Thành tiền', minWidth: 130, flex: 1 },
        { field: 'bonus', headerName: 'Hoa hồng', minWidth: 70, flex: 1 },
        { field: 'salary', headerName: 'Lương', minWidth: 70, flex: 1 },
        {
            field: 'active',
            minWidth: 100,
            headerName: 'Thao tác',
            flex: 1,
            renderCell: (params) => {
                return (
                    <div>
                        <Link
                            // to={`/quan-ly-kho/sua-mat-hang/${params.row.id}`}
                            className='btn btn-button btn-primary ml-2'
                        >
                            sửa
                        </Link>
                    </div>
                )
            }
        }
    ]

    const rows =
        newData?.data?.map((item, index) => ({
            index: index + 1,
            id: index + 1,
            sale_date: item.sale_date,
            staff: item.staff,
            customer: item.customer,
            product: item.product,
            price: item.price,
            quantity: item.quantity,
            allPrice: item.allPrice,
            bonus: item.bonus,
            salary: item.salary
        })) || []

    const onSubmit = async (data) => {
        let bodyFormData = new FormData()
        bodyFormData.append('from_date', dayjs(data.dayBegin).format('DD-MM-YYYY'))
        bodyFormData.append('to_date', dayjs(data.dayEnd).format('DD-MM-YYYY'))
        bodyFormData.append(
            'product_group_id',
            selectGroup.map((item) => Number(item.replace('group', '')))
        )
        bodyFormData.append(
            'staff_id',
            selectedStaff.map((item) => Number(item.replace('staff', '')))
        )
        const { data: newData } = await http.post(STAFF_SALARY, bodyFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        setNewData(newData)
    }

    const handleCheckboxChangeStaff = (event) => {
        const id = event.target.id
        const isChecked = event.target.checked
        if (isChecked) {
            setSelectedStaff((prevSelectedIds) => [...prevSelectedIds, id])
        } else {
            setSelectedStaff((prevSelectedIds) => prevSelectedIds.filter((selectedId) => selectedId !== id))
        }
    }
    const handleCheckboxChangeGrProduct = (event) => {
        const id = event.target.id
        const isChecked = event.target.checked
        if (isChecked) {
            setSelectGroup((prevSelectedIds) => [...prevSelectedIds, id])
        } else {
            setSelectGroup((prevSelectedIds) => prevSelectedIds.filter((selectedId) => selectedId !== id))
        }
    }

    useEffect(() => {
        if (data) {
            setNewData(data)
        }
    }, [data])

    return (
        <div className='pcoded-content'>
            <div className=''>
                <Helmet>
                    <title>{'Doanh số thực'}</title>
                </Helmet>
                <HeaderComponents label={'Thống kê'} title={'Doanh số thực'} />
                <div className='card m-4'>
                    <div className='card-header'>
                        <div className='card-header-left'>
                            <div className='header_title'>
                                <h5>Doanh số bán hàng</h5>
                            </div>
                        </div>
                    </div>
                    <div className='card-block remove-label'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                            <BoxInformation data={newData?.totalSalary} textData={'VNĐ'} title={'Tổng lương'} />
                        </div>
                        <form autoComplete='off' fullWidth onSubmit={handleSubmit(onSubmit)}>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-3'>
                                <FormControl fullWidth>
                                    <Controller
                                        name='dayBegin'
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Fragment>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        label=' Từ ngày'
                                                        value={value}
                                                        onChange={onChange}
                                                        maxDate={dayjs(new Date())}
                                                        slotProps={{ textField: { variant: 'filled' } }}
                                                    />
                                                </LocalizationProvider>
                                                {errors.dayBegin && (
                                                    <FormHelperText sx={{ color: 'error.main' }}>
                                                        {errors.dayBegin.message}
                                                    </FormHelperText>
                                                )}
                                            </Fragment>
                                        )}
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <Controller
                                        name='dayEnd'
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Fragment>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        label='Đến ngày'
                                                        value={value}
                                                        maxDate={dayjs(new Date())}
                                                        onChange={onChange}
                                                        slotProps={{ textField: { variant: 'filled' } }}
                                                    />
                                                </LocalizationProvider>
                                                {errors.dayEnd && (
                                                    <FormHelperText sx={{ color: 'error.main' }}>
                                                        {errors.dayEnd.message}
                                                    </FormHelperText>
                                                )}
                                            </Fragment>
                                        )}
                                    />
                                </FormControl>
                            </div>
                            <div className='col-md-12 p-0'>
                                <div className='input-group flex '>
                                    <span className='input-group-span text-sm pr-3'>Nhân viên</span>
                                    <div className='flex flex-wrap'>
                                        {newData?.staffs?.map((item) => {
                                            return (
                                                <div key={item.id} className='pr-3'>
                                                    <input
                                                        type='checkbox'
                                                        name='staff[]'
                                                        value={item.id}
                                                        onChange={handleCheckboxChangeStaff}
                                                        id={item.id + 'staff'}
                                                    />
                                                    <label htmlFor={item.id + 'staff'}>{item.fullname}</label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-12 p-0'>
                                <div className='input-group flex '>
                                    <span className='input-group-span text-sm pr-3'>Nhóm</span>
                                    <div className='flex flex-wrap'>
                                        {newData?.productGroups?.map((item) => {
                                            return (
                                                <div key={item.id} className='pr-3'>
                                                    <input
                                                        type='checkbox'
                                                        name='group[]'
                                                        value={item.id}
                                                        onChange={handleCheckboxChangeGrProduct}
                                                        id={item.id + 'group'}
                                                    />
                                                    <label htmlFor={item.id + 'group'}>{item.group_name}</label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            <button
                                type='submit'
                                className='btn btn-primary waves-effect waves-light w-full mt-4'
                                fdprocessedid='88fg6k'
                            >
                                Báo cáo
                            </button>
                        </form>
                        <div className='pt-5'>
                            <DataGridCustom rows={rows} columns={columns} nameItem={'lương nhân viên bán hàng'} />
                        </div>
                    </div>
                </div>
            </div>
            <>{isLoading ? <Loading /> : null}</>
        </div>
    )
}
export default StaffSalary
