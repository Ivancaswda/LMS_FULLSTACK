import React, {useContext, useEffect, useState} from 'react'
import {LmsContext} from "../../context/LmsContext.jsx";
import Loading from "../../components/student/Loading.jsx";

const MyCourses = () => {

    const {allCourses} = useContext(LmsContext)
    const [courses, setCourses] = useState(null)

    const fetchEducatorCourses = async () => {
        setCourses(allCourses)
    }
    useEffect(() => {
        fetchEducatorCourses()
    })


    return !courses ? <Loading/> : (
        <div className='h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
            <div className='w-full'>
                    <h2 className='pb-4 text-lg font-medium'>Мои курсы</h2>
                <div>
                    <table className='md:table-auto table-fixed w-full overflow-hidden'>
                        <thead className={'text-gray-900 border-b border-gray-500/20 text-sm'}>
                            <tr>
                                <th className='px-4 py-3 font-semibold truncate text-left'>Все курсы</th>
                                <th className='px-4 py-3 font-semibold truncate text-left'>Заработано</th>
                                <th className='px-4 py-3 font-semibold truncate text-left'>Студенты</th>
                                <th className='px-4 py-3 font-semibold truncate text-left'>Опубликовано</th>
                            </tr>
                        </thead>
                        <tbody className='text-sm text-gray-500'>
                            {courses.map((course, index) => (
                                <tr key={index} className='border-b border-gray-500/20'>
                                    <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate'>
                                        <img className='w-16' src={course.courseThumbnail} alt=""/>
                                        <span className='truncate hidden md:block'>{course.courseTitle}</span>
                                    </td>
                                    <td className='px-4 py-3'> {/* price - discount*/}
                                        {Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))}
                                    р</td>
                                    <td className='px-4 py-3'>
                                        {course.enrolledStudents.length}
                                    </td>

                                    <td className='px-4 py-3'>
                                        {new Date(course.createdAt).toLocaleDateString()}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default MyCourses
