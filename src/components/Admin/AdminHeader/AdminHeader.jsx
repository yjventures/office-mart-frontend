import React, { useState } from 'react'
import { RiLogoutCircleRLine, RiMenu2Line } from "react-icons/ri";
import { FaGlobe } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { MdPerson } from "react-icons/md";
import { showToast } from '../../Common/Toastify/Toastify';
import { useAtom } from 'jotai';
import { openAdminSidebar } from 'src/lib/jotai';
import { IoSearchOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ browseWebsite = false, addNew = false, addNewText, handleAdd, search = false, notification = false, profile = false, setSearch, nameOfSearching }) => {
    const [open, setOpen] = useAtom(openAdminSidebar);
    const [showLogout, setShowLogout] = useState(false)
    const navigate = useNavigate()
    return (
        <div
            onClick={() => {
                setShowLogout(false)
            }}
            className='bg-white w-full py-5 px-3 font-main flex justify-between items-start md:items-center flex-col md:flex-row gap-y-3 md:gap-y-0'>
            {/* left part of design */}
            <div className='flex justify-around items-center gap-3 '>
                {/* menu button */}
                {/* <div className='w-[42px] h-[42px] bg-gray-100 flex justify-center items-center rounded-md cursor-pointer'
                    // on click event
                    onClick={() => {
                        setOpen(!open)
                    }}>
                    <RiMenu2Line className=' text-gray-600 ' />
                </div> */}

                {/* browse button */}
                {
                    browseWebsite && <div className='flex bg-gray-100 justify-center gap-2 items-center rounded-md cursor-pointer px-[12px] py-[7px] mr-4'
                        // on click event
                        onClick={() => {
                            window.open(`${import.meta.env.VITE_FRONTEND_PATH}`, '_blank')
                        }}>
                        <FaGlobe className=' text-gray-600 ' />
                        <p className='font-[600] text-[14px] whitespace-nowrap'> Browse Website</p>
                    </div>
                }


                {/* Add new button */}
                {
                    addNew && <div
                        className='flex bg-black text-white justify-center gap-2 items-center rounded-md cursor-pointer px-[12px] py-[6px]'
                        onClick={handleAdd}
                    >
                        <FaPlus />
                        <p className='font-[600] text-[14px] capitalize '>Add New {addNewText}</p>
                    </div>
                }
            </div>
            {/* right part of design */}
            <div className='flex items-center justify-end gap-3 w-full max-w-[600px] '>
                {/* search */}
                {search && (
                    <div className='relative w-full'>
                        <input
                            type="text"
                            placeholder={`Search for ${nameOfSearching}...`}
                            onChange={(e) => setSearch(e.target.value.toLowerCase())} // Update search state
                            className='bg-gray-100 px-2 py-[5px] outline-none block w-full rounded-sm'
                        />
                        <IoSearchOutline className='absolute top-[8px] right-3 text-gray-400' />
                    </div>

                )}
                {/* notification */}
                {
                    notification &&
                    <IoIosNotifications className='text-2xl text-gray-600 cursor-pointer' />
                }
                {/* Profile */}
                <div className='relative'>
                    {
                        profile &&
                        <MdPerson className='text-2xl text-gray-600 hover:text-white cursor-pointer bg-gray-100 hover:bg-gray-600 transition rounded-full p-1 w-8 h-8'
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowLogout(!showLogout)
                            }}
                        />
                    }
                    {
                        showLogout &&
                        <p className='absolute top-10 -left-24 bg-white min-w-28 shadow-md rounded-md'>
                            <button className='py-2 px-6 w-full text-black flex items-center gap-3'
                                onClick={() => {
                                    localStorage.clear();
                                    navigate('/admin-signin')
                                }}
                            >
                                <RiLogoutCircleRLine />
                                Logout
                            </button>
                        </p>
                    }
                </div>


            </div>

        </div>
    )
}

export default AdminHeader