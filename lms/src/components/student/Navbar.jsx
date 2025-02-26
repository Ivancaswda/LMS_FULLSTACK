import React, {useContext} from 'react'
import {assets} from "../../assets/assets.js";
import {Link, NavLink, useNavigate} from "react-router-dom";
import {useClerk, UserButton, useUser} from "@clerk/clerk-react";
import {LmsContext} from "../../context/LmsContext.jsx";

const Navbar = () => {

    const isCourseListPage = location.pathname.includes('/course-list') // check if we
    // are on course-list page

    const {openSignIn} = useClerk()
    const {user} = useUser()
    const navigate = useNavigate()
    const {isEducator, setIsEducator} = useContext(LmsContext)
    return (
        <div className={` flex items-center justify-between px-4 sm:px-10 md:px-14
         lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
            <img onClick={() => {
                navigate('/')
            }} src={assets.logo} className='w-28 lg:w-32' alt=""/>
            <div className='hidden md:flex items-center gap-5 text-gray-500'>
                <div className='flex items-center gap-2'>
                    { user && (
                        <>
                            <button onClick={() => {
                                navigate('/educator')
                            }} className='hover:underline'>{ !isEducator ? 'Стань преподователем' : 'Панель преподователя'}</button>
                            <NavLink className='hover:underline' to='/my-enrollments'>Мои записи</NavLink>
                        </>
                        )}
                </div>
                {user ? <UserButton/> : <button onClick={() => {
                    openSignIn()
                }} className='bg-blue-600 text-white px-5 py-2 rounded-full'>Создать Аккаунт</button>}


                {/* -------------------- Mobile screen navbar-------------------- */}
                <div className='flex items-center gap-2 sm:gap-5 text-gray-500 visible md:hidden  '>
                    <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>

                        {user &&(<>
                            <button onClick={() => {
                                navigate('/educator')
                            }}
                                    className='hover:underline'>{!isEducator ? 'Стань преподователем' : 'Панель преподователя'}</button>
                            <NavLink className='hover:underline' to='/my-enrollments'>Мои записи</NavLink>
                        </>)}

                    </div>
                    {
                        user ? <UserButton/> : <button onClick={() => {
                            openSignIn()
                        }}><img src={assets.user_icon} alt=""/></button>

                    }</div>
            </div>
        </div>
    )
}
export default Navbar
