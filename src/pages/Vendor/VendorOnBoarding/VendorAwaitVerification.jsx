import React, { useEffect } from 'react'
import alertImage from 'assets/vendor/alert.svg'
import sidebarImage from 'assets/vendor/sidebar-image.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { shopAtom, tokenAtom, userAtom } from 'lib/jotai'
import axios from 'axios'
import { showToast } from 'src/components/Common/Toastify/Toastify'

const VendorAwaitVerification = () => {
  const token = useAtomValue(tokenAtom)
  const user = useAtomValue(userAtom)
  const navigate = useNavigate();
  const setShop = useSetAtom(shopAtom)
  // console.log(user)
  // console.log(JSON.parse(localStorage.getItem('token')).accessToken)

  if (JSON.parse(localStorage.getItem('token')).accessToken == null) {
    navigate('/singin?type=vendor')
  }

  const fetchAwaitingVerification = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_PATH}/users/user/${user?._id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
      }
    })
    // console.log(res?.data)
    if (res?.data?.user?.is_approved == true) {
      
      navigate('/vendor-dashboard')
      showToast('Your account is verified successfully', 'success')
    }

  }

  useEffect(() => {
    fetchAwaitingVerification()
  }, [user])

  return (
    <div className='max-w-7xl mx-auto py-60 lg:py-10 px-3 relative' >
      <div className='lg:grid lg:grid-cols-3'>
        <div className='hidden lg:block opacity-100'>
          <img src={sidebarImage} alt="sidebar" />
        </div>
        <div className='col-span-2 lg:col-span-0 opacity-100 w-full' style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%,-50%)'
        }}
        >
          <div className='flex flex-col justify-center items-center gap-4 text-center w-full'>
            <img src={alertImage} alt="icon" />
            <p className='text-gray-900 text-[24px] font-semibold'>Your account is awaiting verification!</p>
            <p className='text-gray-white text-[14px] text-center'>Your account is currently being verified. You will be notified via email once your account is verified.</p>
            {/* explore more */}
            <Link
              to="/vendor-home"
              className="mt-8 inline-flex items-center justify-center rounded-md bg-gray-900 px-8 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorAwaitVerification