import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { BsFillBarChartFill, BsArrowLeftRight, BsStarFill } from 'react-icons/bs'
import { FaUsers } from 'react-icons/fa'
import { AiOutlinePercentage, AiOutlineLineChart, AiFillTool } from 'react-icons/ai'
import { FaShop } from 'react-icons/fa6'

// React router
import { useLocation } from 'react-router-dom'

import { LOGOUT } from '../admin/api'
import { showToastError } from '../admin/utils/toastmessage'
import { http } from '../admin/utils/http'
export default function Sidebar() {
    const { pathname } = useLocation()

    const logout = async () => {
        await http
            .post(LOGOUT)
            .then((response) => {
                if (response.status === 200) {
                    localStorage.removeItem('userData')
                    window.location.href = '/login'
                }
            })
            .catch((error) => {
                console.error(' Error:', error.response)
                showToastError('Đăng xuất không thành công')
            })
    }

    return (
        <nav className='pcoded-navbar'>
            <div className='pcoded-inner-navbar main-menu'>
                <div className>
                    <div className='main-menu-header min-h-[115px]'>
                        <img
                            className='img-80 img-radius'
                            src='https://st.gamevui.com/images/image/2020/09/16/lmht-among-us-hd10.jpg'
                            aria-label='User Profile Image'
                        />
                        <div className='user-details'>
                            <span id='more-details'>
                                Admin
                                <i className='fa fa-caret-down' />
                            </span>
                        </div>
                    </div>
                    <div className='main-menu-content'>
                        <ul>
                            <li className='more-details hover:text-red-500'>
                                <button className=' ml-16 pt-3' onClick={() => logout()}>
                                    <i className='ti-layout-sidebar-left pr-2' />
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='p-15 p-b-0'></div>
                <ul className='pcoded-item pcoded-left-item'>
                    <li className='active'>
                        <Link to={'/'}>
                            <span className='pcoded-micon'>
                                <i className='ti-home' />
                            </span>
                            <span className='pcoded-mtext' data-i18n='nav.dash.main'>
                                Trang chủ
                            </span>
                            <span className='pcoded-mcaret' />
                        </Link>
                    </li>
                </ul>
                <Menu
                    menuItemStyles={{
                        button: ({ level, active, disabled }) => {
                            if (level === 0)
                                return {
                                    color: disabled ? '#000' : '#37474F',
                                    backgroundColor: active ? '#000' : undefined
                                }
                        }
                    }}
                >
                    <div className='pcoded-navigation-label' data-i18n='nav.category.forms'>
                        Quản nhóm hàng
                    </div>
                    <SubMenu label='Nhóm hàng' icon={<BsFillBarChartFill size={18} />}>
                        <MenuItem
                            className={pathname === '/nhom-hang/them-nhom-hang' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/nhom-hang/them-nhom-hang' />}
                        >
                            Thêm nhóm hàng
                        </MenuItem>
                        <MenuItem
                            className={pathname === '/nhom-hang/danh-sach-nhom-hang' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/nhom-hang/danh-sach-nhom-hang' />}
                        >
                            Danh sách nhóm hàng
                        </MenuItem>
                    </SubMenu>
                    <div className='pcoded-navigation-label'>Quản lý kho</div>
                    <SubMenu label='Kho' icon={<FaShop size={18} />}>
                        <MenuItem
                            className={pathname === '/quan-ly-kho/them-hang-moi' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/quan-ly-kho/them-hang-moi' />}
                        >
                            Thêm hàng mới
                        </MenuItem>
                        <MenuItem
                            className={pathname === '/quan-ly-kho/danh-sach-hang' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/quan-ly-kho/danh-sach-hang' />}
                        >
                            Danh sách hàng
                        </MenuItem>
                        <MenuItem
                            className={pathname === '/quan-ly-kho/them-kho-hang' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/quan-ly-kho/them-kho-hang' />}
                        >
                            Danh sách kho
                        </MenuItem>
                        <MenuItem
                            className={pathname === '/quan-ly-kho/chuyen-kho' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/quan-ly-kho/chuyen-kho' />}
                        >
                            Chuyển kho
                        </MenuItem>
                        <MenuItem
                            className={pathname === '/quan-ly-kho/tinh-luong' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/quan-ly-kho/tinh-luong' />}
                        >
                            Tính lương
                        </MenuItem>
                    </SubMenu>
                    <MenuItem component={<Link to='/chiet-khau/them-chiet-khau' />}>
                        <span
                            className={`flex pl-1.5 gap-x-5 ${
                                pathname === '/chiet-khau/them-chiet-khau' ? 'text-blue-600 font-medium' : ''
                            }`}
                        >
                            <AiOutlinePercentage size={18} />
                            Chiết khấu
                        </span>
                    </MenuItem>
                    <div className='pcoded-navigation-label'>Quản lý hàng</div>
                    <SubMenu label=' Nhập hàng' icon={<BsArrowLeftRight size={18} />}>
                        <MenuItem
                            className={pathname === '/nhap-kho/nhap-hang' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/nhap-kho/nhap-hang' />}
                        >
                            Nhập hàng
                        </MenuItem>
                        <MenuItem
                            className={pathname === '/nhap-kho/nhap-hang-bang-excel' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/nhap-kho/nhap-hang-bang-excel' />}
                        >
                            Nhập hàng bằng Excel
                        </MenuItem>
                        <MenuItem
                            className={pathname === '/nhap-kho/danh-sach-nhap-hang' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/nhap-kho/danh-sach-nhap-hang' />}
                        >
                            Đơn nhập
                        </MenuItem>
                    </SubMenu>
                    <SubMenu label=' Bán hàng' icon={<BsArrowLeftRight size={18} />}>
                        <MenuItem
                            className={pathname === '/xuat-kho/ban-hang' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/xuat-kho/ban-hang' />}
                        >
                            Bán hàng
                        </MenuItem>
                        <MenuItem
                            className={pathname === '/xuat-kho/xuat-hang-bang-excel' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/xuat-kho/xuat-hang-bang-excel' />}
                        >
                            Xuất hàng bằng Excel
                        </MenuItem>
                        <MenuItem
                            className={pathname === '/xuat-kho/danh-sach-ban-hang' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/xuat-kho/danh-sach-ban-hang' />}
                        >
                            Đơn bán
                        </MenuItem>
                    </SubMenu>
                    <div className='pcoded-navigation-label'>Quản lý nhân viên</div>
                    <MenuItem component={<Link to='/nhan-vien/them-nhan-vien' />}>
                        <span
                            className={`flex pl-1.5 gap-x-5 ${
                                pathname === '/nhan-vien/them-nhan-vien' ? 'text-blue-600 font-medium' : ''
                            }`}
                        >
                            <BsStarFill size={18} />
                            Nhân viên
                        </span>
                    </MenuItem>
                    <SubMenu label='Khách hàng' icon={<FaUsers size={18} />}>
                        <MenuItem
                            className={pathname === '/khach-hang/them-khach-hang' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/khach-hang/them-khach-hang' />}
                        >
                            Thêm khách hàng
                        </MenuItem>
                        <MenuItem
                            className={pathname === '/khach-hang/nhap-khach-hang' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/khach-hang/nhap-khach-hang' />}
                        >
                            Nhập khách bằng Excel
                        </MenuItem>
                        <MenuItem
                            className={pathname === '/khach-hang/quan-ly-tuyen' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/khach-hang/quan-ly-tuyen' />}
                        >
                            Quản lý tuyến
                        </MenuItem>
                    </SubMenu>
                    <div className='pcoded-navigation-label'>Quản lý thống kê</div>
                    <SubMenu label='Thống kê' icon={<AiOutlineLineChart size={18} />}>
                        <MenuItem
                            className={pathname === '/thong-ke/bao-cao-chiet-khau' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/thong-ke/bao-cao-chiet-khau' />}
                        >
                            Báo cáo chiết khấu
                        </MenuItem>
                        <MenuItem
                            className={pathname === '/thong-ke/doanh-so-thuc' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/thong-ke/doanh-so-thuc' />}
                        >
                            Doanh số thực
                        </MenuItem>
                        <MenuItem
                            className={pathname === '/thong-ke/doanh-so-nhap' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/thong-ke/doanh-so-nhap' />}
                        >
                            Doanh số nhập
                        </MenuItem>
                        <MenuItem
                            className={pathname === '/thong-ke/hang-bao-hanh' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/thong-ke/hang-bao-hanh' />}
                        >
                            Hàng bảo hành
                        </MenuItem>
                        <MenuItem
                            className={
                                pathname === '/thong-ke/chiet-khau-luong-hang-ngoai' ? 'text-blue-600 font-medium' : ''
                            }
                            component={<Link to='/thong-ke/chiet-khau-luong-hang-ngoai' />}
                        >
                            Lương NVBH
                        </MenuItem>
                    </SubMenu>
                    <SubMenu label='Cấu hình' icon={<AiFillTool size={18} />}>
                        <MenuItem
                            className={pathname === '/cau-hinh/chi-tieu-ban' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/cau-hinh/chi-tieu-ban' />}
                        >
                            Chỉ tiêu bán
                        </MenuItem>
                        <MenuItem
                            className={pathname === '/cau-hinh/chi-tieu-nhap' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='/cau-hinh/chi-tieu-nhap' />}
                        >
                            Chỉ tiêu nhập
                        </MenuItem>
                        <MenuItem
                            className={pathname === '#' ? 'text-blue-600 font-medium' : ''}
                            component={<Link to='#' />}
                        >
                            Đơn bán
                        </MenuItem>
                    </SubMenu>
                </Menu>
            </div>
        </nav>
    )
}
