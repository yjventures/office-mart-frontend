import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const ButtomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')))
    }, [location])
    return (
        <div className="fixed -bottom-2 left-0 z-50 w-full h-16 bg-header-background md:hidden">
            <div className={`grid ${user?.type == 'vendor' ? 'grid-cols-2' : 'grid-cols-4'} h-full max-w-lg mx-auto font-medium`}>
                <button type="button"
                    onClick={() => {
                        if (user?.type === 'vendor') {
                            navigate(`vendor-page?name=Oussay%20Maghrawi`)
                        } else {
                            navigate('/')
                        }
                    }}
                    className="inline-flex flex-col items-center justify-center px-5 group">
                    <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 mb-1 ' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>

                    <span className={`text-sm  group-hover:text-buttons ${(location.pathname == '/home' || location.pathname == '/') ? 'text-buttons' : 'text-gray-500'}`}>Home</span>
                </button>
                {/* wishlist and cart button */}
                {
                    user?.type !== 'vendor' && <>
                        <button type="button"
                            onClick={() => navigate('/wishlist')}
                            className="inline-flex flex-col items-center justify-center px-5 group">
                            <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 mb-1' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>

                            <span className={`text-sm  group-hover:text-buttons ${location.pathname == '/wishlist' ? 'text-buttons' : 'text-gray-500'}`}>Wishlist</span>
                        </button>
                        <button type="button"
                            onClick={() => navigate('/cart')}
                            className="inline-flex flex-col items-center justify-center px-5 group">
                            <svg xmlns="http://www.w3.org/2000/svg" className='w-7 h-7 ' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>

                            <span className={`text-sm  group-hover:text-buttons ${location.pathname == '/cart' ? 'text-buttons' : 'text-gray-500'}`}>Cart</span>
                        </button>
                    </>
                }

                <button
                    type="button"
                    onClick={() => {
                        if (user?.type === 'vendor') {
                            navigate('/vendor-dashboard')
                        } else {
                            navigate('/profile')
                        }
                    }}
                    className="inline-flex flex-col items-center justify-center px-5 group">
                    <svg xmlns="http://www.w3.org/2000/svg" className='w-7 h-7 ' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>

                    <span className={`text-sm  group-hover:text-buttons ${location.pathname == '/profile' ? 'text-buttons' : 'text-gray-500'}`}>Profile</span>
                </button>
            </div>
        </div>
    )
}

export default ButtomNav