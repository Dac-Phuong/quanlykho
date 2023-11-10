import { useEffect } from 'react'
import { Helmet } from 'react-helmet'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import FormControl from '@mui/material/FormControl'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'

import HeaderComponents from '../../../components/header'
import Loading from '../../../components/loading'
import { useQuery } from 'react-query'
import { useGetDataListWareHouse } from '../../api/useFetchData'
import { WAREHOUSE_TRANSFER_KEY } from '../../../services/constants/keyQuery'
import dayjs from 'dayjs'
import { MenuItem, TextField } from '@mui/material'
import { showToastError } from '../../utils/toastmessage'
import { maxSizeInBytes } from '../../../services/constants'

const schema = yup
    .object({
        date: yup.date().required('Vui lòng chọn ngày chuyển kho'),
        warehoseBegin: yup.string().required('Vui lòng chọn kho xuất'),
        warehoseEnd: yup.string().required('Vui lòng chọn kho nhập')
    })
    .shape({
        file: yup.mixed()
    })
    .required()

const defaultValues = {
    date: dayjs(new Date()),
    warehoseBegin: '',
    warehoseEnd: '',
    file: null
}

const WarehouseTransfer = () => {
    const {
        handleSubmit,
        setValue,
        control,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const { data, isLoading } = useQuery(WAREHOUSE_TRANSFER_KEY, useGetDataListWareHouse(WAREHOUSE_TRANSFER_KEY))

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
                setValue('file', file)
            } else {
                showToastError('Vui lòng chọn một tệp Excel hoặc CSV có đuôi (.xls or .xlsx or .csv)')
                event.target.value = null
            }
        }
    }

    const onSubmit = (data) => {
        if (data.warehoseBegin === data.warehoseEnd) {
            showToastError('Kho xuất và kho nhập không được trùng nhau')
        }
        // post data to api
    }

    useEffect(() => {
        if (data?.data?.length > 0) {
            setValue('warehoseBegin', data?.data[0].id)
            setValue('warehoseEnd', data?.data[0].id)
        }
    }, [data, setValue])

    return (
        <section className='pcoded-content'>
            <Helmet>
                <title>{'Chuyển kho'}</title>
            </Helmet>
            <HeaderComponents label={'Quản lý kho hàng'} title={'Chuyển kho'} />
            <div className='card m-4'>
                <div className='card-header'>
                    <div className='card-header-left'>
                        <div className='header_title'>
                            <h5>Chuyển kho</h5>
                        </div>
                    </div>
                </div>
                <div className='card-block remove-label'>
                    <form autoComplete='off' fullWidth onSubmit={handleSubmit(onSubmit)}>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3'>
                            <FormControl fullWidth>
                                <Controller
                                    name='date'
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label='Ngày chuyển kho'
                                                value={value}
                                                onChange={onChange}
                                                slotProps={{ textField: { variant: 'filled' } }}
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <Controller
                                    name='warehoseBegin'
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label='Kho xuất'
                                            id='filled-basic'
                                            variant='filled'
                                            sx={{
                                                '& .MuiFilledInput-input': {
                                                    paddingLeft: 0
                                                }
                                            }}
                                            error={errors.warehoseBegin ? true : false}
                                            helperText={errors.warehoseBegin?.message}
                                        >
                                            {data?.data?.map((item, index) => {
                                                return (
                                                    <MenuItem key={item.id} value={item.id}>
                                                        {item.fullname}
                                                    </MenuItem>
                                                )
                                            })}
                                        </TextField>
                                    )}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <Controller
                                    name='warehoseEnd'
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label='Kho nhập'
                                            id='filled-basic'
                                            variant='filled'
                                            sx={{
                                                '& .MuiFilledInput-input': {
                                                    paddingLeft: 0
                                                }
                                            }}
                                            error={errors.warehoseEnd ? true : false}
                                            helperText={errors.warehoseEnd?.message}
                                        >
                                            {data?.data?.map((item, index) => {
                                                return (
                                                    <MenuItem key={item.id} value={item.id}>
                                                        {item.fullname}
                                                    </MenuItem>
                                                )
                                            })}
                                        </TextField>
                                    )}
                                />
                            </FormControl>
                        </div>
                        <FormControl fullWidth>
                            <Controller
                                name='file'
                                control={control}
                                render={() => (
                                    <input
                                        type='file'
                                        onChange={handleFileSelect}
                                        className='px-3 py-2 border border-solid w-full md:w-1/2'
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <button
                                type='submit'
                                className='btn btn-primary waves-effect waves-light  w-full'
                                fdprocessedid='88fg6k'
                            >
                                Chuyển kho
                            </button>
                        </FormControl>
                    </form>
                </div>
            </div>
            <>{isLoading ? <Loading /> : null} </>
        </section>
    )
}

export default WarehouseTransfer
