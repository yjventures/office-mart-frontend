import React from 'react'
import AdminSidebar from '../components/Admin/AdminSIdebar/AdminSidebar'
import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/Admin/AdminHeader/AdminHeader'
import ScrollToTop from 'src/lib/helper/ScrollToTop'
import { openAdminSidebar } from 'src/lib/jotai'
import { useAtom } from 'jotai'

const AdminLayout = () => {
    const [open, setOpen] = useAtom(openAdminSidebar);
    return (
        <div className='max-w-12xl flex justify-start overflow-hidden'>
            <ScrollToTop />
            <div className='fixed'>
                <AdminSidebar />
            </div>
            <div className={`px-3 ${open ? 'ms-[230px]': 'ms-[70px]'} w-full`}>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout