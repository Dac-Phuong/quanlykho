import { useEffect, useState, Fragment } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'

import { FormControl, FormHelperText, MenuItem, Select, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import dayjs from 'dayjs'

import Loading from '../../../components/loading'
import HeaderComponents from '../../../components/header'
import { useGetDataListRealSales } from '../../api/useFetchData'
import { REAL_SALES_KEY } from '../../../constants/keyQuery'
import { http } from '../../utils/http'
import { REAL_SALES } from '../../api'
import BoxInformation from '../../../components/boxInformation'
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
    dayEnd: dayjs(new Date()),
    customer: 'all',
    product: 'all'
}

const RealSales = () => {
    const [selectedStaff, setSelectedStaff] = useState([])
    const [selectGroup, setSelectGroup] = useState([])
    const [newData, setNewData] = useState([])

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

    const { data, isLoading } = useQuery(REAL_SALES_KEY, useGetDataListRealSales(REAL_SALES_KEY))

    const columns = [
        { field: 'index', headerName: 'STT', minWidth: 70, flex: 0.5 },
        { field: 'sale_date', headerName: 'Ngày bán', minWidth: 110, flex: 1 },
        { field: 'staff', headerName: 'Nhân viên', minWidth: 210, flex: 1 },
        { field: 'customer', headerName: 'Khách hàng', flex: 1 },
        { field: 'product', headerName: 'Mã hàng', flex: 1 },
        { field: 'original_sale_price', headerName: 'Đơn giá', flex: 1 },
        { field: 'quantity', headerName: 'Số lượng', minWidth: 110, flex: 1 },
        { field: 'bonus', headerName: 'KM', minWidth: 130, flex: 1 },
        { field: 'discount', headerName: 'CK', minWidth: 70, flex: 1 },
        { field: 'final_price', headerName: 'GC', minWidth: 70, flex: 1 },
        { field: 'thisTTPriceWithBN', headerName: 'Thành tiền(+KM)', minWidth: 70, flex: 1 },
        { field: 'thisTTPriceWithoutBN', headerName: 'Thành tiền', minWidth: 70, flex: 1 },
        {
            field: 'active',
            minWidth: 100,
            headerName: 'Thao tác',
            flex: 1,
            renderCell: (params) => {
                return (
                    <div>
                        <Link
                            to={`/xuat-kho/sua-don-ban-hang/${params.row.sales_id}`}
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
            original_sale_price: Number(item.original_sale_price || 0).toLocaleString('en-US'),
            quantity: Number(item.quantity || 0).toLocaleString('en-US'),
            bonus: Number(item.bonus || 0).toLocaleString('en-US'),
            discount: Number(item.discount || 0).toLocaleString('en-US'),
            final_price: Number(item.final_price || 0).toLocaleString('en-US'),
            thisTTPriceWithBN: Number(item.thisTTPriceWithBN || 0).toLocaleString('en-US'),
            thisTTPriceWithoutBN: Number(item.thisTTPriceWithoutBN || 0).toLocaleString('en-US'),
            sales_id: item.sales_id
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
        bodyFormData.append('customer_id', data.customer === 'all' ? '' : data.customer)
        bodyFormData.append('product_id', data.product === 'all' ? '' : data.product)
        const { data: newData } = await http.post(REAL_SALES, bodyFormData, {
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
                            <BoxInformation data={newData?.salesWithBN} textData={'VNĐ'} title={'Doanh số'} />
                            <BoxInformation
                                data={newData?.salesWithoutBN}
                                textData={'VNĐ'}
                                title={'Doanh số không KM'}
                                color={2}
                            />
                            <BoxInformation
                                data={data?.salesWithoutDiscount}
                                textData={'VNĐ'}
                                title={'Doanh số đã trừ CK'}
                                color={2}
                            />
                            <BoxInformation data={newData?.totalTarget} textData={'VNĐ'} title={'Chỉ tiêu'} color={1} />
                            <BoxInformation data={newData?.reachTargetPercent} textData={'%'} title={'Đạt'} color={3} />
                            <BoxInformation
                                data={newData?.totalProduct}
                                textData={''}
                                title={'Sản phẩm'}
                                color={5}
                                icon={true}
                            />
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
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='customer'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                select
                                                value={value}
                                                onChange={onChange}
                                                label='Khách hàng'
                                                id='standard-basic'
                                                variant='standard'
                                            >
                                                <MenuItem value='all'>Tất cả</MenuItem>
                                                {data?.customers.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>
                                                        {item.fullname}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </FormControl>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='product'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                fullWidth
                                                select
                                                value={value}
                                                onChange={onChange}
                                                label='Sản phẩm'
                                                id='standard-basic'
                                                variant='standard'
                                            >
                                                <MenuItem value='all'>Tất cả</MenuItem>
                                                {data?.products.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
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
                                        {newData?.product_groups?.map((item) => {
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
                            {/* <div className='col-md-12 p-0'>
                                <div className='input-group flex '>
                                    <span className='input-group-span text-sm pr-3'>Phân loại</span>
                                    <div className='flex flex-wrap'>
                                        {newData?.product_groups?.map((item) => {
                                            return (
                                                <div key={item.id} className='pr-3'>
                                                    <input
                                                        type='checkbox'
                                                        name='staff[]'
                                                        value={item.id}
                                                        onChange={handleCheckboxChangeGrProduct}
                                                        id={item.id}
                                                    />
                                                    <label htmlFor={item.id}>{item.group_name}</label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div> */}
                            <button
                                type='submit'
                                className='btn btn-primary waves-effect waves-light w-full mt-4'
                                fdprocessedid='88fg6k'
                            >
                                Lọc
                            </button>
                        </form>
                        <div className='pt-5'>
                            <DataGridCustom rows={rows} columns={columns} nameItem={'doanh số thực'} />
                        </div>
                    </div>
                </div>
            </div>
            <>{isLoading ? <Loading /> : null}</>
        </div>
    )
}
export default RealSales
