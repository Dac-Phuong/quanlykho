import { BsFillCartPlusFill } from 'react-icons/bs'

const BoxInformation = (props) => {
    const { data, textData, title, icon = false } = props
    return (
        <div className='card w-full'>
            <div className='card-block min-h-[135px]'>
                <div className='row align-items-center'>
                    <div className='col-8'>
                        <h4 className='text-blue-600'>{(data ? data : 0) + ' ' + textData}</h4>
                        <h6 className='text-muted m-b-0'>{title}</h6>
                    </div>
                    <div className='col-4 text-right'>
                        {!icon && <span className='text-5xl font-medium'>$</span>}
                        {icon && <BsFillCartPlusFill className='ml-auto' size={30} />}
                    </div>
                </div>
            </div>
            <div className={`card-footer bg-blue-600`}>
                <div className='row align-items-center'>
                    <div className='col-9'>
                        <p className='text-white m-b-0'>% change</p>
                    </div>
                    <div className='col-3 text-right'>
                        <i className='fa fa-line-chart text-white f-16' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BoxInformation
