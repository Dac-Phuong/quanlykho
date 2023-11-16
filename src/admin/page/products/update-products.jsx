import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { EDIT_PRODUCTS, UPDATE_PRODUCTS } from '../../api'
import { showToastError, showToastSuccess } from '../../utils/toastmessage'
import Loading from '../../../components/loading'
import { useMutation, useQueryClient } from 'react-query'
import HeaderComponents from '../../../components/header'
import { TextField, Autocomplete } from '@mui/material/'
import { useNavigate, useParams } from 'react-router-dom'
import { http } from '../../utils/http'

export default function UpdateProduct() {
    const Title = 'Sửa hàng hóa'
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [newData, setNewData] = useState([])
    const [group_name, setGroup_name] = useState('')
    const [value, setValue] = useState(null)
    const queryKey = 'products_key'
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        buy_price: '',
        sell_price: '',
        color: '',
        group: ''
    })
    let { id } = useParams()
    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            await http
                .get(EDIT_PRODUCTS + id)
                .then((response) => {
                    if (response.status === 200) {
                        setLoading(false)
                        setNewData(response.data.product_group)
                        setValue(
                            response.data.product_group.find((item) => item.id === response?.data?.item?.group) || ''
                        )
                        const name = response.data.product_group.find(
                            (item) => item.id === response?.data?.item?.group
                        ).group_name
                        setGroup_name(name)
                        setFormData({
                            name: response?.data?.item?.name,
                            code: response?.data?.item.code,
                            buy_price: response?.data?.item?.buy_price,
                            sell_price: response?.data?.item?.sell_price,
                            color: response?.data?.item?.color,
                            group: response?.data?.item?.group
                        })
                    }
                })
                .catch((error) => {
                    setLoading(false)
                    console.error(error.response)
                })
        }
        getData()
    }, [id])
    // lấy ra tên nhóm
    const handleChange = (event, newValue) => {
        setValue(newValue)
        setFormData({
            ...formData,
            group: newValue?.id
        })
    }
    // lấy dữ liệu từ input
    const handleInputChange = (event) => {
        const { name, value } = event?.target
        setFormData({
            ...formData,
            [name]: value
        })
    }
    // sửa sản phẩm bằng useQuery
    const updateProduct = async (formData) => {
        try {
            const response = await http.put(UPDATE_PRODUCTS + id, formData)
            setLoading(false)
            showToastSuccess('Sửa mặt hàng thành công!')
            return response?.data
        } catch (error) {
            setLoading(false)
            showToastError('Sửa mặt hàng thất bại!')
            console.log(error)
        }
    }
    // sửa sản phẩm bằng useQuery
    const mutation = useMutation(updateProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries(queryKey)
            navigate('/quan-ly-kho/danh-sach-hang')
        },
        onError: (error) => {
            console.error('Lỗi khi gửi yêu cầu POST:', error)
        }
    })
    // get date từ useQuery

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
        if (formData.buy_price === '') {
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
    return (
        <section className='pcoded-content'>
            <Helmet>
                <title>{Title}</title>
            </Helmet>
            <HeaderComponents label={'Quản lý kho hàng'} title={'Thêm hàng hoá'} />
            <div className='row my-4 mx-2 grid grid-cols-12 gap-x-3'>
                <div className='col-span-6 max-2xl:col-span-12 '>
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
                            <div className=' flex justify-between'>
                                <div className='w-[48%]'>
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
                                <div className='w-[48%] '>
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
                            <div className='form-group ' style={{ width: '48%', marginTop: 6 }}>
                                <TextField
                                    style={{ width: '100%', marginTop: 10 }}
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
                                options={newData}
                                value={value}
                                onChange={handleChange}
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
                                        className='btn py-3 waves-effect waves-light btn-primary btn-block'
                                        fdprocessedid='gpxvki'
                                    >
                                        Lưu sản phẩm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-6 max-2xl:hidden'>
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
                            <div className=' text-[#555]'>
                                <table className='table'>
                                    <thead className='text-left'>
                                        <tr>
                                            <th>Mã hàng</th>
                                            <th>Tên mặt hàng</th>
                                            <th>Giá mua</th>
                                            <th>Giá bán</th>
                                            <th>Màu sắc</th>
                                            <th>Nhóm</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-left'>
                                        <tr className=''>
                                            <th>{formData.code}</th>
                                            <th>{formData.name}</th>
                                            <th>{formData.buy_price}</th>
                                            <th>{formData.sell_price}</th>
                                            <th>{formData.color}</th>
                                            <th>{group_name}</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <>{loading ? <Loading /> : null} </>
            </div>
        </section>
    )
}
