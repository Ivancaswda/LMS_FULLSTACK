import {createContext, useEffect, useState} from "react";
import {dummyCourses} from "../assets/assets.js";
import humanizeDuration from 'humanize-duration'
import {useAuth, useUser} from "@clerk/clerk-react";
export const LmsContext = createContext()

export const LmsContextProvider = ({children}) => {

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(true)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const {getToken} = useAuth() // getting token
    const {user} = useUser()
    // Fetch All Courses
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses)
    }

    // function to calculate average dummy rating of course
    const calculateRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0;
        }
        // calculate total rating
        let totalRating = 0
        course.courseRatings.forEach((rating) => {
            totalRating += rating.rating
        })
        // return average rating
        return totalRating / course.courseRatings.length

    }

    // Fetch user enrolled courses
    const fetchUserEnrolledCourses = async  () => {
        setEnrolledCourses(dummyCourses)
    }



    // Function to Calculate course chapter time
    const calculateChapterTime = (chapter) => {
        let time = 0
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, {units: ['h', 'm']}) // getting total time in hours and minutes
    }

    // Function to CALCULATE COURSE DURATION
    const calculateCourseDuration = (course) => {
        let time= 0
        course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) => time += lecture.lectureDuration))
        return humanizeDuration(time * 60 * 1000, {units: ['h', 'm']}) // getting total time in hours and minutes
    }

    // Function to calculate to Number of lectures in the course
    const calculateNumberOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach((chapter) => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }
    useEffect(() => {
        fetchAllCourses()
        fetchUserEnrolledCourses()
    }, [])

    const logToken = async () => {
        console.log(await getToken())
    }

    useEffect(() => {
        if (user) {
            logToken()
        }
    }, [user])

    const value = {
        allCourses,
        calculateRating,
        isEducator,
        setIsEducator,
        calculateChapterTime,
        calculateNumberOfLectures,
        calculateCourseDuration,
        enrolledCourses,
        setEnrolledCourses


    }


    return (
        <LmsContext.Provider value={value}>
            {children}
        </LmsContext.Provider>
    )
}