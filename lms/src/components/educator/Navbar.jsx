import React from 'react'
import {assets, dummyEducatorData} from "../../assets/assets.js";
import {UserButton, useUser} from "@clerk/clerk-react";
import {NavLink} from "react-router-dom";

const Navbar = () => {
    const educatorData = dummyEducatorData
    const { user } = useUser()
    return (
        <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
            <NavLink to='/'>
            <img src={assets.logo} className='w-28 lg:w-32' alt=""/>
            </NavLink>
            <div className='flex items-center gap-10'>
                <p>Привет! {user ? user.fullName : "Developers"}</p>
                {user ? <UserButton/> : <img src={assets.profile_img} className='max-w-8' alt=""/>}
            </div>
        </div>
    )
}
export default Navbar
