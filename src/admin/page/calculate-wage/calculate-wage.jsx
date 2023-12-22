import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import Loading from '../../../components/loading'
import HeaderComponents from '../../../components/header'
import { useGetDataGroup } from '../../api/useFetchData'
import DataGridCustom from '../../../components/dataGridCustom'

// hàm xóa nhóm phẩm
export default function CalculateWage() {
    const [newData, setNewData] = React.useState([])

    const Title = 'Danh sách nhóm hàng'
    const queryKey = 'productgroup_key'
    const { data, isLoading, error } = useGetDataGroup(queryKey)
    useEffect(() => {
        setNewData(data)
    }, [data])
    if (isLoading) {
        return <Loading />
    }
    const columns = [
        { field: 'index', headerName: 'STT', minWidth: 70, flex: 1 },
        { field: 'group_name', headerName: 'Nhóm hàng', minWidth: 110, flex: 1 },
        { field: 'commission', headerName: 'Lương', minWidth: 70, flex: 1 }
    ]
    const rows =
        newData?.data?.map((item, index) => ({
            id: item.id,
            index: ++index,
            group_name: item.group_name,
            commission: Number(item.commission || 0).toLocaleString('en-US')
        })) || []

    return (
        <div className='pcoded-content'>
            <Helmet>
                <title>{Title}</title>
            </Helmet>
            <HeaderComponents label={'Quản lý nhóm hàng'} title={'Danh sách bảng tính lương'} />
            <div className='card m-4'>
                <div className='card-header'>
                    <div className='card-header-left'>
                        <div className='header_title'>
                            <h5>Thông tin</h5>
                        </div>
                        <small>Bảng tính lương</small>
                    </div>
                </div>
                <div className='p-4'>
                    <DataGridCustom rows={rows} columns={columns} nameItem={'báo cáo chiết khấu'} />
                </div>
            </div>
        </div>
    )
}
