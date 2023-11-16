import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { BsFillCartPlusFill } from 'react-icons/bs'
import { useQuery } from 'react-query'
import { useGetDataHome } from '../admin/api/useFetchData'
import HeaderComponents from '../components/header'
import BoxInformation from '../components/boxInformation'

export default function Home() {
    const Title = 'Quản lý kho'
    const queryKey = 'home_key'
    const { data, error, isLoading } = useQuery(queryKey, useGetDataHome(queryKey))

    return (
        <div className='pcoded-main-container'>
            <Helmet>
                <title>{Title}</title>
            </Helmet>
            <div className='pcoded-wrapper'>
                <div className='pcoded-content'>
                    {/* Page-header start */}
                    <HeaderComponents title={'Trang chủ'} label={'Bảng điều khiển'} />
                    {/* Page-header end */}
                    <div className='pcoded-inner-content'>
                        <div className='main-body'>
                            <div className='page-wrapper'>
                                <div className='page-body'>
                                    <div className='row'>
                                        <div className='col-xl-3 col-md-6'>
                                            <BoxInformation
                                                data={data?.totalSales}
                                                textData='VNĐ'
                                                title='Doanh số tháng (cả hàng ngoài)'
                                                color={1}
                                            />
                                        </div>
                                        <div className='col-xl-3 col-md-6'>
                                            <BoxInformation
                                                data={data?.totalOrder}
                                                textData={'Đơn'}
                                                title='Đơn hàng trong tháng'
                                                icon={true}
                                            />
                                        </div>
                                        <div className='col-xl-3 col-md-6'>
                                            <BoxInformation textData='VNĐ' title='Doanh số tháng (Sopoka)' color={5} />
                                        </div>
                                        <div className='col-xl-3 col-md-6'>
                                            <BoxInformation
                                                data={data?.totalPrice}
                                                textData='VNĐ'
                                                title='Tổng số tiền nhập trong tháng'
                                                color={4}
                                            />
                                        </div>
                                        <div className='col-xl-3 col-md-6'>
                                            <BoxInformation
                                                data={data?.totalStaffDebt}
                                                textData='VNĐ'
                                                title='Công nợ nhân viên'
                                                color={3}
                                            />
                                        </div>
                                        <div className='col-xl-3 col-md-6'>
                                            <BoxInformation
                                                data={data?.totalCustomerDebt}
                                                textData='VNĐ'
                                                title='Công nợ khách hàng'
                                                color={2}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
