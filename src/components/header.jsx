import React, { useState } from 'react'
import { Link } from 'react-router-dom'
export default function HeaderComponents({ label, title }) {
    return (
        <div className='page-header min-w-fit md:h-[115px] h-[150px]' style={{ marginTop: 56 }}>
            <div className='page-block'>
                <div className='row align-items-center'>
                    <div className='col-md-8'>
                        <div className='page-header-title'>
                            <h5 className='m-b-10 text-xl'>{label}</h5>
                            <p className='m-b-0 text-sm'>{'Mục: ' + title}</p>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <ul className='breadcrumb-title'>
                            <Link to={'/'}>
                                <div className='flex items-center hover:text-[#448AFF]'>
                                    <li className='breadcrumb-item text-base'>
                                        <i className='fa fa-home pr-2' />
                                        Trang Chủ
                                    </li>
                                </div>
                            </Link>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
