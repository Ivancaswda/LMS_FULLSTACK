import React from 'react'
import {assets} from "../../assets/assets.js";

const Footer = () => {
    return (
        <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
            <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
                <div className='flex flex-col md:items-start items-center w-full '>
                    <img src={assets.logo_dark} alt="logo"/>
                    <p className='mt-6 text-center md:text-left text-sm text-white/80'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Aliquam, aspernatur autem eaque, esse eveniet harum impedit porro
                        rem sint tenetur totam veritatis voluptatibus? Amet atque blanditiis earum eum non totam.</p>
                </div>
                <div>
                    <h2 className='font-semibold text-white mb-5'>Компания</h2>
                    <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
                        <li><a href="#">Главная страницы</a></li>
                        <li><a href="#">О нас</a></li>
                        <li><a href="#">Свяжитесь с нами</a></li>
                        <li><a href="#">Политика и конфидециальность</a></li>
                    </ul>
                </div>
                <div className='hidden md:flex flex-col items-start w-full'>
                    <h2 className='font-semibold text-white mb-5'>Подпишись на наш новостник</h2>
                    <p className='text-sm text-white/80'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic, possimus.</p>
                    <div className='flex items-center gap-2'>
                        <input className='mt-2 border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm' type="email" placeholder='Введите ваш email'/>
                        <button className='mt-2 bg-blue-600 w-24 h-9 text-white rounded'>Подпишись</button>
                    </div>
                </div>
            </div>
            <p className='text-white/60 py-4 text-xs text-center'>Copyright 2025 &copy; aIvanius. Все права защищены</p>
        </footer>
    )
}
export default Footer
