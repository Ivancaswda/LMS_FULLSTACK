import React from 'react'
import {assets} from "../../assets/assets.js";

const CallToAction = () => {
    return (
        <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
            <h1 className='text-xl md:text-3xl font-semibold'>Изучите что-угодно, когда-угодно, где-угодно</h1>
            <p className='text-gray-500 sm:text-sm'>
                Lorem ipsum dolor sit amet, consectetur adipisicing <br/> elit. Adipisci eos rerum sit ullam? Accusamus deleni
                ti deserunt dignissimos minus non obcaecati quia quis reprehenderit sint sunt.
            </p>
            <div className='flex items-center font-medium gap-6 mt-4'>
                <button className='px-10 py-3 rounded-md text-white bg-blue-600'>Начать</button>
                <button className='flex items-center gap-2'>Learn more <img src={assets.arrow_icon} alt=""/></button>
            </div>
        </div>
    )
}
export default CallToAction
