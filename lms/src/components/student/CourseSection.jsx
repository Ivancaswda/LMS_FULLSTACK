import React, {useContext} from 'react'
import {NavLink} from "react-router-dom";
import {LmsContext} from "../../context/LmsContext.jsx";
import CourseCard from "./CourseCard.jsx";

const CourseSection = () => {

    const {allCourses} = useContext(LmsContext)

    return (
        <div className='py-16 md:px-40 px-8'>
            <h2 className='text-3xl font-medium text-gray-800'>Учись от лучших</h2>
            <p className='text-sm md:text-base  text-gray-500 mt-3'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. <br/> Accusamus earum libero nam quos, reiciendis voluptates? Consectetur eum itaque praesentium quidem!</p>

            {/*4 курса */}
            <div className='grid grid-cols-auto px-4 md:px-0 md:my-16 my-10 gap-4'>
                {allCourses.slice(0,4).map((course, index) => <CourseCard course={course} key={index}/>)}
            </div>

            <NavLink to='/course-list' onClick={() => scrollTo(0,0)}
             className='text-gray-500 border border-gray-500/30 px-10 py-3 rounded'
            >Показать все курсы</NavLink>
        </div>
    )
}
export default CourseSection
