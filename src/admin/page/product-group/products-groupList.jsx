import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { DELETE_PRODUCT_GROUP } from '../../api'
import Loading from '../../../components/loading'
import { showToastError, showToastSuccess } from '../../utils/toastmessage'
import { useQueryClient } from 'react-query'
import HeaderComponents from '../../../components/header'
import { useGetDataGroup } from '../../api/useFetchData'
import { http } from '../../utils/http'

// hàm xóa nhóm phẩm
export default function ProductGroupList() {
    const Title = 'Danh sách nhóm hàng'
    const queryClient = useQueryClient()
    const queryKey = 'productgroup_key'
    const { data, isLoading, error } = useGetDataGroup(queryKey)

    // hàm xóa nhóm phẩm
    const handleDelete = async (id) => {
        const isConfirmed = window.confirm('Bạn có chắn muốn xóa không?')
        if (isConfirmed) {
            try {
                const response = await http.delete(DELETE_PRODUCT_GROUP + id)
                showToastSuccess('Xóa nhóm hàng thành công')
                queryClient.invalidateQueries({ queryKey: ['productgroup_key'] })
                return response.data
            } catch (error) {
                showToastError('Xóa nhóm hàng không thành công')
            }
        }
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className='pcoded-content'>
            <Helmet>
                <title>{Title}</title>
            </Helmet>
            <HeaderComponents label={'Quản lý nhóm hàng'} title={'Danh sách nhóm hàng'} />
            <div className='card m-4 overflow-x-scroll xl:overflow-x-hidden'>
                <div className='card-header'>
                    <div className='card-header-left'>
                        <div className='header_title'>
                            <h5>Thông tin</h5>
                        </div>
                        <small>
                            Các nhóm hàng trong kho! Thêm nhóm hàng
                            <Link className='pl-2 text-xs text-[#777] font-bold' to={'/nhom-hang/them-nhom-hang'}>
                                TẠI ĐÂY!
                            </Link>
                        </small>
                    </div>
                </div>
                <div className=' card-block remove-label'>
                    <table className='table table-bordered table-striped table-hover dataTable js-exportable'>
                        <thead className='text-left'>
                            <tr>
                                <th>STT</th>
                                <th>Mã nhóm</th>
                                <th>Tên nhóm</th>
                                <th>Mô tả</th>
                                <th>Cách tính</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className='text-left'>
                            {data?.data?.map((item, index) => {
                                return (
                                    <tr key={item.id} className=''>
                                        <th>{++index}</th>
                                        <th>{item.group_code}</th>
                                        <th>{item.group_name}</th>
                                        <th>{item.description}</th>
                                        {item.commission_type === 0 ? (
                                            <th>{item.commission_type}%</th>
                                        ) : (
                                            <th>
                                                {item.commission}/{item.commission_target} đơn vị(mét, cái, sản phẩm)
                                            </th>
                                        )}
                                        <th>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className='btn btn-button btn-danger waves-effect waves-light'
                                                fdprocessedid='k4qcck'
                                            >
                                                xóa
                                            </button>
                                            <Link
                                                to={`/nhom-hang/sua-nhom-hang/${item.id}`}
                                                className='btn btn-button btn-primary ml-2'
                                            >
                                                sửa
                                            </Link>
                                        </th>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
