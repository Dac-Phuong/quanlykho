import { Fragment, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useQuery } from 'react-query'
import Loading from '../../../components/loading'
import HeaderComponents from '../../../components/header'
import { TARGET_KEY } from '../../../constants/keyQuery'
import { useGetDataListTarget } from '../../api/useFetchData'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'

import dayjs from 'dayjs'
import { FormControl, FormHelperText, MenuItem, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TARGET, TARGET_CREATE } from '../../api'
import { http } from '../../utils/http'
import { useMutationCustom } from '../../../hooks/useReactQuery'
import { toast } from 'react-toastify'

const schema = yup
    .object({
        from_date: yup
            .date()
            .test({
                name: 'from_date',
                message: 'Ngày bắt đầu không được lớn hơn ngày kết thúc',
                test: function (value) {
                    return dayjs(value).isBefore(this.parent.to_date)
                }
            })
            .required(),
        to_date: yup
            .date()
            .test({
                name: 'to_date',
                message: 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu',
                test: function (value) {
                    return dayjs(value).isAfter(this.parent.from_date)
                }
            })
            .required(),
        staff_id: yup.string().required('Nhân viên không được để trống'),
        group_product_id: yup.string().required('Nhóm hàng không được để trống'),
        target: yup
            .string()
            .required('Chỉ tiêu không được để trống')
            .test({
                name: 'hoten',
                test(value, ctx) {
                    if (!/^[0-9]+$/.test(value)) return ctx.createError({ message: 'Chỉ tiêu không đúng định dạng' })

                    return true
                }
            })
    })
    .required()

const defaultValues = {
    from_date: dayjs(new Date()).subtract(1, 'day'),
    to_date: dayjs(new Date()),
    staff_id: '',
    group_product_id: '',
    target: 0
}

