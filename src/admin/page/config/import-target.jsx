import { Fragment, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useQueryClient, useMutation, useQuery } from 'react-query'
import Loading from '../../../components/loading'
import HeaderComponents from '../../../components/header'
import { IMPORT_TARGET_KEY } from '../../../services/constants/keyQuery'
import { useGetDataListImportTarget } from '../../api/useFetchData'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'

import dayjs from 'dayjs'
import { FormControl, FormHelperText, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const schema = yup
    .object({
        day: yup.date().required(),
        target: yup
            .string()
            .required('Chỉ tiêu không được để trống')
            .test({
                name: 'hoten',
                test(value, ctx) {
                    if (/[-!#$%^*()/+":;{[\]}'\.,<>=~`?@&_\\|]/.test(value))
                        return ctx.createError({ message: 'Chỉ tiêu không đúng định dạng' })

                    return true
                }
            })
    })
    .required()

const defaultValues = {
    day: dayjs(new Date()),
    target: ''
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

    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(15)

    const { data, isLoading } = useQuery(IMPORT_TARGET_KEY, useGetDataListImportTarget(IMPORT_TARGET_KEY))

    const columns = [
        { field: 'id', headerName: 'STT', flex: 0.5 },
        { field: 'date', headerName: 'Ngày', flex: 1 },
        { field: 'target', headerName: 'Mục tiêu', flex: 1.5 }
    ]

    const rows = data?.data.map((item, index) => ({
        index: index + 1,
        id: item.id || index + 1,
        date: item.date,
        target: item.target
    }))

    const onSubmit = (data) => {
        console.log(data)
    }

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
                                                    onChange={onChange}
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
