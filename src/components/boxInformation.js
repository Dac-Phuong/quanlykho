import { BsFillCartPlusFill } from 'react-icons/bs'

const BoxInformation = (props) => {
    const { data, textData, title, color = 0, hiddenFooter = true, icon = false } = props
    const newData = Number(data || 0).toLocaleString('en-US')

    const arrBgColor = ['bg-blue-600', 'bg-red-600', 'bg-green-600', 'bg-yellow-600', 'bg-purple-600', 'bg-gray-600']

    const arrTextColor = [
        'text-blue-600',
        'text-red-600',
        'text-green-600',
        'text-yellow-600',
        'text-purple-600',
        'text-gray-600'
    ]

    return (
        <div className='card w-full drop-shadow-2xl'>
            <div className='card-block min-h-[135px]'>
                <div className='row align-items-center'>
                    <div className='col-8'>
                        <h4 className={`${arrTextColor[color]}`}>{newData + ' ' + textData}</h4>
                        <h6 className='text-muted m-b-0'>{title}</h6>
                    </div>
                    <div className='col-4 text-right'>
                        {!icon && <span className='text-5xl font-medium'>$</span>}
                        {icon && <BsFillCartPlusFill className='ml-auto' size={30} />}
                    </div>
                </div>
            </div>
            {hiddenFooter && (
                <div className={`card-footer ${arrBgColor[color]}`}>
                    <div className='row align-items-center'>
                        <div className='col-9'>
                            <p className='text-white m-b-0'>% change</p>
                        </div>
                        <div className='col-3 text-right'>
                            <i className='fa fa-line-chart text-white f-16' />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BoxInformation
