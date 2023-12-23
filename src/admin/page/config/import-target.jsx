import { Fragment, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useQuery } from 'react-query'
import Loading from '../../../components/loading'
import HeaderComponents from '../../../components/header'
import { IMPORT_TARGET_KEY } from '../../../constants/keyQuery'
import { useGetDataListImportTarget } from '../../api/useFetchData'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'

import dayjs from 'dayjs'
import { FormControl, FormHelperText, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { IMPORT_TARGET_CREATE } from '../../api'
import { http } from '../../utils/http'
import { useMutationCustom } from '../../../hooks/useReactQuery'
import DataGridCustom from '../../../components/dataGridCustom'
import { showToastError, showToastSuccess } from '../../utils/toastmessage'

const schema = yup
    .object({
        day: yup.date().required(),
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
    day: dayjs(new Date()),
    target: 0
}

export default function ImportTarget() {
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

    const [newData, setNewData] = useState([])

    const { data, isLoading } = useQuery(IMPORT_TARGET_KEY, useGetDataListImportTarget(IMPORT_TARGET_KEY))

    const addTargetPurchase = (data) => {
        return http.post(IMPORT_TARGET_CREATE, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }

    const { mutate, isError, isSuccess } = useMutationCustom(addTargetPurchase, IMPORT_TARGET_KEY)

    const columns = [
        { field: 'id', headerName: 'STT', flex: 0.5 },
        { field: 'date', headerName: 'Ngày', flex: 1, minWidth: 100 },
        { field: 'target', headerName: 'Mục tiêu', flex: 1.5, minWidth: 100 }
    ]

    const rows =
        newData?.data?.map((item, index) => ({
            index: index + 1,
            id: item.id || index + 1,
            date: item.date,
            target: item.target
        })) || []

    const onSubmit = async (data) => {
        let bodyFormData = new FormData()
        bodyFormData.append('date', dayjs(data.day).format('YYYY-MM-DD'))
        bodyFormData.append('target', data.target)
        mutate(bodyFormData)
    }
    useEffect(() => {
        if (data) {
            setNewData(data)
        }
    }, [data])
    useEffect(() => {
        if (isSuccess) {
            reset({
                day: dayjs(new Date()),
                target: 0
            })
            showToastSuccess('Thêm chỉ tiêu thành công')
        }
        if (isError) {
            showToastError('Thêm chỉ tiêu thất bại')
        }
    }, [isSuccess, isError, reset])
    return (
        <div className='pcoded-content'>
            <div className=''>
                <Helmet>
                    <title>{'Chỉ tiêu nhập'}</title>
                </Helmet>
                <HeaderComponents label={'Chỉ tiêu nhập'} title={'Chỉ tiêu nhập'} />

                <div className='card  m-4'>
                    <div className='card-header'>
                        <div className='card-header-left'>
                            <div className='header_title'>
                                <h5>Thông tin</h5>
                            </div>
                            <small>Chỉ tiêu nhập</small>
                        </div>
                    </div>
                    <div className='card-block remove-label'>
                        <form autoComplete='off' fullWidth onSubmit={handleSubmit(onSubmit)}>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-3'>
                                <FormControl fullWidth>
                                    <Controller
                                        name='day'
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Fragment>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        label='Ngày'
                                                        value={value}
                                                        onChange={onChange}
                                                        maxDate={dayjs(new Date())}
                                                        slotProps={{ textField: { variant: 'filled' } }}
                                                    />
                                                </LocalizationProvider>
                                                {errors.day && (
                                                    <FormHelperText sx={{ color: 'error.main' }}>
                                                        {errors.day.message}
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
                                <h5>Chỉ tiêu nhập</h5>
                            </div>
                        </div>
                    </div>
                    <div className='card-block remove-label md:overflow-hidden overflow-x-scroll'>
                        <DataGridCustom rows={rows} columns={columns} nameItem={'chỉ tiêu nhập'} />
                    </div>
                </div>
            </div>
            <>{isLoading ? <Loading /> : null}</>
        </div>
    )
}
