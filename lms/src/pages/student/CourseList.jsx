import React, {useContext, useEffect, useState} from 'react'
import {LmsContext} from "../../context/LmsContext.jsx";
import SearchBar from "../../components/student/SearchBar.jsx";
import {useNavigate, useParams} from "react-router-dom";
import CourseCard from "../../components/student/CourseCard.jsx";
import {assets} from "../../assets/assets.js";
import Footer from "../../components/student/Footer.jsx";

const CourseList = () => {

    const navigate = useNavigate()
    const {allCourses} = useContext(LmsContext)
    const {input} = useParams()

    const [filteredCourse, setFilteredCourse] = useState([])

    useEffect(() => {
        if (allCourses && allCourses.length > 0) {
            const tempCourses = allCourses.slice()

            input ? setFilteredCourse(tempCourses.filter((item) => {
                return item.courseTitle.toLowerCase().includes(input.toLowerCase())
            })) : setFilteredCourse(tempCourses)
        }
    }, [allCourses, input])

    return (
        <>
            <div className='relative md:px-36 px-8 pt-20 text-left'>
                <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
                    <div >

                        <h1 className='text-4xl font-semibold text-gray-800'>Список курсов</h1>
                        <p className='text-gray-500' >
                            <span onClick={() => navigate('/')} className='text-blue-600 cursor-pointer' >Главная страница</span>  / <span>Список курсов</span>
                        </p>
                    </div>
                    <SearchBar data={input}/>
                </div>

                { input && <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 mb-8 text-gray-600'>
                    <p>{input}</p>
                    <img onClick={() => {
                        navigate('/course-list')

                    }} src={assets.cross_icon} alt="" className='cursor-pointer'/>
                </div>

                }


                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-colst-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0'>
                    {filteredCourse.map((course, index) => <CourseCard course={course} key={index}/>)}
                </div>
            </div>
            <Footer/>
        </>
    )
}
export default CourseList
