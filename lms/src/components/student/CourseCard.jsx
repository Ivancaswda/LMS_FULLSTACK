import React, {useContext} from 'react'
import {assets} from "../../assets/assets.js";
import {NavLink} from "react-router-dom";
import {LmsContext} from "../../context/LmsContext.jsx";

const CourseCard = ({course}) => {
    const {calculateRating} = useContext(LmsContext)
    return (

        <NavLink className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg ' to={'/course/' + course._id} onClick={() => scrollTo(0,0)}>
            {/* opens individual page for each coursse */}
            <img  className='w-full' src={course.courseThumbnail} alt=""/>
            <div className='p-3 text-left'>
                <h3 className='text-base font-semibold' >{course.courseTitle}</h3>
                <p className='text-gray-500'>aIvanius</p>
                <div className='flex items-center space-x-2'>
                    <p>{calculateRating(course)}</p>  {/* will add 5 img tag star */}
                    <div className='flex'>
                        {[...Array(5)].map((item, index) => (
                            <img className='w-3.5 h-3.5' key={index} src={index < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} alt=""/>
                        ))}
                    </div>
                    <p className='text-gray-500'>{course.courseRatings.length}</p>
                </div>
                <p className='text-base font-semibold text-gray-700'>{(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}р</p>

            </div>
        </NavLink>
    )
}
export default CourseCard

