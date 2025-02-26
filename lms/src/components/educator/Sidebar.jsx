import React, {useContext} from 'react'
import {assets} from "../../assets/assets.js";
import {LmsContext} from "../../context/LmsContext.jsx";
import {NavLink} from "react-router-dom";

const Sidebar = () => {

    const {isEducator} = useContext(LmsContext)

    const menuItems = [
        {name: 'Dashboard', path: '/educator', icon: assets.home_icon},
        {name: 'Добавить курс', path: '/educator/add-course', icon: assets.add_icon},
        {name: 'Мои курсы', path: '/educator/my-course', icon: assets.my_course_icon},
        {name: 'Ваши ученики', path: '/educator/students-enrolled', icon: assets.person_tick_icon},
    ]

    return isEducator && (
        <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col'>
            {menuItems.map((item, index) => (
               <NavLink className={({isActive}) => `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive ? 'bg-indigo-50 border-r-[6px] border-blue-500/90' : 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'}`} to={item.path} end={item.path === '/educator'} key={index} >
                   <img src={item.icon} className='w-6 h-6' alt=""/>
                   <p className='md:block hidden text-center'>{item.name}</p>
               </NavLink>
            ))}
        </div>
    )
}
export default Sidebar