export default function Target() {
    const {
        handleSubmit,
        control,
        setError,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const [newData, setNewData] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(15)
    const [selectFromDate, setSelectFromDate] = useState(dayjs(new Date()).subtract(1, 'day'))
    const [selectToDate, setSelectToDate] = useState(dayjs(new Date()))

    const { data, isLoading } = useQuery(TARGET_KEY, useGetDataListTarget(TARGET_KEY))

    const addTarget = (data) => {
        return http.post(TARGET_CREATE, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }

    const { mutate, isSuccess, isError } = useMutationCustom(addTarget, TARGET_KEY)

    const columns = [
        { field: 'id', headerName: 'STT', flex: 0.5 },
        { field: 'staff_id', headerName: 'Nhân viên', flex: 1.5 },
        { field: 'group_product_id', headerName: 'Nhóm hàng', flex: 1 },
        { field: 'target', headerName: 'Mục tiêu', flex: 1.5 },
        { field: 'from_date', headerName: 'Từ ngày', flex: 1.5 },
        { field: 'to_date', headerName: 'Đến ngày', flex: 1.5 }
    ]

    const rows = newData?.data?.map((item, index) => ({
        index: index + 1,
        id: item.id || index + 1,
        staff_id: newData?.staff.find((staff) => staff.id === item.staff_id)?.fullname,
        group_product_id: newData?.product_group.find((group) => group.id === item.group_product_id)?.group_name,
        target: item.target,
        from_date: item.from_date,
        to_date: item.to_date
    }))
    const searchTarget = async () => {
        if (selectFromDate.isAfter(selectToDate)) {
            toast.error('Ngày bắt đầu không được lớn hơn ngày kết thúc')
            return
        }
        const formData = new FormData()
        formData.append('from_date', dayjs(selectFromDate).format('DD-MM-YYYY'))
        formData.append('to_date', dayjs(selectToDate).format('DD-MM-YYYY'))

        const data = await http.post(TARGET, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (data.status === 200) {
            setNewData(data.data)
        } else {
            toast.error('Không tìm thấy chỉ tiêu')
        }
    }

    const onSubmit = (data) => {
        let bodyFormData = new FormData()
        bodyFormData.append('from_date', dayjs(data.from_date).format('YYYY-MM-DD'))
        bodyFormData.append('to_date', dayjs(data.to_date).format('YYYY-MM-DD'))
        bodyFormData.append('staff_id', data.staff_id)
        bodyFormData.append('group_product_id', data.group_product_id)
        bodyFormData.append('target', data.target)
        mutate(bodyFormData)
        if (isSuccess) {
            reset({
                from_date: dayjs(new Date()).subtract(1, 'day'),
                to_date: dayjs(new Date()),
                staff_id: '',
                group_product_id: '',
                target: '0'
            })
            toast.success('Thêm chỉ tiêu thành công')
        }
        if (isError) {
            toast.error('Thêm chỉ tiêu thất bại')
        }
    }
    useEffect(() => {
        if (data) {
            setNewData(data)
        }
    }, [data])
    useEffect(() => {
        if (isSuccess) {
            reset({
                from_date: dayjs(new Date()).subtract(1, 'day'),
                to_date: dayjs(new Date()),
                staff_id: '',
                group_product_id: '',
                target: '0'
            })
            toast.success('Thêm chỉ tiêu thành công')
        }
        if (isError) {
            toast.error('Thêm chỉ tiêu thất bại')
        }
    }, [isSuccess, isError])
    return (
        <div className='pcoded-content'>
            <div className=''>
                <Helmet>
                    <title>{'Chỉ tiêu bán'}</title>
                </Helmet>
                <HeaderComponents label={'Chỉ tiêu bán'} title={'Chỉ tiêu bán'} />

                <div className='card  m-4'>
                    <div className='card-header'>
                        <div className='card-header-left'>
                            <div className='header_title'>
                                <h5>Thông tin</h5>
                            </div>
                            <small>Chỉ tiêu bán</small>
                        </div>
                    </div>
                    <div className='card-block remove-label'>
                        <form autoComplete='off' fullWidth onSubmit={handleSubmit(onSubmit)}>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-x-3'>
                                <FormControl fullWidth>
                                    <Controller
                                        name='from_date'
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Fragment>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        label='Từ ngày'
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
                                        name='to_date'
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Fragment>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        label='Đến ngày'
                                                        value={value}
                                                        onChange={onChange}
                                                        maxDate={dayjs(new Date())}
                                                        slotProps={{ textField: { variant: 'filled' } }}
                                                    />
                                                </LocalizationProvider>
                                                {errors.to_date && (
                                                    <FormHelperText sx={{ color: 'error.main' }}>
                                                        {errors.to_date.message}
                                                    </FormHelperText>
                                                )}
                                            </Fragment>
                                        )}
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <Controller
                                        name='target'
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Fragment>
                                                <TextField
                                                    id='target'
                                                    label='Chỉ tiêu'
                                                    variant='standard'
                                                    value={value}
                                                    onChange={(e) => {
                                                        if (e.target.value === '') onChange(0)
                                                        else if (e.target.value[0] === '0') {
                                                            onChange(e.target.value.slice(1))
                                                        } else onChange(e.target.value)
                                                    }}
                                                    sx={{
                                                        '& .MuiInputBase-root': {
                                                            marginTop: '25px'
                                                        }
                                                    }}
                                                />
                                                {errors.target && (
                                                    <FormHelperText sx={{ color: 'error.main' }}>
                                                        {errors.target.message}
                                                    </FormHelperText>
                                                )}
                                            </Fragment>
                                        )}
                                    />
                                </FormControl>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='staff_id'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <Fragment>
                                                <TextField
                                                    fullWidth
                                                    select
                                                    value={value}
                                                    onChange={onChange}
                                                    label='Nhân viên'
                                                    id='standard-basic'
                                                    variant='standard'
                                                >
                                                    {data?.staff?.map((item) => (
                                                        <MenuItem key={item.id} value={item.id}>
                                                            {item.fullname}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                {errors.staff_id && (
                                                    <FormHelperText sx={{ color: 'error.main' }}>
                                                        {errors.staff_id.message}
                                                    </FormHelperText>
                                                )}
                                            </Fragment>
                                        )}
                                    />
                                </FormControl>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='group_product_id'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <Fragment>
                                                <TextField
                                                    fullWidth
                                                    select
                                                    value={value}
                                                    onChange={onChange}
                                                    label='Nhóm hàng'
                                                    id='standard-basic'
                                                    variant='standard'
                                                >
                                                    {data?.product_group?.map((item) => (
                                                        <MenuItem key={item.id} value={item.id}>
                                                            {item.group_name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                {errors.group_product_id && (
                                                    <FormHelperText sx={{ color: 'error.main' }}>
                                                        {errors.group_product_id.message}
                                                    </FormHelperText>
                                                )}
                                            </Fragment>
                                        )}
                                    />
                                </FormControl>
                            </div>
                            <button
                                type='submit'
                                className='btn btn-primary waves-effect waves-light w-full mt-4'
                                fdprocessedid='88fg6k'
                            >
                                Lưu chỉ tiêu
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className=' m-4'>
                <div className='card'>
                    <div className='card-header'>
                        <div className='card-header-left'>
                            <div className='header_title'>
                                <h5>Danh sách</h5>
                                <p>Chỉ tiêu bán</p>
                            </div>
                        </div>
                    </div>
                    <div className='card-block remove-label md:overflow-hidden overflow-x-scroll'>
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-3 pb-3.5'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label='Từ ngày'
                                    value={selectFromDate}
                                    onChange={(e) => setSelectFromDate(e)}
                                    maxDate={dayjs(new Date())}
                                    slotProps={{ textField: { variant: 'filled' } }}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label='Từ ngày'
                                    value={selectToDate}
                                    onChange={(e) => setSelectToDate(e)}
                                    maxDate={dayjs(new Date())}
                                    slotProps={{ textField: { variant: 'filled' } }}
                                />
                            </LocalizationProvider>
                            <div>
                                <button
                                    type='text'
                                    className='btn btn-primary waves-effect waves-light w-full mt-4'
                                    fdprocessedid='88fg6k'
                                    onClick={searchTarget}
                                >
                                    Tìm chỉ tiêu
                                </button>
                            </div>
                        </div>
                        <div className='body'>
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
                    </div>
                </div>
            </div>
            <>{isLoading ? <Loading /> : null}</>
        </div>
    )
}
