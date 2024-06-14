import React from 'react'

const Spinner = () => {
    return (
        <div className='w-[100%] bg-tertiary-600 hover:bg-tertiary-700 transition flex justify-center items-center text-primary-color h-[44px] cursor-pointer rounded-sm'>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
    )
}

export default Spinner