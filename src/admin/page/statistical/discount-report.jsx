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
import { useGetDataListDiscountReport } from '../../api/useFetchData'
import { DISCOUNT_REPORT_KEY } from '../../../services/constants/keyQuery'
import { http } from '../../utils/http'
import { DISCOUNT_REPORT } from '../../api'
import BoxInformation from '../../../components/boxInformation'
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

const DiscountReport = () => {
    const [selectedIds, setSelectedIds] = useState([])
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

    const { data, isLoading } = useQuery(DISCOUNT_REPORT_KEY, useGetDataListDiscountReport(DISCOUNT_REPORT_KEY))

    const columns = [
        { field: 'index', headerName: 'STT', minWidth: 70, flex: 0.5 },
        { field: 'day_sell', headerName: 'Ngày bán', minWidth: 110, flex: 1 },
        { field: 'staff', headerName: 'Nhân viên', minWidth: 210, flex: 1 },
        { field: 'customer', headerName: 'Khách hàng', flex: 1 },
        { field: 'price', headerName: 'Đơn giá gốc', flex: 1 },
        { field: 'quantity', headerName: 'Số lượng', flex: 1 },
        { field: 'cpn_discount', headerName: 'CK Cty', minWidth: 110, flex: 1 },
        { field: 'cpn_discount_price', headerName: 'Giá CK Cty', minWidth: 130, flex: 1 },
        { field: 'real_discount', headerName: 'CK thực', minWidth: 70, flex: 1 },
        { field: 'real_discount_price', headerName: 'Giá CK thực', minWidth: 70, flex: 1 },
        { field: 'disparity', headerName: 'Chênh lệch', minWidth: 70, flex: 1 },
        {
            field: 'active',
            headerName: 'Thao tác',
            minWidth: 100,
            flex: 1,
            renderCell: (params) => {
                return (
                    <div>
                        <Link
                            to={`/quan-ly-kho/sua-mat-hang/${params.row.id}`}
                            className='btn btn-button btn-primary ml-2'
                        >
                            sửa
                        </Link>
                    </div>
                )
            }
        }
    ]

    const rows = data?.data.map((item, index) => ({
        index: index + 1,
        id: index + 1,
        day_sell: item.sale_date,
        staff: item.staff,
        customer: item.customer,
        price: item.buy_price,
        quantity: item.quantity,
        cpn_discount: item.cpn_discount,
        cpn_discount_price: item.cpn_discount_price,
        real_discount: item.real_discount,
        real_discount_price: item.real_discount_price,
        disparity: item.disparity
    }))

    const onSubmit = async (data) => {
        let bodyFormData = new FormData()
        bodyFormData.append('dayBegin', data.dayBegin)
        bodyFormData.append('dayEnd', data.dayEnd)
        bodyFormData.append('staff', selectedIds)
        const { data: newData } = await http.post(DISCOUNT_REPORT, bodyFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        reset(newData)
    }
    const handleCheckboxChange = (event) => {
        const id = event.target.id
        const isChecked = event.target.checked
        if (isChecked) {
            setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id])
        } else {
            setSelectedIds((prevSelectedIds) => prevSelectedIds.filter((selectedId) => selectedId !== id))
        }
    }
    return (
        <div className='pcoded-content'>
            <div className=''>
                <Helmet>
                    <title>{'Báo cáo chiết khấu'}</title>
                </Helmet>
                <HeaderComponents label={'Thống kê'} title={'Báo cáo chiết khấu'} />
                <div className='card m-4'>
                    <div className='card-header'>
                        <div className='card-header-left'>
                            <div className='header_title'>
                                <h5>Báo cáo chiết khấu</h5>
                            </div>
                        </div>
                    </div>
                    <div className='card-block remove-label'>
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
                                    <span className='input-group-span min-w-[38px] text-sm'>Nhân viên</span>
                                    <div className='flex flex-wrap'>
                                        {data?.staffs.map((item) => {
                                            return (
                                                <div key={item.id} className='pr-3'>
                                                    <input
                                                        type='checkbox'
                                                        name='staff[]'
                                                        value={item.id}
                                                        onChange={handleCheckboxChange}
                                                        id={item.id}
                                                    />
                                                    <label htmlFor={item.id}>{item.fullname}</label>
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
                        <div className='w-full pt-4'>
                            <DataGrid
                                rows={rows || []}
                                disableColumnFilter
                                disableColumnSelector
                                disableDensitySelector
                                showCellVerticalBorder
                                showColumnVerticalBorder
                                autoHeight
                                page={page}
                                pageSize={pageSize}
                                onPageChange={(page) => {
                                    setPage(page)
                                }}
                                rowsPerPageOptions={[5, 15, 30, 50]}
                                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                columns={columns}
                                slots={{ toolbar: GridToolbar }}
                                slotProps={{
                                    toolbar: {
                                        showQuickFilter: true
                                    }
                                }}
                            />
                        </div>
                        <div className='w-full md:w-1/3'>
                            <BoxInformation data={data?.totalDisparity} textData={'VNĐ'} title={'Chênh lệch'} />
                        </div>
                    </div>
                </div>
            </div>
            <>{isLoading ? <Loading /> : null}</>
        </div>
    )
}
export default DiscountReport
