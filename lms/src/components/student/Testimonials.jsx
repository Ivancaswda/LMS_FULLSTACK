import React from 'react'
import {assets, dummyTestimonial} from "../../assets/assets.js";

const Testimonials = () => {
    return (
        <div className='pb-14 px-8 md:px-0'>
            <h2 className='text-3xl font-medium text-gray-800'>Отзывы</h2>
            <p className='md:text-base text-gray-500 mt-3 mb-6'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Doloremque harum in mollitia <br/> officiis quam quas quos
                tenetur? Accusamus illum sapiente voluptatibus?
            </p>
            <div className='grid grid-cols-auto gap-8 mt-14'>
                {dummyTestimonial.map((item, index) => (
                    <div className='text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden' key={index}>
                        <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10'>
                            <img className='h-12 w-12 rounded-full' src={item.image} alt=""/>
                            <div >
                                <h1 className='text-lg font-medium text-gray-800'>{item.name}</h1>
                                <p className='text-gray-800/50'>{item.role}</p>
                            </div>
                        </div>
                            <div className='p-5 pb-7'>
                                <div className='flex gap-0.5'>
                                    {/* 5 изображений звезд */}
                                    {[...Array(5)].map((i, index) => (
                                        <img className='h-5' key={index} src={index < Math.floor(item.rating) ? assets.star : assets.star_blank} alt=""/>
                                    ))}
                                </div>
                                <p className='text-gray-500 mt-5'>{item.feedback}</p>
                            </div>
                        <a href='#' className='px-5 underline text-blue-600'>Подробнее</a>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Testimonials
