import React, { useState } from 'react'
import logoImage from '../../../assets/global/sonbola.svg'
import logoText from 'assets/constant/logo/textSonbola.svg'
import arrowRight from '../../../assets/admin/arrow-right.svg'
import { useNavigate } from 'react-router-dom'
import { MdDashboard } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import { RiShoppingBag2Fill } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { FaFilterCircleDollar } from "react-icons/fa6";
import { FaShop } from "react-icons/fa6";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { useAtom } from 'jotai'
import { openAdminSidebar } from 'src/lib/jotai'
import { FaThumbsUp } from "react-icons/fa6";
import { MdAdminPanelSettings } from "react-icons/md";

const AdminSidebar = () => {
    // get path from useLocation
    const path = window.location.pathname;
    // console.log(path)
    const navigate = useNavigate();
    const [open, setOpen] = useAtom(openAdminSidebar);
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const [selectedSubmenu, setSelectedSubmenu] = useState('');

    const menus = [
        { title: 'Dashboard', icon: <MdDashboard className={`${!open && 'min-w-5'} text-primary-color me-2`} />, link: '/admin-dashboard' },
        { title: 'Platform Support', icon: <FaThumbsUp className={`${!open && 'min-w-5'} text-primary-color me-2`} />, link: '/support-ticket-list' },
        { title: 'Admin Warehouse', icon: <MdAdminPanelSettings className={`${!open && 'min-w-5'} text-primary-color me-2`} />, link: '/super-admin-capability' },
        {
            title: 'Product', icon: <RiShoppingBag2Fill className={`${!open && 'min-w-5'} text-primary-color me-2`} />,
            subMenus: [
                { title: 'Product List', link: '/product-list' },
                { title: 'Categories', link: '/category' },
                { title: 'Reviews', link: '/all-review' },
            ]
        },

        {
            title: 'Customers', icon: <FaUserFriends className={`${!open && 'min-w-5'} text-primary-color me-2`} />, subMenus: [
                { title: 'All Customers', link: '/customer-list' },
                { title: 'Verfied Customers', link: '/varified-customer-list' },
                { title: 'Unverified Customers', link: '/unvarified-customer-list' },
            ]
        },
        {
            title: 'Refunds', icon: <FaFilterCircleDollar className={`${!open && 'min-w-5'} text-primary-color me-2`} />, subMenus: [
                { title: 'Refund Settings', link: '/refund-settings' },
                { title: 'All Refunds', link: '/refund-list' },
                // { title: 'Pending Refunds', link: '/admin-dashboard' },
                // { title: 'Approved Refunds', link: '/admin-dashboard' },
                // { title: 'Rejected Refunds', link: '/admin-dashboard' },
            ]
        },
        {
            title: 'Vendor', icon: <FaShop className={`${!open && 'min-w-5'} text-primary-color me-2`} />, subMenus: [
                { title: 'Vendor List', link: '/vendor-list' },
                { title: 'Pending Vendor', link: '/pending-vendor-list' },
                { title: 'Approved Vendor', link: '/approved-vendor-list' },
                { title: 'Rejected Vendor', link: '/rejected-vendor-list' },
            ]
        },
        {
            title: 'Orders', icon: <HiMiniShoppingBag className={`${!open && 'min-w-5'} text-primary-color me-2`} />, subMenus: [
                { title: 'All Orders', link: '/all-orders-list' },
                { title: 'Pending Orders', link: '/pending-orders-list' },
                { title: 'Processing Orders', link: '/processing-orders-list' },
                { title: 'Shipped Orders', link: '/shipped-order-list' },
                { title: 'Delivered Orders', link: '/delivered-ordered-list' },
            ]
        },

    ]
    // console.log(selectedSubmenu)
    return (
        <div
            className={`w-full duration-300 fixed ${open ? 'max-w-[230px]' : 'max-w-[70px]'} 
            bg-gray-900 h-full min-h-dvh py-[20px] font-main px-4 text-primary-color overflow-y-auto admin-scroll`
            }
        >
            <div className='flex justify-start items-center gap-2'>
                <div className={`flex items-center gap-2 cursor-pointer ${open ? 'block' : 'hidden'}`} onClick={() => navigate('/admin-dashboard')}>
                    <img src={logoImage} alt='logo' className='w-[25px] h-[30px]' />
                    <img src={logoText} alt='logo' className='w-[90px] h-[35px]' />
                </div>
                {
                    <img src={arrowRight} alt='logo' onClick={() => setOpen(!open)} className={`w-[30px] h-[25px] cursor-pointer ${open && 'ms-5 rotate-180'}`} />
                }
            </div>
            <ul className='text-primary-color mt-6'>
                {menus.map((item, index) => {
                    const isSelectedMenu = selectedSubmenu === item.title;
                    const hasSubmenus = item.subMenus && item.subMenus.length > 0;

                    return (
                        <div
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent event bubbling
                                if (hasSubmenus) {
                                    if (isSelectedMenu) {
                                        setSubmenuOpen(!submenuOpen); // Toggle submenuOpen state
                                    } else {
                                        setSubmenuOpen(true);
                                        setSelectedSubmenu(item.title);
                                    }
                                } else {
                                    // Close any open submenu when a menu item without a submenu is clicked
                                    setSubmenuOpen(false);
                                    setSelectedSubmenu(''); // Optionally clear the selected submenu
                                    navigate(item.link);
                                }
                            }}
                            className={`flex items-center justify-center mt-2 text-primary-color hover:text-tertiary-500 hover:bg-gray-800 rounded-md cursor-pointer ${submenuOpen && isSelectedMenu ? 'flex-col text-tertiary-500 bg-gray-800' : ''} ${open ? 'px-3' : 'px-1 ps-[10px]'} py-3`}
                        >
                            <p className='text-sm font-medium flex justify-start items-center w-full'>
                                {item.icon}
                                {open && <span>{item.title}</span>}
                                {hasSubmenus && open && (
                                    <GoArrowRight
                                        className={`w-[15px] h-[15px] cursor-pointer transition ms-auto ${isSelectedMenu && submenuOpen ? 'rotate-90 text-amber-500' : ''
                                            }`}
                                    />
                                )}
                            </p>
                            {submenuOpen && isSelectedMenu && hasSubmenus && open && (
                                <div className='flex flex-col gap-2 mt-2 w-full'>
                                    {item.subMenus.map((submenuItem, subIndex) => (
                                        <li
                                            key={subIndex}
                                            className={`${subIndex === 0 && 'mt-2'
                                                } hover:bg-gray-700 rounded-md transition duration-100 p-2 w-full text-sm font-medium flex justify-start items-center`}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent event bubbling to parent div
                                                navigate(submenuItem.link);
                                            }}
                                        >
                                            <span className='w-1 h-1 bg-gray-100 me-2 rounded-full'></span>
                                            <span className={`text-primary-color`}>{submenuItem.title}</span>
                                        </li>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </ul>
            
        </div>
    );
}

export default AdminSidebar