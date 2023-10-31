import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { CREATE_PRODUCTS } from '../../api'
import { showToastError, showToastSuccess } from '../../utils/toastmessage'
import Loading from '../../../components/loading'
import { useMutation, useQueryClient } from 'react-query'
import HeaderComponents from '../../../components/header'
import { TextField, Autocomplete } from '@mui/material/'
import { useGetDataGroup } from '../../api/useFetchData'
import { http } from '../../utils/http'

export default function CreateProduct() {
    const Title = 'Thêm hàng hóa'
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()
    const queryKey = 'products_key'
    const queryKey1 = 'productgroup_key'
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        buy_price: '',
        sell_price: '',
        color: '',
        group: ''
    })
    // get date từ useQuery

    const { data, isLoading, error } = useGetDataGroup(queryKey1)
    // lấy dữ liệu từ input
    const handleInputChange = (event) => {
        const { name, value } = event?.target
        setFormData({
            ...formData,
            [name]: value
        })
    }
    // tạo sản phẩm bằng useQuery
    const createProduct = async (formData) => {
        try {
            const response = await http.post(CREATE_PRODUCTS, formData)
            setLoading(false)
            showToastSuccess('Thêm sản phẩm thành công!')
            return response.data
        } catch (error) {
            setLoading(false)
            showToastError('Thêm sản phẩm thất bại!')
            console.log(error)
        }
    }
    // tạo sản phẩm bằng useQuery
    const mutation = useMutation(createProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries(queryKey)
            setFormData({
                name: '',
                code: '',
                buy_price: '',
                sell_price: '',
                color: '',
                group: ''
            })
        },
        onError: (error) => {
            console.error('Lỗi khi gửi yêu cầu POST:', error)
        }
    })

    if (isLoading) {
        return <Loading />
    }
    // kiểm tra dữ liệu đầu vào
    const validation = () => {
        let isValid = true
        const regex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/
        if (formData.name.trim() === '') {
            showToastError('Vui lòng nhập tên sản phẩm!')
            isValid = false
        }
        if (formData.code.trim() === '') {
            showToastError('Vui lòng nhập mã sản phẩm!')
            isValid = false
        } else if (regex.test(formData.code)) {
            showToastError('Mã sản phẩm không được chứa ký tự đặc biệt!')
            isValid = false
        }
        if (formData.buy_price.trim() === '') {
            showToastError('Vui lòng nhập giá sản phẩm!')
            isValid = false
        } else if (regex.test(formData.buy_price)) {
            showToastError('Giá sản phẩm không được chứa ký tự đặc biệt!')
            isValid = false
        }
        if (formData.group === '') {
            showToastError('Vui lòng chọn nhóm hàng!')
            isValid = false
        }
        return isValid
    }

    // handle tạo sản phẩm bằng useQuery
    const submitForm = () => {
        const isValid = validation()
        if (isValid) {
            setLoading(true)
            mutation.mutate(formData)
        }
    }
    // View
    return (
        <section className='pcoded-content'>
            <Helmet>
                <title>{Title}</title>
            </Helmet>
            <HeaderComponents label={'Quản lý kho hàng'} title={'Thêm hàng hoá'} />
            <div className='row my-4 mx-2 flex flex-wrap'>
                <div className='col-sm-12 lg:col-sm-6 '>
                    <div className='card'>
                        <div className='card-header'>
                            <div className='card-header-left'>
                                <div className='header_title'>
                                    <h5>Thông tin</h5>
                                </div>
                                <small>Nhập thông tin của mặt hàng</small>
                            </div>
                        </div>
                        <div className='card-block remove-label'>
                            <div className='form-group'>
                                <div className='form-line'>
                                    <TextField
                                        className='form-control'
                                        label='Tên mặt hàng'
                                        id='standard-basic'
                                        variant='standard'
                                        name='name'
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className='form-group'>
                                <div className='form-line'>
                                    <TextField
                                        className='form-control '
                                        onChange={handleInputChange}
                                        value={formData.code}
                                        label='Mã mặt hàng'
                                        id='standard-basic'
                                        name='code'
                                        variant='standard'
                                    />
                                </div>
                            </div>
                            <div className=' flex flex-col lg:flex-row gap-3 justify-between'>
                                <div className='w-full'>
                                    <TextField
                                        style={{ width: '100%' }}
                                        label='Giá nhập'
                                        name='buy_price'
                                        type='number'
                                        value={formData.buy_price}
                                        onChange={handleInputChange}
                                        id='standard-basic'
                                        variant='standard'
                                    />
                                </div>
                                <div className='w-full'>
                                    <TextField
                                        style={{ width: '100%' }}
                                        label='Giá bán'
                                        type='number'
                                        name='sell_price'
                                        value={formData.sell_price}
                                        onChange={handleInputChange}
                                        id='standard-basic'
                                        variant='standard'
                                    />
                                </div>
                            </div>
                            <div className='form-group ' style={{ marginTop: 6 }}>
                                <TextField
                                    style={{ width: '100%', marginTop: 15 }}
                                    label='Màu sắc'
                                    type='text'
                                    value={formData.color}
                                    id='standard-basic'
                                    variant='standard'
                                    name='color'
                                    onChange={handleInputChange}
                                />
                            </div>
                            <Autocomplete
                                fullWidth
                                id='disable-close-on-select'
                                clearOnEscape
                                className='mt-4'
                                options={data?.data}
                                onChange={(e, item) =>
                                    setFormData({
                                        ...formData,
                                        group: item?.id
                                    })
                                }
                                getOptionLabel={(rows) => rows?.group_name || ''}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label='Chọn nhóm hàng'
                                        variant='standard'
                                        size='small'
                                    />
                                )}
                            />
                            <div className='form-group  mt-10'>
                                <div className='form-inline'>
                                    <button
                                        onClick={() => submitForm()}
                                        className='btn waves-effect waves-light btn-primary btn-block'
                                        fdprocessedid='gpxvki'
                                    >
                                        Lưu sản phẩm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-sm-12 lg:col-sm-6'>
                    <div className='card'>
                        <div className='card-header'>
                            <div className='card-header-left'>
                                <div className='header_title'>
                                    <h5>Trùng</h5>
                                </div>
                                <small>Thông tin nhóm hàng đã tồn tại</small>
                            </div>
                            <div className='card-header-right'></div>
                        </div>
                        <div className='card-block remove-label'>
                            <div className='m-4 text-[#555]'>
                                <span>Chưa có dữ liệu</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <>{loading ? <Loading /> : null}</> */}
        </section>
    )
}
