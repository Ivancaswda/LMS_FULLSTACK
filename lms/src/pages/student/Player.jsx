import React, {useContext, useEffect, useState} from 'react'
import {assets} from "../../assets/assets.js";
import humanizeDuration from "humanize-duration";
import {LmsContext} from "../../context/LmsContext.jsx";
import {useParams} from "react-router-dom";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer.jsx";
import Rating from "../../components/student/Rating.jsx";
import axios from "axios";
import {toast} from "react-toastify";
import Loading from "../../components/student/Loading.jsx";
const Player = () => {

    const {enrolledCourses, calculateChapterTime, backendUrl, getToken, userData, fetchUserEnrolledCourses} = useContext(LmsContext)
    const {courseId} = useParams()
    const [courseData, setCourseData] = useState(null);
    const [openSection, setOpenSection] = useState({})
    const [playerData, setPlayerData] = useState(null)
    const [progressData, setProgressData] = useState(null)
    const [initialRating, setInitialRating] = useState(0)

    const getCourseData = () => {
            enrolledCourses.map((course) => {
                // defining right course data
                if (course._id === courseId) {
                    setCourseData(course)
                    course.courseRatings.map((item) => {
                        if (item.userId === userData._id) {
                            setInitialRating(item.rating)
                        }
                    })
                }
            })
    }


    useEffect(() => {
        if (enrolledCourses.length > 0) {
            getCourseData()
        }

    }, [enrolledCourses])

    const markLectureAsCompleted = async (lectureId) => {
        try {
            const token = await getToken()
            const {data} = await axios.post(backendUrl + '/api/user/update-course-progress', {courseId, lectureId},
                {headers: {Authorization: `Bearer ${token}`}})

            if (data.success) {
                toast.success(data.message)
                getCourseData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
        }
    }
        // getting latest data of progress of course
    const getCourseProgress = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.post(backendUrl + '/api/user/get-course-progress', {courseId}, {headers: {Authorization: `Bearer ${token}`}})
            if (data.success) {
                setProgressData(data.progressData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
        }
    }
    // function to rate the course

    const handleRate = async (rating) => {
        try {
            const token = await getToken()
            const {data} = await axios.post(backendUrl + '/api/user/add-rating', {courseId, rating}, {headers: {Authorization: `Bearer ${token}`}})

            if (data.success) {
                toast.success(data.message)
                fetchUserEnrolledCourses()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    useEffect(() => {
        getCourseProgress()
    }, [])
    const toggleSection = (index) => {
        setOpenSection((prevState) => ( // we`re using index as understand which of the two element we should conceal
            {...prevState, [index]: !prevState[index]}
        ))
    }


    return !courseData ? <Loading/> : (
        <>
            <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>

                {/* left column */}
                <div>
                    <h2 className='text-xl font-semibold'>Структура Курса</h2>
                    <div className='pt-5'>
                        {courseData && courseData.courseContent.map((chapter, index) => (
                            <div className={'border border-gray-300 bg-white mb-2 rounded'} key={index}>
                                <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'
                                     onClick={() => toggleSection(index)}>
                                    <div className='flex items-center gap-2'>
                                        <img
                                            className={`transform transition-all ${openSection[index] ? 'rotate-180' : ''} `}
                                            src={assets.down_arrow_icon} alt=""/>
                                        <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                                    </div>
                                    <p className='text-sm md:text-default'>{chapter.chapterContent.length} Лекции
                                        - {calculateChapterTime(chapter)}</p>
                                </div>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openSection[index] ? 'max-h-96' : 'max-h-0'}`}>
                                    <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                                        {chapter.chapterContent.map((lecture, index) => (
                                            <li className='flex items-start gap-2 py-1' key={index}>

                                                <img src={progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon} className='w-4 h-4 mt-1' alt="play icon"/>
                                                <div
                                                    className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                                                    <p>{lecture.lectureTitle}</p>
                                                    <div className='flex gap-2'>
                                                        {lecture.lectureUrl && <p onClick={() => setPlayerData({
                                                            ...lecture, chapter: index + 1, lecture: index + 1
                                                        })} className='text-blue-500 cursor-pointer'>Смотреть</p>}
                                                        <p className=''>{humanizeDuration(lecture.lectureDuration * 60 * 1000, {units: ['ч', 'м']})}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>


                            </div>
                        ))}
                    </div>

                    <div className='flex items-center gap-2 py-3 mt-10'>
                        <h1 className='text-xl font-bold'>Оцени этот курс:</h1>
                        <Rating initialRating={initialRating} onRate={handleRate}/>
                    </div>

                </div>
                {/* right column */}
                <div>
                    {playerData ? (<div>
                        <YouTube iframeClassName='w-full aspect-video' videoId={playerData.lectureUrl.split('/').pop()}

                        />
                        <div className='flex justify-between items-center mt-1'>
                            <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
                            <button onClick={() => {
                                markLectureAsCompleted(playerData.lectureId)  //already completed course
                            }} className={'text-blue-600'}>{progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? 'Закончен' : 'Закончить'}</button>
                        </div>
                    </div>) : (<img src={courseData ? courseData.courseThumbnail : ''} alt=""/>)}

                </div>

            </div>
            <Footer/>
        </>
    )
}
export default Player
