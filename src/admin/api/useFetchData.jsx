import { useQuery } from 'react-query'
import { http } from '../utils/http'
import {
    GET_CREATE_SALES,
    GET_PURCHASES,
    LIST_CUSTOMER,
    LIST_DISCOUNT,
    LIST_LOCATION,
    LIST_PRODUCTS,
    LIST_PRODUCT_GROUP,
    LIST_PURCHASES,
    LIST_STAFF,
    LIST_WAREHOUSE,
    List_SALES,
    LIST_HOME,
    DISCOUNT_REPORT,
    REAL_SALES,
    IMPORT_SALES,
    GUARANTEE_PRODUCT,
    STAFF_SALARY,
    IMPORT_TARGET,
    TARGET
} from '.'

// lấy data của trang chủ
export function useGetDataHome(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(LIST_HOME)
        return response.data
    })
}
// lấy data của nhóm hàng
export function useGetDataGroup(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(LIST_PRODUCT_GROUP)
        return response.data
    })
}
// lấy data của sản phẩm
export function useGetDataProducts(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(LIST_PRODUCTS)
        return response.data
    })
}
// lấy data của location
export function useGetDataLocation(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(LIST_LOCATION)
        return response.data
    })
}
// lấy data của discount
export function useGetDataDiscount(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(LIST_DISCOUNT)
        return response.data
    })
}
// lấy data của discount
export function useGetDataCustomers(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(LIST_CUSTOMER)
        return response.data
    })
}
// lấy data của Purchase
export function useGetDataPurchase(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(GET_PURCHASES)
        return response.data
    })
}
// lấy data của  Purchase
export function useGetDataListPurchase(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(LIST_PURCHASES)
        return response.data
    })
}
// lấy data của  Staff
export function useGetDataListStaff(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(LIST_STAFF)
        return response.data
    })
}
// lấy data của  WareHouse
export function useGetDataListWareHouse(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(LIST_WAREHOUSE)
        return response.data
    })
}
// lấy data của tạo sales
export function useGetDataCreateSales(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(GET_CREATE_SALES)
        return response.data
    })
}
// lấy data của sales
export function useGetListDataSales(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(List_SALES)
        return response.data
    })
}

// lấy data của báo cáo chiết khấu
export function useGetDataListDiscountReport(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(DISCOUNT_REPORT)
        return response.data
    })
}

// lấy data của doanh số thực
export function useGetDataListRealSales(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(REAL_SALES)
        return response.data
    })
}

export function useGetDataListImportSales(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(IMPORT_SALES)
        return response.data
    })
}

export function useGetDataListGuaranteeProduct(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(GUARANTEE_PRODUCT)
        return response.data
    })
}

export function useGetDataListStaffSalary(queryKey) {
    return useQuery(queryKey, async () => {
        const response = await http.get(STAFF_SALARY)
        return response.data
    })
}

export function useGetDataListImportTarget(...queryKey) {
    return useQuery(...queryKey, async () => {
        const response = await http.get(IMPORT_TARGET)
        return response.data
    })
}

export function useGetDataListTarget(...queryKey) {
    return useQuery(...queryKey, async () => {
        const response = await http.get(TARGET)
        return response.data
    })
}
