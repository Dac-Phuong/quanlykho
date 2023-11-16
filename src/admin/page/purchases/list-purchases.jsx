import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import Loading from '../../../components/loading'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { DELETE_PURCHASES, FILTER_PURCHASES, GET_PURCHASES_DETAIL } from '../../api'
import { showToastError, showToastSuccess } from '../../utils/toastmessage'
import HeaderComponents from '../../../components/header'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import AlertDialogPurchase from '../../../components/modal/modal-purchase'
import { useGetDataListPurchase } from '../../api/useFetchData'
import { http } from '../../utils/http'
import DataGridCustom from '../../../components/dataGridCustom'

// xóa mặt hàng
const deteteItemPurchases = async (id) => {
    try {
        const response = await http.delete(DELETE_PURCHASES + id)
        showToastSuccess('Xóa đơn hàng công')
        return response.data
    } catch (error) {
        showToastError('Xóa đơn hàng thành công')
    }
}

export default function ListParchases() {
    const Title = 'Danh sách đơn nhập'
    const [newdata, setNewData] = useState([])
    const firstDayOfMonth = dayjs().startOf('month')
    const lastDayOfMonth = dayjs().endOf('month')
    const [from_date, setFrom_Date] = useState(dayjs(firstDayOfMonth))
    const [to_date, setTo_Date] = useState(dayjs(lastDayOfMonth))
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(15)
    const queryClient = useQueryClient()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const deleteMutation = useMutation(deteteItemPurchases)
    const [newId, setNewId] = useState(null)
    const queryKey = 'list_purchases'
    const purchaseDetail = async (newId) => {
        const response = await http.get(GET_PURCHASES_DETAIL + newId)
        return response.data
    }
    // lấy data về
    const { data, isLoading } = useQuery(queryKey, useGetDataListPurchase(queryKey))
    const {
        data: purchases_detail,
        isLoading: isLoadings,
        isError: isErrors
    } = useQuery(['purchases_detail', newId], () => purchaseDetail(newId), {
        enabled: !!newId
    })
    const handleCloseModal = () => {
        setIsModalOpen(false)
    }
    // hàm xóa purchases
    const handleDeletePurchases = (id) => {
        const isConfirmed = window.confirm('Bạn có chắn muốn xóa không?')
        if (isConfirmed) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: queryKey })
                }
            })
        }
    }
    // hàm lọc bán hàng
    const submitFilter = async () => {
        await http
            .post(FILTER_PURCHASES, {
                from_date,
                to_date
            })
            .then((response) => {
                if (response.status === 200) {
                    setNewData(response.data.list_item)
                }
            })
            .catch((error) => {
                console.error(error.response)
            })
    }

    useEffect(() => {
        if (isLoading) {
            return
        }
        if (data) {
            setNewData(data?.purchases)
        }
    }, [isLoading, data])

    if (isLoading) {
        return <Loading />
    }
    const columns = [
        { field: 'index', headerName: 'STT', minWidth: 70 },
        { field: 'date', headerName: 'Ngày nhập', minWidth: 110, flex: 1 },
        { field: 'status', headerName: 'Trạng thái', minWidth: 130 },
        { field: 'note', headerName: 'Mô tả', flex: 1, minWidth: 130 },
        { field: 'warehouse_name', headerName: 'Kho nhập', flex: 1, minWidth: 140 },
        {
            field: 'total_quality',
            headerName: 'Tổng số hàng',
            flex: 1,
            minWidth: 160
        },
        { field: 'total_price', headerName: 'Tổng tiền', flex: 1, minWidth: 140 },
        {
            field: 'active',
            headerName: 'Thao tác',
            minWidth: 215,
            flex: 1,
            renderCell: (params) => {
                return (
                    <div>
                        <button
                            className='btn btn-button btn-danger waves-effect waves-light'
                            fdprocessedid='k4qcck'
                            onClick={() => handleDeletePurchases(params?.row?.id)}
                        >
                            Xóa
                        </button>
                        <Link
                            to={`/nhap-kho/sua-don-nhap-hang/${params?.row?.id}`}
                            className='btn btn-button btn-primary ml-2'
                        >
                            sửa
                        </Link>
                        <button
                            className='btn btn-button btn-info waves-effect waves-light ml-2'
                            onClick={() => {
                                setNewId(params?.row?.id)
                                setIsModalOpen(true)
                            }}
                        >
                            Xem
                        </button>
                    </div>
                )
            }
        }
    ]
    const rows =
        newdata?.map((item, index) => ({
            id: item?.id,
            index: ++index,
            date: item?.date,
            status: item?.status === 0 ? 'Chưa nhận hàng' : 'Đã nhận hàng',
            note: item?.note,
            warehouse_name: item?.warehouse_name,
            total_quality: parseFloat(item?.total_quality || 0).toLocaleString('en-US'),
            total_price: parseFloat(Math.round(item?.total_price || 0)).toLocaleString('en-US') + ' đồng'
        })) || []

    return (
        <section className='pcoded-content'>
            <Helmet>
                <title>{Title}</title>
            </Helmet>
            <HeaderComponents label={'Quản lý bán hàng'} title={'Danh sách đơn nhập'} />
            <div className='m-4'>
                <div className='card'>
                    <div className='card-header'>
                        <div className='card-header-left'>
                            <div className='header_title'>
                                <h5>Thông tin</h5>
                            </div>
                            <small>
                                Các đơn hàng đã nhập! Thêm đơn hàng mới
                                <Link className='pl-2 text-[#777] font-bold' to={'/nhap-kho/nhap-hang'}>
                                    TẠI ĐÂY
                                </Link>
                            </small>
                        </div>
                    </div>
                    <div className='p-4 mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-3'>
                        <div className='info-box bg-green hover-expand-effect'>
                            <div className='content'>
                                <div className='icon'>$</div>
                            </div>
                            <div className='mt-[11px] pl-3 text-[13px]'>
                                <div className='text'>Tổng số tiền nhập</div>
                                <div className='number'>
                                    {parseFloat(Math.round(data?.totalPrice || 0)).toLocaleString('en-US') + ' VNĐ'}
                                </div>
                            </div>
                        </div>
                        <div className='info-box bg-amber hover-expand-effect'>
                            <div className='content'>
                                <div className='icon'>$</div>
                            </div>
                            <div className='mt-[11px] pl-3 text-[13px]'>
                                <div className='text'>Chỉ tiêu</div>
                                <div className='number'>0</div>
                            </div>
                        </div>
                        <div className='info-box bg-red hover-expand-effect'>
                            <div className='content'>
                                <div className='icon'>$</div>
                            </div>
                            <div className='mt-[11px] pl-3 text-[13px]'>
                                <div className='text'>Hoàn thành</div>
                                <div className='number'>0%</div>
                            </div>
                        </div>
                    </div>
                    <div className='p-4'>
                        <div className='flex justify-between max-sm:justify-normal flex-wrap '>
                            <LocalizationProvider className='flex flex-nowrap w-[100%]' dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    className='w-[32%] max-sm:w-[48%] mr-2 max-sm:mr-1'
                                    label='Ngày bắt đầu'
                                    value={from_date}
                                    onChange={(newValue) => setFrom_Date(newValue)}
                                    slotProps={{ textField: { variant: 'filled' } }}
                                />
                                <DatePicker
                                    className='w-[32%] max-sm:w-[48%]'
                                    label='Ngày kết thúc'
                                    value={to_date}
                                    onChange={(newValue) => setTo_Date(newValue)}
                                    slotProps={{ textField: { variant: 'filled' } }}
                                />
                            </LocalizationProvider>
                            <div className='form-inline max-sm:mt-5 max-sm:w-full w-[32%]'>
                                <button
                                    className='btn btn-button btn-danger waves-effect waves-light w-full'
                                    type='submit'
                                    fdprocessedid='88fg6k'
                                    onClick={() => submitFilter()}
                                >
                                    Tìm Chiết khấu
                                </button>
                            </div>
                        </div>
                        <div className='pt-5'>
                            <DataGridCustom rows={rows} columns={columns} nameItem={'đơn nhập'} />
                        </div>
                    </div>
                </div>
                <AlertDialogPurchase
                    handleCloseModal={handleCloseModal}
                    isModalOpen={isModalOpen}
                    purchasesDetail={purchases_detail}
                    isLoadings={isLoadings}
                />
            </div>
        </section>
    )
}
