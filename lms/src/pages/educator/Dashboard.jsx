import React, {useEffect, useState} from 'react'
import {assets, dummyDashboardData} from "../../assets/assets.js";
import Loading from "../../components/student/Loading.jsx";

const Dashboard = () => {

    const [dashboardData, setDashboardData] = useState(null)

    const fetchDashboardData = async () => {
        setDashboardData(dummyDashboardData)
    }
    useEffect(() => {
        fetchDashboardData()
    }, [])
    return !dashboardData ? (<Loading/>) : (
        <div className='min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
            <div className='space-y-5'>
                <div className='flex flex-wrap gap-5 items-center'>
                    <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
                        <img src={assets.patients_icon} alt=""/>
                        <div>
                            <p className='text-2xl font-medium text-gray-600'>{dashboardData.enrolledStudentsData.length}</p>
                            <p className='text-base text-gray-500'>Все записи</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
                        <img src={assets.appointments_icon} alt=""/>
                        <div>
                            <p className='text-2xl font-medium text-gray-600'>{dashboardData.totalCourses}</p>
                            <p className='text-base text-gray-500'>Все курсы</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
                        <img src={assets.earning_icon} alt=""/>
                        <div>
                            <p className='text-2xl font-medium text-gray-600'>{dashboardData.totalEarnings}р</p>
                            <p className='text-base text-gray-500'>Заработано</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className='pb-4 text-lg font-medium'>Последние записи</h2>
                    <div className='flex flex-col items-center max-w-4xl w-full
                     overflow-hidden rounded-md bg-white border border-gray-500/20'>
                        <table className='table-fixed md:table-auto w-full overflow-hidden'>
                            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
                                <tr>
                                    <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
                                    <th className='px-4 py-3 font-semibold'>Имя ученика</th>
                                    <th className='px-4 py-3 font-semibold'>Название курса</th>
                                </tr>
                            </thead>
                             <tbody className='text-sm text-gray-500'>
                                    {dashboardData.enrolledStudentsData.map((item, index) => (
                                        <tr className='border-b border-gray-500/20' key={index}>
                                            <td className='px-4 py-3 text-center hidden sm:table-cell'>
                                                {index + 1}
                                            </td>
                                            <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                                                <img src={item.student.imageUrl} className='w-9 h-9 rounded-full' alt=""/>
                                                <span className='truncate'>{item.student.name}</span>
                                            </td>
                                            <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Dashboard
