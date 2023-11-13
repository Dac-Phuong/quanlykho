import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import './style.css'
import Loading from '../../../components/loading'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { DELETE_PRODUCTS, FILTER_PRODUCTS, UPDATE_STATUS_PRODUCTS } from '../../api'
import { showToastError, showToastSuccess } from '../../utils/toastmessage'
import HeaderComponents from '../../../components/header'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { useGetDataProducts } from '../../api/useFetchData'
import { http } from '../../utils/http'

// xóa mặt hàng
const deteteItem = async (id) => {
    try {
        const response = await http.delete(DELETE_PRODUCTS + id)
        showToastSuccess('Xóa mặt hàng thành công')
        return response.data
    } catch (error) {
        showToastError('Xóa mặt hàng không thành công')
    }
}
// cập nhật lại trạng thái
const updateStatus = async (id) => {
    try {
        const response = await http.put(UPDATE_STATUS_PRODUCTS + id)
        showToastSuccess('Thay đổi trạng thái thành công')
        return response.data
    } catch (error) {
        showToastError('Thay đổi trạng thái thất bại')
    }
}

export default function ListProducts() {
    const Title = 'Danh sách sản phẩm'
    const [newdata, setNewData] = useState([])
    const [selectedIds, setSelectedIds] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(15)
    const queryKey = 'list_products'
    const queryClient = useQueryClient()
    const deleteMutation = useMutation(deteteItem)
    const { data, isLoading, isError } = useQuery(queryKey, useGetDataProducts(queryKey))
    const updateStatuss = useMutation(updateStatus)

    const handleUpdateStatus = (id) => {
        updateStatuss.mutate(id, {
            onSuccess: () => {
                queryClient.invalidateQueries(queryKey)
            }
        })
    }

    const handleDelete = (id) => {
        const isConfirmed = window.confirm('Bạn có chắn muốn xóa không?')
        if (isConfirmed) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    queryClient.invalidateQueries('list_products')
                }
            })
        }
    }

    // xử lý checked
    const handleCheckboxChange = (event) => {
        const id = event.target.id
        const isChecked = event.target.checked
        if (isChecked) {
            setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id])
        } else {
            setSelectedIds((prevSelectedIds) => prevSelectedIds.filter((selectedId) => selectedId !== id))
        }
    }

    // hàm lọc sản phẩm
    const submit = async () => {
        await http
            .post(FILTER_PRODUCTS, { id: selectedIds })
            .then((response) => {
                if (response.status === 200) {
                    setNewData(response.data.products)
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
            setNewData(data?.products)
        }
    }, [isLoading, data])

    if (isLoading) {
        return <Loading />
    }
    const columns = [
        { field: 'index', headerName: 'STT', minWidth: 70 },
        { field: 'code', headerName: 'Mã hàng', minWidth: 110 },
        { field: 'name', headerName: 'Tên mặt hàng', minWidth: 210 },
        { field: 'buy_price', headerName: 'Giá mua' },
        { field: 'sale_price', headerName: 'Giá bán' },
        { field: 'color', headerName: 'Màu sắc' },
        { field: 'guarantee', headerName: 'Bảo hành', minWidth: 90 },
        { field: 'product_groups_name', headerName: 'Nhóm', minWidth: 130 },
        { field: 'purchase_quality', headerName: 'Đã nhập', minWidth: 70 },
        { field: 'sell_quality', headerName: 'Đã bán', minWidth: 70 },
        { field: 'inventario', headerName: 'Tồn kho' },
        {
            field: 'active',
            headerName: 'Thao tác',
            minWidth: 310,
            flex: 1,
            renderCell: (params) => {
                return (
                    <div>
                        <button
                            className='btn btn-button btn-danger waves-effect waves-light'
                            fdprocessedid='k4qcck'
                            onClick={() => handleDelete(params.row.id)}
                        >
                            Xóa
                        </button>
                        <Link
                            to={`/quan-ly-kho/sua-mat-hang/${params.row.id}`}
                            className='btn btn-button btn-primary ml-2'
                        >
                            sửa
                        </Link>
                        <button
                            className={
                                params.row.active === 1
                                    ? 'btn btn-button btn-info waves-effect waves-light ml-2'
                                    : 'btn btn-button btn-success waves-effect waves-light ml-2'
                            }
                            onClick={() => handleUpdateStatus(params.row.id)}
                        >
                            {params.row.active === 1 ? 'Ngừng kinh doanh' : 'kinh doanh lại'}
                        </button>
                    </div>
                )
            }
        }
    ]
    const rows = newdata?.map((item, index) => ({
        id: item.id,
        index: ++index,
        code: item.code,
        name: item.name,
        buy_price: item.buy_price.toLocaleString('en-US'),
        sale_price: item.sale_price.toLocaleString('en-US'),
        color: item.color,
        guarantee: '0',
        product_groups_name: item.product_groups_name,
        purchase_quality: item.purchase_quality || 0,
        sell_quality: item.sell_quality || 0,
        inventario: item.purchase_quality - item.sell_quality || 0,
        active: item.active
    }))
    return (
        <section className='pcoded-content'>
            <Helmet>
                <title>{Title}</title>
            </Helmet>
            <HeaderComponents label={'Quản lý kho hàng'} title={'Danh sách hàng hoá'} />
            <div className='m-4'>
                <div className='card'>
                    <div className='card-header'>
                        <div className='card-header-left'>
                            <div className='header_title'>
                                <h5>Thông tin</h5>
                            </div>
                            <small>
                                Các mặt hàng trong kho! Thêm mặt hàng mới
                                <Link className='px-2 text-[#777] font-bold' to={'/quan-ly-kho/them-hang-moi'}>
                                    TẠI ĐÂY
                                </Link>
                            </small>
                            <small>
                                Có tất cả: -{parseFloat(Math.round(data?.totalquality)).toLocaleString('en-US') || 0}{' '}
                                tương ứng -
                                {parseFloat(Math.round(data?.totalPrice)).toLocaleString('en-US') + ' VND' || 0}
                            </small>
                        </div>
                    </div>
                    <div className='p-4 grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
                        <div className='info-box bg-amber hover-expand-effect '>
                            <div className='content'>
                                <div className='icon'>$</div>
                            </div>
                            <div className='mt-[11px] pl-3 text-[13px]'>
                                <div className='text'>Tổng số lượng mặt hàng tồn kho</div>
                                <div className='number'>
                                    {parseFloat(Math.round(-data?.totalquality || 0)).toLocaleString('en-US')}
                                </div>
                            </div>
                        </div>
                        <div className='info-box bg-green hover-expand-effect '>
                            <div className='content'>
                                <div className='icon'>$</div>
                            </div>
                            <div className='mt-[11px] pl-3 text-[13px]'>
                                <div className='text'>Tổng giá tiền hàng còn tồn trong kho</div>
                                <div className='number'>
                                    {parseFloat(Math.round(-data?.totalPrice || 0)).toLocaleString('en-US') + ' VND'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='p-4'>
                        <div className='col-md-12 p-0'>
                            <div className='input-group flex '>
                                <span className='input-group-span text-sm pr-3'>Nhóm</span>
                                <div className='flex flex-wrap'>
                                    {data?.ProductGroup?.map((item, index) => {
                                        return (
                                            <div key={item.id} className='pr-3'>
                                                <input
                                                    type='checkbox'
                                                    name='productgroup[]'
                                                    value={item.id}
                                                    // checked={selectedIds[item.id] || false}
                                                    onChange={handleCheckboxChange}
                                                    id={item.id}
                                                />
                                                <label htmlFor={item.id}>{item.group_name}</label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className='col-md-12 p-0'>
                            <div className='input-group flex '>
                                <span className='input-group-span text-sm pr-3'>Kho</span>
                                <div className='flex flex-wrap'>
                                    {data?.Warehouse?.map((item) => {
                                        return (
                                            <div key={item.id} className='pr-3'>
                                                <input
                                                    type='checkbox'
                                                    name='warehouse[]'
                                                    value={item.fullname}
                                                    id={item.fullname}
                                                />
                                                <label htmlFor={item.fullname}>{item.fullname}</label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className='form-inline'>
                            <button
                                className='btn btn-button btn-danger waves-effect waves-light w-full lg:w-[30%]'
                                fdprocessedid='svu45'
                                onClick={() => submit()}
                            >
                                Lọc
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
            </div>
        </section>
    )
}
