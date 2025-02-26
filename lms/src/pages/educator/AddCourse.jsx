import React, {useEffect, useRef, useState} from 'react'
import uniqid  from 'uniqid'
import Quill from "quill";
import {assets} from "../../assets/assets.js";
const AddCourse = () => {

    const quillRef = useRef(null)
    const editorRef = useRef(null)

    const [courseTitle, setCourseTitle] = useState('')
    const [coursePrice, setCoursePrice] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [image, setImage] = useState(null)
    const [chapters, setChapters] = useState([])
    const [showPopup, setShowPopup] = useState(false)
    const [currentChapterId, setCurrentChapterId] = useState(null)

    const [lectureDetails, setLectureDetails]  =useState(
        {
            lectureTitle: '',
            lectureDuration: '',
            lectureUrl: '',
            isPreviewFree: false
        }
    )
    useEffect(() => {
        // adding rich text and initiate quill only once
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow'
            })
        }
    }, [])

    const handleChapter = (action, chapterId) => {
        if (action === 'add') {
            const title = prompt('Введите название главы: ')
            if (title) {
                const newChapter = {
                    chapterId: uniqid(),
                    chapterTitle: title,
                    chapterContent: [],
                    collapsed: false,
                    chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1
                };
                setChapters([...chapters, newChapter])
            } else if (action === 'remove') {
                setChapters(chapters.filter((chapter) => {
                    return chapter.chapterId !== chapterId
                }))
            } else if (action === 'toggle') {
                setChapters(chapters.map((chapter) =>
                    chapter.chapterId === chapterId ?
                        {...chapter, collapsed: !chapter.collapsed} : chapter))
            }
        }
    }
    // function to add lecture
    const handleLecture = (action, chapterId, lectureIndex) => {
        if (action === 'add') {
            setCurrentChapterId(chapterId)
            setShowPopup(true)
        } else if (action === 'remove') {
            setChapters(chapters.map((chapter) => {
                if (chapter.chapterId === chapterId) {
                    chapter.chapterContent.splice(lectureIndex, 1)  // remove lecture
                }
                return chapter
            }))
        }
    }

    const addLecture = () => {
            setChapters(
                chapters.map((chapter) => {
                    if (chapter.chapterId === currentChapterId) {
                        const newLecture = {
                            ...lectureDetails,
                            lectureOrder: chapter.chapterContent.length > 0 ? chapter.
                            chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
                            lectureId: uniqid()
                        };
                        chapter.chapterContent.push(newLecture)
                    }
                    return chapter
                })
            )
        setShowPopup(false)
        setLectureDetails({
            lectureTitle: '',
            lectureDuration: '',
            lectureUrl: '',
            isPreviewFree: false,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
    }


    return (
        <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 p-4 pt-8 pb-0'>
            <form onSubmit={handleSubmit} action="">
                <div className='flex flex-col gap-1'>
                    <p>Название курса</p>
                    <input onChange={(event) => {
                        setCourseTitle(event.target.value)
                    }} value={courseTitle} placeholder='Напишите название' className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' required={true} type="text"/>
                </div>
                <div className='flex flex-col gap-1'>
                    <p>Описание курса</p>
                    <div ref={editorRef}></div>
                </div>

                <div className='flex items-center justify-between flex-wrap'>
                    <div className='flex flex-col gap-1'>
                        <p>Цена курса</p>
                        <input type="number" onChange={e => setCoursePrice(e.target.value)}
                            value={coursePrice} placeholder='0' className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' required={true}
                        />
                    </div>

                    <div className='flex md:flex-row flex-col items-center gap-3'>
                        <p>Изображение курса</p>
                        <label htmlFor="thumbnailImage" className='flex items-center gap-3'>
                            <img src={assets.file_upload_icon} className={'p-3 bg-blue-500 rounded'} alt=""/>
                            <input type="text" id='thumnailImage'
                                   onChange={e => setImage(e.target.files[0])} accept='image/*' hidden={true}/>
                            <img src={image ? URL.createObjectURL(image) : ''} className='max-h-10' alt=""/>
                        </label>
                    </div>
                </div>

                <div className='flex flex-col gap-1'>
                    <p>Скидка %</p>
                    <input type="text" placeholder='0' required={true} className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' onChange={(event) => {
                        setDiscount(event.target.value)
                    }}/>
                </div>
                {/* Adding chapters and lectures */}
                <div>
                    {chapters.map((chapter, index) => (
                        <div key={index} className='bg-white border rounded-lg mb-4'>
                            <div className='flex justify-between items-center p-4 border-b'>
                                <div className='flex items-center'>
                                        <img onClick={() => handleChapter('toggle', chapter.chapterId)} src={assets.dropdown_icon} className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && '-rotate-90'}`} width={14} alt=""/>
                                    <span className='font-semibold'>{index + 1} {chapter.chapterTitle}</span>
                                </div>
                                <span className={'text-gray-500'}>{chapter.chapterContent.length} Уроки</span>
                                <img onClick={() => handleChapter('remove', chapter.chapterId)} src={assets.cross_icon} className='cursor-pointer' alt=""/>
                            </div>
                            {!chapter.collapsed && (
                                <div className={'p-4'}>
                                    {chapter.chapterContent.map((lecture, index) => (
                                        <div key={index} className='flex justify-between items-center mb-2'>
                                            <span>{index + 1} {lecture.lectureTitle} - {lecture.lectureDuration} минуты - <a
                                                href={lecture.lectureUrl} target='_blank' className='text-blue-500'>Link </a>
                                                - {lecture.isPreviewFree ? 'Посмотреть бесплатно' : 'Платно'}
                                            </span>
                                            <img onClick={() => handleLecture('remove', chapter.chapterId)} src={assets.cross_icon} className='cursor-pointer' alt=""/>
                                        </div>
                                    ))}
                                    <div onClick={() => handleLecture('add', chapter.chapterId, 0)} className='inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2'>
                                        + Добавить урок
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div onClick={() => handleChapter('add')} className='flex justify-center items-center bg-blue-100 my-4 p-2 rounded-lg cursor-pointer'>
                    + Добавить главу
                </div>
                {showPopup && (
                    <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
                        <div className='bg-white text-gray-700 p-4 rounded relative w-full max-w-80'>
                            <h2 className='text-lg font-semibold md-4'>+ Добавить урок</h2>

                            <div className='mb-2'>
                                <p>Название лекции</p>
                                <input value={lectureDetails.lectureTitle} onChange={(event) => {
                                    setLectureDetails({...lectureDetails, lectureTitle: event.target.value})
                                }}
                                       type="text" className='mt-1 block w-full border rounded py-1 px-2'/>
                            </div>

                            <div className='mb-2'>
                                <p>Длительность (минут)</p>
                                <input value={lectureDetails.lectureDuration} onChange={(event) => {
                                    setLectureDetails({...lectureDetails, lectureDuration: event.target.value})
                                }}
                                       type="number" className='mt-1 block w-full border rounded py-1 px-2'/>
                            </div>


                            <div className='mb-2'>
                                <p>URL лекции</p>
                                <input value={lectureDetails.lectureUrl} onChange={(event) => {
                                    setLectureDetails({...lectureDetails, lectureUrl: event.target.value})
                                }}
                                       type="text" className='mt-1 block w-full border rounded py-1 px-2'/>
                            </div>

                            <div className='flex gap-2 my-2'>
                                <p>Is Preview Free?</p>
                                <input type="checkbox"
                                       className='mt-1 scale-125' checked={lectureDetails.isPreviewFree}
                                        onChange={(event) => setLectureDetails({...lectureDetails, isPreviewFree: event.target.checked})}/>
                            </div>

                            <button onClick={addLecture} type='button' className='w-full bg-blue-400 text-white px-4 py-2 rounded'>Добавить</button>

                            <img src={assets.cross_icon} className='absolute top-4 right-4 w-4 cursor-pointer'
                                 onClick={() => setShowPopup(false)} alt=""/>

                        </div>
                    </div>
                )}
                <button type='submit' className='bg-black text-white w-max py-2.5  px-8 rounded my-4'>ДОБАВИТЬ</button>
            </form>
        </div>
    )
}
export default AddCourse
