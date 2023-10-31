import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { getUserData } from './admin/utils/function'
import UpdateProductGroup from './admin/page/product-group/update-productGroup'
import ProductGroupList from './admin/page/product-group/products-groupList'
import AddProductGroup from './admin/page/product-group/add-productGroup'
import ImportPurchase from './admin/page/purchases/import-purchaseExcel'
import UpdateWareHouse from './admin/page/warehouse/UpdateWareHouse'
import UpdatePurchase from './admin/page/purchases/update-purchase'
import CreatePurchase from './admin/page/purchases/create-purchase'
import ListCustomers from './admin/page/customer/create-customers'
import CreateProduct from './admin/page/products/create-products'
import UpdateProduct from './admin/page/products/update-products'
import ListParchases from './admin/page/purchases/list-purchases'
import UpdateLcation from './admin/page/location/update-location'
import CreateLcation from './admin/page/location/create-location'
import ListWareHouse from './admin/page/warehouse/ListWareHouse'
import ListProducts from './admin/page/products/list-products'
import ListDiscount from './admin/page/discount/list-discount'
import UpdateSales from './admin/page/sales/update-purchase'
import CreateSales from './admin/page/sales/create-sales'
import UpdateStaff from './admin/page/staff/update-staff'
import ListSales from './admin/page/sales/list-sales'
import ListStaff from './admin/page/staff/list-staff'
import Login from './admin/page/auth/Login'
import Header from './layouts/Header'
import Home from './layouts/Home'
import Sidebar from './layouts/Sidebar'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import OrderCustomer from './admin/page/customer/order-customer'
import ListproductOrder from './admin/page/customer/list-productOrder'
import CalculateWage from './admin/page/calculate-wage/calculate-wage'
import Page404 from './admin/page/404'
import ImportSales from './admin/page/sales/import-SalesExcel'
import ImportCustomers from './admin/page/customer/import-CustomerExcel'

function App() {
    const navigate = useNavigate()
    useEffect(() => {
        const getData = () => {
            const userData = getUserData()
            if (userData?.token == null) {
                navigate('/login')
            }
        }
        getData()
    }, [])

    return (
        <>
            <Routes>
                <Route index path='/login' element={<Login />} />
                <Route
                    path='*'
                    element={
                        <>
                            <div id='pcoded' className='pcoded'>
                                <div className='pcoded-overlay-box' />
                                <div className='pcoded-container navbar-wrapper'>
                                    <Header />
                                    <Sidebar />
                                    <div className='pcoded-main-container'>
                                        <div className='pcoded-wrapper'>
                                            <Routes>
                                                <Route index path='/' element={<Home />} />
                                                <Route path='/nhom-hang/them-nhom-hang' element={<AddProductGroup />} />
                                                <Route
                                                    path='/nhom-hang/danh-sach-nhom-hang'
                                                    element={<ProductGroupList />}
                                                />
                                                <Route
                                                    path='/nhom-hang/sua-nhom-hang/:id'
                                                    element={<UpdateProductGroup />}
                                                />
                                                <Route path='/quan-ly-kho/them-hang-moi' element={<CreateProduct />} />

                                                <Route
                                                    path='/quan-ly-kho/sua-mat-hang/:id'
                                                    element={<UpdateProduct />}
                                                />

                                                <Route path='/quan-ly-kho/danh-sach-hang' element={<ListProducts />} />

                                                <Route path='/quan-ly-kho/them-kho-hang' element={<ListWareHouse />} />

                                                <Route
                                                    path='/quan-ly-kho/sua-kho-hang/:id'
                                                    element={<UpdateWareHouse />}
                                                />
                                                <Route path='quan-ly-kho/tinh-luong' element={<CalculateWage />} />
                                                <Route path='/chiet-khau/them-chiet-khau' element={<ListDiscount />} />
                                                <Route path='/nhap-kho/nhap-hang' element={<CreatePurchase />} />
                                                <Route path='/nhan-vien/them-nhan-vien' element={<ListStaff />} />
                                                <Route path='/nhan-vien/sua-nhan-vien/:id' element={<UpdateStaff />} />
                                                <Route
                                                    path='/nhap-kho/danh-sach-nhap-hang'
                                                    element={<ListParchases />}
                                                />
                                                <Route
                                                    path='/nhap-kho/sua-don-nhap-hang/:id'
                                                    element={<UpdatePurchase />}
                                                />
                                                <Route
                                                    path='/nhap-kho/nhap-hang-bang-excel'
                                                    element={<ImportPurchase />}
                                                />
                                                <Route path='/khach-hang/quan-ly-tuyen' element={<CreateLcation />} />
                                                <Route
                                                    path='/khach-hang/quan-ly-tuyen/sua-tuyen/:id'
                                                    element={<UpdateLcation />}
                                                />
                                                <Route path='/khach-hang/them-khach-hang' element={<ListCustomers />} />
                                                <Route path='/xuat-kho/ban-hang' element={<CreateSales />} />
                                                <Route path='/xuat-kho/danh-sach-ban-hang' element={<ListSales />} />
                                                <Route path='xuat-kho/xuat-hang-bang-excel' element={<ImportSales />} />
                                                <Route path='xuat-kho/sua-don-ban-hang/:id' element={<UpdateSales />} />
                                                <Route path='khach-hang/don-hang/:id' element={<OrderCustomer />} />
                                                <Route
                                                    path='khach-hang/hang-da-lay/:id'
                                                    element={<ListproductOrder />}
                                                />
                                                <Route
                                                    path='khach-hang/nhap-khach-hang'
                                                    element={<ImportCustomers />}
                                                />

                                                {/* link 404 */}
                                                <Route path='*' element={<Page404 />} />
                                            </Routes>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                ></Route>
            </Routes>

            <ToastContainer />
        </>
    )
}

export default App
