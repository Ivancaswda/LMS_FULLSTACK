import React, {useContext, useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import {LmsContext} from "../../context/LmsContext.jsx";
import Loading from "../../components/student/Loading.jsx";
import {assets} from "../../assets/assets.js";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer.jsx";

const CourseDetails = () => {
    // we have to find individual course using id in link tab
    const {id} = useParams()
    const [courseData, setCourseData] = useState(null)
    const [openSection, setOpenSection] = useState(true)
    const {allCourses, calculateRating, calculateChapterTime, calculateNumberOfLectures, calculateCourseDuration} = useContext(LmsContext)
    const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(true)
    const [playerData, setPlayerData] = useState(null)
    const fetchCourseData = async () => {
      const findCourse =  allCourses.find(course => course._id === id) // if course id in params matches id of all courses
        setCourseData(findCourse)
    }
    useEffect(() => {
        fetchCourseData()

    }, [allCourses])

    const toggleSection = (index) => {
        setOpenSection((prevState) => ( // we`re using index as understand which of the two element we should conceal
            {...prevState, [index]: !prevState[index]}
        ))
    }

    return !courseData ? (<Loading/>) : (
        <>
            <div
                className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 text-left'>
                <div className='absolute top-0 left-0 w-full h-section-height  -z-1 bg-gradient-to-b from-cyan-100/70'>
                </div>
                {/* left column */}
                <div className='max-w-xl z-10 text-gray-500 mt-20'>
                    <h1 className='md:text-course-details-heading-large text-course-details-headeing-small font-semibold text-gray-800'>{courseData.courseTitle}</h1>
                    <p className='text-sm pt-4 md:text-base'
                       dangerouslySetInnerHTML={{__html: courseData.courseDescription.slice(0, 200)}}></p>

                    {/* review and ratings */}
                    <div className='flex items-center space-x-2 pt-3 pb-1'>
                        <p>{calculateRating(courseData)}</p>  {/* will add 5 img tag star */}
                        <div className='flex'>
                            {[...Array(5)].map((item, index) => (
                                <img className='w-3.5 h-3.5' key={index}
                                     src={index < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank}
                                     alt=""/>
                            ))}
                        </div>
                        <p className='text-gray-500'>({courseData.courseRatings.length} {courseData.courseRatings > 1 ? 'Отзывы' : 'Отзыв'})</p>
                        <p>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'Учеников' : "Ученик"}</p>
                    </div>

                    <p className='text-sm'>Курс by <span className='text-blue-600 underline'>aIvanius</span></p>
                    <div className={'pt-8 text-gray-800'}>
                        <h2 className='text-xl font-semibold'>Структура курса</h2>

                        <div className='pt-5'>
                            {courseData.courseContent.map((chapter, index) => (
                                <div className={'border border-gray-300 bg-white mb-2 rounded'} key={index}>
                                    <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'
                                         onClick={() => toggleSection(index)}>
                                        <div className='flex items-center gap-2'>
                                            <img className={`transform transition-all ${openSection[index] ? 'rotate-180' : ''} `} src={assets.down_arrow_icon} alt=""/>
                                            <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                                        </div>
                                        <p className='text-sm md:text-default'>{chapter.chapterContent.length} Лекции - {calculateChapterTime(chapter)}</p>
                                    </div>
                                    <div className={`overflow-hidden transition-all duration-300 ${openSection[index] ? 'max-h-96' : 'max-h-0'}`} >
                                        <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                                            {chapter.chapterContent.map((lecture, index) => (
                                                <li className='flex items-start gap-2 py-1' key={index}>
                                                    <img src={assets.play_icon} className='w-4 h-4 mt-1' alt="play icon"/>
                                                    <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                                                        <p>{lecture.lectureTitle}</p>
                                                        <div className='flex gap-2'>
                                                            {lecture.isPreviewFree && <p onClick={() => setPlayerData({
                                                                videoId: lecture.lectureUrl.split('/').pop()
                                                            })} className='text-blue-500 cursor-pointer'>Превью</p>}
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

                    </div>
                    <div className='py-20 text-sm md:text-default'>
                        <h3 className='text-sm font-semibold text-gray-800'>Описание курса</h3>
                        <p className=' pt-3 rich-text'
                           dangerouslySetInnerHTML={{__html: courseData.courseDescription}}></p>
                        {/* for not displaying html tags in text */}
                    </div>
                </div>

                {/* review and rating */}

                {/* right colums */}
                <div className='max-w-course-card z-10 shadow-custom-card rounded-t mt-20
                 md:rounded-none overflow-hidden bg-white min-w-[300px] min-w-[300px] sm:min-w-[420px]'>
                    {
                        playerData ? <YouTube videoId={playerData.videoId} opts={{playerVars: {
                                    autoplay: 1
                                }
                            }} iframeClassName='w-full aspect-video' /> :
                            <img src={courseData.courseThumbnail} className='' alt=""/>
                    }
                    <div className='p-5'>
                        <div className='flex items-center gap-2 '>
                            <img src={assets.time_left_clock_icon} alt=""/>

                            <p className='text-red-500'>Осталось <span className='font-medium'>5 дней</span> по этой цене</p>
                        </div>
                        <div className='flex gap-3 items-center pt-2'>
                            <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}р</p>
                            <p className='md:text-lg text-gray-500 line-through'>{courseData.coursePrice}р</p>
                            <p className={'md:text-lg text-gray-500 underline'}>{courseData.discount}% </p>
                        </div>
                        <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
                            <div className='flex items-center gap-2'>
                                <img src={assets.star} alt=""/>
                                <p>{calculateRating(courseData)}</p>
                            </div>
                            <div className='h-4 w-px bg-gray-500/40'></div>

                            <div className='flex items-center gap-1'>
                                <img src={assets.time_clock_icon} alt=""/>
                                <p>{calculateCourseDuration(courseData)}</p>
                            </div>
                            <div className='h-4 w-px bg-gray-500/40'></div>

                            <div className='flex items-center gap-1'>
                                <img src={assets.lesson_icon} alt=""/>
                                <p>{calculateNumberOfLectures(courseData)} уроков</p>
                            </div>

                        </div>
                        <button className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium'>
                            {isAlreadyEnrolled ? 'Уже назначeно' : 'Назначить сейчас'}
                        </button>
                        <div>
                            <p className='md:text-xl text-lg font-medium text-gray-800'>Что входит в курс?</p>
                            <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500'>
                                <li>Lorem ipsum dolor.</li>
                                <li>Lorem ipsum dolor.</li>
                                <li>Lorem ipsum dolor.</li>
                                <li>Lorem ipsum dolor.</li>
                                <li>Lorem ipsum dolor.</li>
                                <li>Lorem ipsum dolor.</li>
                                <li>Lorem ipsum dolor.</li>
                            </ul>
                        </div>
                    </div>

                </div>

            </div>
            <Footer/>
        </>
    )
}
export default CourseDetails
