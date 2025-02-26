import React from 'react'
import {assets} from "../../assets/assets.js";

const Companies = () => {
    return (
        <div className='pt-16'>
            <p className='text-base text-gray-500'>Нам доверяют ученики из:</p>
            <div className='flex flex-wrap items-center justify-center gap-6 md:gap-16 md:mt-10 mt-5'>
                <img src={assets.microsoft_logo} className='w-20 md:w-28 cursor-pointer transition-all duration-200 hover:scale-105' alt=""/>
                <img src={assets.walmart_logo} className='w-20 md:w-28 cursor-pointer transition-all duration-200 hover:scale-105' alt=""/>
                <img src={assets.accenture_logo} className='w-20 md:w-28 cursor-pointer transition-all duration-200 hover:scale-105' alt=""/>
                <img src={assets.adobe_logo} className='w-20 md:w-28 cursor-pointer transition-all duration-200 hover:scale-105' alt=""/>
                <img src={assets.paypal_logo} className='w-20 md:w-28 cursor-pointer transition-all duration-200 hover:scale-105' alt=""/>
            </div>
        </div>
    )
}
export default Companies
