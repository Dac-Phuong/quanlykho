import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import './style.css'
import { setUserData } from '../../utils/function'
import { LOGIN } from '../../api/index'
import { showToastError, showToastSuccess } from '../../utils/toastmessage'
import { http } from '../../utils/http'
import { RotatingLines } from 'react-loader-spinner'
export default function Login() {
    const Title = 'Phần mềm quản lý bán hàng'
    const [loading, setLoading] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    // lấy dữ liệu từ input
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    // kiểm tra dữ liệu đầu vào
    const validation = () => {
        let isValid = true
        const regex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/
        if (formData.username.trim() === '') {
            showToastError('Vui lòng nhập tên đăng nhập.')
            isValid = false
        } else if (regex.test(formData.username)) {
            showToastError('Tên đăng nhập không được chứa ký tự đặc biệt!')
            isValid = false
        }
        if (formData.password.trim() === '') {
            showToastError('Vui lòng nhập mật khẩu.')
            isValid = false
        } else if (regex.test(formData.password)) {
            showToastError('Mật khẩu không được chứa ký tự đặc biệt!')
            isValid = false
        }
        return isValid
    }

    // function đăng nhập
    const login = async () => {
        const isValid = validation()
        if (isValid) {
            setLoading(true)
            await http
                .post(LOGIN, formData)
                .then((response) => {
                    if (response.status === 200) {
                        window.location.href = '/'
                        setLoading(false)
                        setUserData(response.data)
                    }
                })
                .catch((error) => {
                    setLoading(false)
                    showToastError('Đăng nhập thất bại vui lòng kiểm tra lại thông tin đăng nhập')
                    console.error(error.response.data)
                })
        }
    }
    console.log(isChecked)
    return (
        <section className='login-block'>
            <Helmet>
                <title>{Title}</title>
            </Helmet>
            {/* Container-fluid starts */}
            <div className='container'>
                <div className='row'>
                    <div className='col-sm-12'>
                        {/* Authentication card start */}
                        <form className='md-float-material form-material'>
                            <div className='text-center'>
                                <img src='/assets/images/logo.png' className='m-auto' alt='logo.png' />
                            </div>
                            <div className='auth-box card'>
                                <div className='card-block'>
                                    <div className='row m-b-20'>
                                        <div className='col-md-12'>
                                            <h3 className='text-center'>Đăng nhập</h3>
                                        </div>
                                    </div>
                                    <div className='form-group form-primary'>
                                        <input
                                            type='text'
                                            className='form-control'
                                            required
                                            name='username'
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                        <span className='form-bar' />
                                        <label className='float-label'>Tên đăng nhập</label>
                                    </div>
                                    <div className='form-group form-primary'>
                                        <input
                                            type='password'
                                            name='password'
                                            className='form-control'
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <span className='form-bar' />
                                        <label className='float-label'>Mật khẩu</label>
                                    </div>
                                    <div className='row m-t-25 text-left'>
                                        <div className='col-12'>
                                            <div className='checkbox-fade fade-in-primary d-'>
                                                <label>
                                                    <input
                                                        type='checkbox'
                                                        id='vehicle1'
                                                        name='vehicle1'
                                                        value='Bike'
                                                        onChange={() => setIsChecked(!isChecked)}
                                                    />
                                                    <span className='cr'>
                                                        <i className='cr-icon icofont icofont-ui-check txt-primary' />
                                                    </span>
                                                    <span className='text-inverse cursor-pointer'>Remember me</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row m-t-30'>
                                        <div className='col-md-12'>
                                            <button
                                                onClick={() => login()}
                                                type='button'
                                                className='btn btn-primary btn-md btn-block waves-effect waves-light text-center m-b-20'
                                            >
                                                {loading ? (
                                                    <div className='w-[23px] ml-auto mr-auto'>
                                                        <RotatingLines
                                                            strokeColor='white'
                                                            strokeWidth='5'
                                                            animationDuration='0.75'
                                                            width='23'
                                                            visible={true}
                                                        />
                                                    </div>
                                                ) : (
                                                    'Đăng nhập'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='row'>
                                        <div className='col-md-10'>
                                            <p className='text-inverse text-left m-b-0'>Chào mừng đến với</p>
                                            <p className='text-inverse text-left'>
                                                <div>
                                                    <b>Website quản lý kho</b>
                                                </div>
                                            </p>
                                        </div>
                                        <div className='col-md-2'>
                                            <img src='/assets/images/auth/Logo-small-bottom.png' alt='small-logo.png' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
