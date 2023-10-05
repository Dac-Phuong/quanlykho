import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { getUserData } from "./admin/utils/function";
import Login from "./admin/page/auth/Login";
import ListCustomers from "./admin/page/customer/create-customers";
import ListDiscount from "./admin/page/discount/list-discount";
import CreateLcation from "./admin/page/location/create-location";
import UpdateLcation from "./admin/page/location/update-location";
import AddProductGroup from "./admin/page/product-group/add-productGroup";
import ProductGroupList from "./admin/page/product-group/products-groupList";
import UpdateProductGroup from "./admin/page/product-group/update-productGroup";
import CreateProduct from "./admin/page/products/create-products";
import ListProducts from "./admin/page/products/list-products";
import UpdateProduct from "./admin/page/products/update-products";
import CreatePurchase from "./admin/page/purchases/create-purchase";
import ImportPurchase from "./admin/page/purchases/import-purchaseExcel";
import ListParchases from "./admin/page/purchases/list-purchases";
import UpdatePurchase from "./admin/page/purchases/update-purchase";
import CreateSales from "./admin/page/sales/create-sales";
import ListSales from "./admin/page/sales/list-sales";
import ListStaff from "./admin/page/staff/list-staff";
import UpdateStaff from "./admin/page/staff/update-staff";
import ListWareHouse from "./admin/page/warehouse/ListWareHouse";
import UpdateWareHouse from "./admin/page/warehouse/UpdateWareHouse";
import Header from "./layouts/Header";
import Home from "./layouts/Home";
import Sidebar from "./layouts/Sidebar";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const getData = () => {
      const userData = getUserData();
      if (userData.token === null) {
        navigate("/login");
      }
    };
    getData();
  }, []);

  return (
    <>
      <Routes>
        <Route index path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <>
              <div id="pcoded" className="pcoded">
                <div className="pcoded-overlay-box" />
                <div className="pcoded-container navbar-wrapper">
                  <Header />
                  <Sidebar />
                  <div className="pcoded-main-container">
                    <div className="pcoded-wrapper">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                          path="/nhom-hang/them-nhom-hang"
                          element={<AddProductGroup />}
                        />
                        <Route
                          path="/nhom-hang/danh-sach-nhom-hang"
                          element={<ProductGroupList />}
                        />
                        <Route
                          path="/nhom-hang/sua-nhom-hang/:id"
                          element={<UpdateProductGroup />}
                        />

                        <Route
                          path="/quan-ly-kho/them-hang-moi"
                          element={<CreateProduct />}
                        />

                        <Route
                          path="/quan-ly-kho/sua-mat-hang/:id"
                          element={<UpdateProduct />}
                        />

                        <Route
                          path="/quan-ly-kho/danh-sach-hang"
                          element={<ListProducts />}
                        />

                        <Route
                          path="/quan-ly-kho/them-kho-hang"
                          element={<ListWareHouse />}
                        />

                        <Route
                          path="/quan-ly-kho/sua-kho-hang/:id"
                          element={<UpdateWareHouse />}
                        />
                        <Route
                          path="/chiet-khau/them-chiet-khau"
                          element={<ListDiscount />}
                        />
                        <Route
                          path="/nhap-kho/nhap-hang"
                          element={<CreatePurchase />}
                        />
                        <Route
                          path="/nhan-vien/them-nhan-vien"
                          element={<ListStaff />}
                        />
                        <Route
                          path="/nhan-vien/sua-nhan-vien/:id"
                          element={<UpdateStaff />}
                        />
                        <Route
                          path="/nhap-kho/danh-sach-nhap-hang"
                          element={<ListParchases />}
                        />
                        <Route
                          path="/nhap-kho/sua-don-nhap-hang/:id"
                          element={<UpdatePurchase />}
                        />
                        <Route
                          path="/nhap-kho/nhap-hang-bang-excel"
                          element={<ImportPurchase />}
                        />
                        <Route
                          path="/khach-hang/quan-ly-tuyen"
                          element={<CreateLcation />}
                        />
                        <Route
                          path="/khach-hang/quan-ly-tuyen/sua-tuyen/:id"
                          element={<UpdateLcation />}
                        />
                        <Route
                          path="/khach-hang/them-khach-hang"
                          element={<ListCustomers />}
                        />
                        <Route
                          path="/xuat-kho/ban-hang"
                          element={<CreateSales />}
                        />
                        <Route
                          path="/xuat-kho/danh-sach-ban-hang"
                          element={<ListSales />}
                        />
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
  );
}

export default App;
