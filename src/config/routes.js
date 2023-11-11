import Page404 from '../admin/page/404'
import CalculateWage from '../admin/page/calculate-wage/calculate-wage'
import ImportTarget from '../admin/page/config/import-target'
import ListCustomers from '../admin/page/customer/create-customers'
import ImportCustomers from '../admin/page/customer/import-CustomerExcel'
import ListproductOrder from '../admin/page/customer/list-productOrder'
import OrderCustomer from '../admin/page/customer/order-customer'
import ListDiscount from '../admin/page/discount/list-discount'
import CreateLcation from '../admin/page/location/create-location'
import UpdateLcation from '../admin/page/location/update-location'
import AddProductGroup from '../admin/page/product-group/add-productGroup'
import ProductGroupList from '../admin/page/product-group/products-groupList'
import UpdateProductGroup from '../admin/page/product-group/update-productGroup'
import CreateProduct from '../admin/page/products/create-products'
import ListProducts from '../admin/page/products/list-products'
import UpdateProduct from '../admin/page/products/update-products'
import CreatePurchase from '../admin/page/purchases/create-purchase'
import ImportPurchase from '../admin/page/purchases/import-purchaseExcel'
import ListParchases from '../admin/page/purchases/list-purchases'
import UpdatePurchase from '../admin/page/purchases/update-purchase'
import CreateSales from '../admin/page/sales/create-sales'
import ImportSalesExcel from '../admin/page/sales/import-SalesExcel'
import ListSales from '../admin/page/sales/list-sales'
import UpdateSales from '../admin/page/sales/update-purchase'
import ListStaff from '../admin/page/staff/list-staff'
import UpdateStaff from '../admin/page/staff/update-staff'
import DiscountReport from '../admin/page/statistical/discount-report'
import GuaranteeProduct from '../admin/page/statistical/guarantee-product'
import ImportSales from '../admin/page/statistical/import-sales'
import RealSales from '../admin/page/statistical/real-sales'
import StaffSalary from '../admin/page/statistical/staff-salary'
import ListWareHouse from '../admin/page/warehouse/ListWareHouse'
import UpdateWareHouse from '../admin/page/warehouse/UpdateWareHouse'
import WarehouseTransfer from '../admin/page/warehouse_transfer/warehouseTransfer'
import Home from '../layouts/Home'

export const groupGoods = [
    { path: '/nhom-hang/them-nhom-hang', Component: AddProductGroup },
    { path: '/nhom-hang/danh-sach-nhom-hang', Component: ProductGroupList },
    { path: '/nhom-hang/sua-nhom-hang/:id', Component: UpdateProductGroup }
]

export const discount = [{ path: '/chiet-khau/them-chiet-khau', Component: ListDiscount }]

export const manage = [{ path: '/quan-ly/ban-le/:id', Component: CreateProduct }]

export const inventoryManagement = [
    { path: '/quan-ly-kho/them-hang-moi', Component: CreateProduct },
    { path: '/quan-ly-kho/danh-sach-hang', Component: ListProducts },
    { path: '/quan-ly-kho/them-kho-hang', Component: ListWareHouse },
    { path: '/quan-ly-kho/chuyen-kho', Component: WarehouseTransfer },
    { path: '/quan-ly-kho/tinh-luong', Component: CalculateWage },
    { path: '/quan-ly-kho/sua-mat-hang/:id', Component: UpdateProduct },
    { path: '/quan-ly-kho/sua-kho-hang/:id', Component: UpdateWareHouse }
]

export const goodsManagement = [
    { path: '/nhap-kho/nhap-hang', Component: CreatePurchase },
    { path: '/nhap-kho/danh-sach-nhap-hang', Component: ListParchases },
    { path: '/nhap-kho/nhap-hang-bang-excel', Component: ImportPurchase },
    { path: '/nhap-kho/sua-don-nhap-hang/:id', Component: UpdatePurchase }
]

export const sellManagement = [
    { path: '/xuat-kho/ban-hang', Component: CreateSales },
    { path: '/xuat-kho/danh-sach-ban-hang', Component: ListSales },
    { path: 'xuat-kho/xuat-hang-bang-excel', Component: ImportSalesExcel },
    { path: 'xuat-kho/sua-don-ban-hang/:id', Component: UpdateSales }
]

export const staffManagement = [
    { path: '/nhan-vien/them-nhan-vien', Component: ListStaff },
    { path: '/nhan-vien/sua-nhan-vien/:id', Component: UpdateStaff }
]

export const customersManagement = [
    { path: '/khach-hang/quan-ly-tuyen', Component: CreateLcation },
    { path: '/khach-hang/quan-ly-tuyen/sua-tuyen/:id', Component: UpdateLcation },
    { path: '/khach-hang/them-khach-hang', Component: ListCustomers },
    { path: 'khach-hang/don-hang/:id', Component: OrderCustomer },
    { path: 'khach-hang/hang-da-lay/:id', Component: ListproductOrder },
    { path: 'khach-hang/nhap-khach-hang', Component: ImportCustomers }
]
export const statisticalManagement = [
    { path: '/thong-ke/bao-cao-chiet-khau', Component: DiscountReport },
    {
        path: '/thong-ke/doanh-so-thuc',
        Component: RealSales
    },
    {
        path: '/thong-ke/doanh-so-nhap',
        Component: ImportSales
    },
    {
        path: '/thong-ke/hang-bao-hanh',
        Component: GuaranteeProduct
    },
    {
        path: '/thong-ke/chiet-khauluong-hang-ngoai',
        Component: StaffSalary
    }
]

export const configManagement = [
    {
        path: '/cau-hinh/chi-tieu-nhap',
        Component: ImportTarget
    }
]

const appRoutes = [
    { path: '/', Component: Home },
    ...groupGoods,
    ...discount,
    ...manage,
    ...inventoryManagement,
    ...goodsManagement,
    ...sellManagement,
    ...staffManagement,
    ...customersManagement,
    ...statisticalManagement,
    ...configManagement,
    { path: '*', Component: Page404 }
]

export default appRoutes
