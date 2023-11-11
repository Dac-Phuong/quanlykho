import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import Loading from '../../../components/loading'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { UPDATE_SALES_STATUS, DELETE_SALES, GET_SALES_BILL, FILTER_SALES } from '../../api'
import { showToastError, showToastSuccess } from '../../utils/toastmessage'
import HeaderComponents from '../../../components/header'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useGetListDataSales } from '../../api/useFetchData'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { http } from '../../utils/http'
import { Autocomplete, TextField, MenuItem, Button, Menu } from '@mui/material'
import AlertDialogSales from '../../../components/modal/modal-sales'
import AlertDialogSalesBill from '../../../components/modal/modal-salesbill'

// xóa mặt hàng
const deteteItemSales = async (id) => {
    try {
        const response = await http.delete(DELETE_SALES + id)
        showToastSuccess('Xóa đơn hàng công')
        return response.data
    } catch (error) {
        showToastError('Xóa đơn hàng thành công')
    }
}

export default function ListSales() {
    const Title = 'Danh sách đơn bán'
    const queryKey = 'listsales_key'
    const queryClient = useQueryClient()
    const firstDayOfMonth = dayjs().startOf('month')
    const lastDayOfMonth = dayjs().endOf('month')
    const [from_date, setFrom_Date] = useState(dayjs(firstDayOfMonth))
    const [to_date, setTo_Date] = useState(dayjs(lastDayOfMonth))
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalRetailBillOpen, setIsModalRetailBillOpen] = useState(false)
    const [showModalSales, setShowModalSales] = useState(false)
    const [dataBill, setDataBill] = useState([])
    const [newdata, setNewData] = useState([])
    const deleteMutation = useMutation(deteteItemSales)
    const [salesId, SetSalesId] = useState(null)
    const [selectedRowId, setSelectedRowId] = useState(null)
    const [staff, setStaff] = useState(null)
    const [customer, setCustumer] = useState(null)
    const [status, setSatus] = useState(3)
    const [anchorEl, setAnchorEl] = useState(null)
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(15)
    // lấy data về
    const { data, isLoading } = useQuery(queryKey, useGetListDataSales(queryKey))

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setShowModalSales(false)
        SetSalesId(null)
    }
    const handleCloseModalRetailBill = () => {
        setIsModalRetailBillOpen(false)
        setShowModalSales(false)
        SetSalesId(null)
    }
    const handleShowModal = (id) => {
        setIsModalOpen(true)
        handleMenuClose()
        SetSalesId(id)
    }
    const handleShowModalSales = (id) => {
        setShowModalSales(true)
        handleMenuClose()
    }
    const handleMenuClick = (event, id) => {
        setAnchorEl(event.currentTarget)
        setSelectedRowId(id)
    }
    const handleMenuClose = () => {
        setAnchorEl(null)
        setSelectedRowId(null)
    }

    // update trạng thái
    const updateStatus = async (id) => {
        try {
            const response = await http.put(UPDATE_SALES_STATUS + id)
            showToastSuccess(response?.data?.message)
            return response.data
        } catch (error) {
            showToastError('Thay đổi trạng thái thất bại')
        }
    }
    // cập nhật trạng thái
    const updateStatuss = useMutation(updateStatus)
    const handleUpdateStatus = (id) => {
        handleMenuClose()
        updateStatuss.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKey })
            }
        })
    }

    // hàm xóa sales
    const handleDeleteSales = (id) => {
        handleMenuClose()
        const isConfirmed = window.confirm('Bạn có chắn muốn xóa không?')
        if (isConfirmed) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: queryKey })
                }
            })
        }
    }
    const formData = {
        from_date: dayjs(from_date).format('YYYY-MM-DD'),
        to_date: dayjs(to_date).format('YYYY-MM-DD'),
        staff_id: staff?.id,
        customer_id: customer?.id,
        status_id: status == 3 ? undefined : status
    }
    // hàm lọc bán hàng
    const submitFilter = async () => {
        await http
            .post(FILTER_SALES, formData)
            .then((response) => {
                if (response.status === 200) {
                    setNewData(response.data.filter_list)
                }
            })
            .catch((error) => {
                console.error(error.response)
            })
    }

    // hàm lấy thông tin hóa đơn
    const handleGetSalesBill = async (id) => {
        handleShowModalSales(id)
        setLoading(true)
        await http
            .post(GET_SALES_BILL + id)
            .then((response) => {
                if (response.status === 200) {
                    setLoading(false)
                    setDataBill(response.data)
                }
            })
            .catch((error) => {
                setLoading(false)
                console.error(error.response)
            })
    }

    useEffect(() => {
        if (isLoading) {
            return
        }
        if (data) {
            setNewData(data?.sales)
            setStaff(data?.staff[0])
            setCustumer(data?.customers[0])
        }
    }, [isLoading, data])

    if (isLoading) {
        return <Loading />
    }

    const columns = [
        { field: 'index', headerName: 'STT', minWidth: 70 },
        { field: 'date', headerName: 'Ngày bán', minWidth: 110, flex: 1 },
        { field: 'staff_name', headerName: 'Nhân viên', minWidth: 130, flex: 1 },
        {
            field: 'customer_name',
            headerName: 'Khách hàng',
            minWidth: 130,
            flex: 1
        },
        { field: 'warehouse_name', headerName: 'Kho xuất', minWidth: 130, flex: 1 },
        { field: 'debt', headerName: 'CKTM', minWidth: 70, flex: 1 },
        { field: 'status', headerName: 'Trạng thái', minWidth: 130, flex: 1 },
        {
            field: 'paid',
            headerName: 'Đã thanh toán',
            flex: 1,
            minWidth: 160
        },
        { field: 'total_price', headerName: 'Tổng tiền', flex: 1, minWidth: 140 },
        {
            field: 'active',
            headerName: 'Thao tác',
            minWidth: 137,
            flex: 1,
            renderCell: (params) => {
                return (
                    <div>
                        <Button
                            variant='outlined'
                            className='btn btn-button h-[34px] text-base btn-primary text-white waves-effect waves-light w-full'
                            fullWidth
                            onClick={(event) => handleMenuClick(event, params.row.id)}
                            aria-controls={`dropdown-menu-${params.row.id}`}
                            aria-haspopup='true'
                        >
                            Thao tác <ArrowDropDownIcon />
                        </Button>
                        <Menu
                            id={`dropdown-menu-${params.row.id}`}
                            anchorEl={anchorEl}
                            open={selectedRowId === params.row.id}
                            onClose={handleMenuClose}
                        >
                            <MenuItem
                                style={{ color: '#000' }}
                                component={Link}
                                to={`/xuat-kho/sua-don-ban-hang/${params?.row?.id}`}
                            >
                                Sửa
                            </MenuItem>
                            <MenuItem onClick={() => handleGetSalesBill(params.row.id)}>Xem đơn</MenuItem>
                            {params?.row?.status === 'Đã thanh toán' ? (
                                <MenuItem onClick={() => handleUpdateStatus(params.row.id)}>Hủy thanh toán</MenuItem>
                            ) : null}
                            {params?.row?.status === 'Chưa thanh toán' ? (
                                <div>
                                    <MenuItem onClick={() => handleShowModal(params.row.id)}>Trả trước</MenuItem>
                                    <MenuItem onClick={() => handleUpdateStatus(params.row.id)}>
                                        Hoàn thành đơn
                                    </MenuItem>
                                </div>
                            ) : null}
                            <MenuItem onClick={() => handleDeleteSales(params.row.id)}>Xóa đơn</MenuItem>
                        </Menu>
                    </div>
                )
            }
        }
    ]
    const rows = newdata?.map((item, index) => ({
        id: item?.id,
        index: ++index,
        date: item?.date,
        status: item?.status === 0 ? 'Chưa thanh toán' : 'Đã thanh toán',
        warehouse_name: item?.warehouse_name,
        staff_name: item?.staff_name,
        customer_name: item?.customer_name,
        debt: item?.discount + '%',
        paid:
            parseFloat(
                item?.status === 1
                    ? item?.total_price - item?.total_price * (item?.discount / 100)
                    : item?.paid_money || 0
            ).toLocaleString('en-US') + ' đồng',
        total_price:
            parseFloat(Math.round(item?.total_price - item?.total_price * (item?.discount / 100))).toLocaleString(
                'en-US'
            ) + ' đồng'
    }))
    return (
        <section className='pcoded-content'>
            <Helmet>
                <title>{Title}</title>
            </Helmet>
            <HeaderComponents label={'Quản lý bán hàng'} title={'Danh sách đơn bán'} />
            <div className='m-4'>
                <div className='card'>
                    <div className='card-header'>
                        <div className='card-header-left'>
                            <div className='header_title'>
                                <h5>Thông tin</h5>
                            </div>
                            <small>
                                Các đơn hàng đã bán! Thêm đơn hàng mới
                                <Link className='pl-2 text-[#777] font-bold' to={'/xuat-kho/ban-hang'}>
                                    TẠI ĐÂY
                                </Link>
                            </small>
                        </div>
                    </div>
                    <div className='p-4 mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
                        <div className='info-box bg-green hover-expand-effect mb-0'>
                            <div className='content'>
                                <div className='icon'>$</div>
                            </div>
                            <div className='mt-[11px] pl-3 text-[13px]'>
                                <div className='text'>Tổng doanh số</div>
                                <div className='number'>
                                    {parseFloat(Math.round(data?.totalSales || 0)).toLocaleString('en-US') + ' VNĐ'}
                                </div>
                            </div>
                        </div>
                        <div className='info-box bg-amber hover-expand-effect mb-0'>
                            <div className='content'>
                                <div className='icon'>$</div>
                            </div>
                            <div className='mt-[11px] pl-3 text-[13px]'>
                                <div className='text'>Đã thanh toán</div>
                                <div className='number'>
                                    {parseFloat(Math.round(data?.total_paids || 0)).toLocaleString('en-US') + ' VNĐ'}
                                </div>
                            </div>
                        </div>
                        <div className='info-box bg-red hover-expand-effect mb-0'>
                            <div className='content'>
                                <div className='icon'>$</div>
                            </div>
                            <div className='mt-[11px] pl-3 text-[13px]'>
                                <div className='text'>Còn nợ</div>
                                <div className='number'>
                                    {parseFloat(Math.round(data?.totalSales - data?.total_paids || 0)).toLocaleString(
                                        'en-US'
                                    ) + ' VNĐ'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='p-4'>
                        <div className='flex gap-3 max-sm:justify-normal flex-wrap justify-between'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    className='w-full md:w-[23%] xl:w-[18%] max-sm:mr-1'
                                    label='Từ ngày'
                                    value={from_date}
                                    onChange={(newValue) => setFrom_Date(newValue)}
                                    slotProps={{ textField: { variant: 'filled' } }}
                                />
                                <DatePicker
                                    className='w-full md:w-[23%] xl:w-[18%] max-sm:mr-1 '
                                    label='Đến ngày'
                                    value={to_date}
                                    onChange={(newValue) => setTo_Date(newValue)}
                                    slotProps={{ textField: { variant: 'filled' } }}
                                />
                            </LocalizationProvider>
                            <Autocomplete
                                className='mt-[11px] w-full md:w-[23%] xl:w-[18%]  max-sm:mr-1'
                                id='disable-close-on-select'
                                clearOnEscape
                                value={staff}
                                options={data && data?.staff ? data?.staff : []}
                                onChange={(event, newValue) => setStaff(newValue)}
                                getOptionLabel={(rows) => rows?.fullname || ''}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label='Chọn nhân viên'
                                        variant='standard'
                                        size='small'
                                    />
                                )}
                            />
                            <Autocomplete
                                className='w-full md:w-[23%] xl:w-[18%] mt-[11px] max-sm:mr-1 '
                                id='disable-close-on-select'
                                clearOnEscape
                                value={customer}
                                options={data && data?.customers ? data?.customers : []}
                                onChange={(event, newValue) => setCustumer(newValue)}
                                getOptionLabel={(rows) =>
                                    rows?.address ? rows?.fullname + ' - ' + rows?.address : rows?.fullname || ''
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label='Chọn khách hàng'
                                        variant='standard'
                                        size='small'
                                    />
                                )}
                            />
                            <TextField
                                className='w-full md:w-[23%] xl:w-[18%] mt-[11px] max-sm:mr-1 '
                                select
                                sx={{
                                    '&': {
                                        mt: 1
                                    }
                                }}
                                value={status}
                                onChange={(event) => setSatus(event?.target?.value)}
                                label='Chọn trạng thái'
                                id='standard-basic'
                                variant='standard'
                            >
                                <MenuItem value='3'>Tất cả</MenuItem>
                                <MenuItem value='0'>Chưa thanh toán</MenuItem>
                                <MenuItem value='1'>Đã thanh toán </MenuItem>
                            </TextField>
                        </div>
                        <div className='form-inline max-sm:mt-5 max-sm:w-full mt-10 w-[32%]'>
                            <button
                                className='btn btn-button btn-danger waves-effect waves-light w-full'
                                type='submit'
                                onClick={() => submitFilter()}
                            >
                                Lọc đơn hàng
                            </button>
                        </div>
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
                    </div>
                </div>
                <AlertDialogSales
                    handleCloseModal={handleCloseModal}
                    isModalOpen={isModalOpen}
                    isLoadings={isLoading}
                    salesId={salesId}
                />
                <AlertDialogSalesBill
                    handleCloseModal={handleCloseModal}
                    isModalOpen={showModalSales}
                    setIsModalOpen={setShowModalSales}
                    isModalRetailBillOpen={isModalRetailBillOpen}
                    handleCloseModalRetailBill={handleCloseModalRetailBill}
                    setIsModalRetailBillOpen={setIsModalRetailBillOpen}
                    loading={loading}
                    dataBill={dataBill}
                />
            </div>
        </section>
    )
}
