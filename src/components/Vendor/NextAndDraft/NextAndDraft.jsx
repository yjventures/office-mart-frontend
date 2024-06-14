import { useAtom } from 'jotai'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { newProductAtom } from 'src/lib/jotai'

const NextAndDraft = ({link}) => {
    const navigate = useNavigate()
    const [productAtom, setProductAtom] = useAtom(newProductAtom)
    
    return (
        <div div className='flex justify-start items-center mt-[20px] gap-3' >
            <p
                // next button navigate to inventory page
                onClick={() => navigate(link)}
                className='text-[12px] font-[600] bg-[#4E97FD] text-primary-color px-4 h-[34px] rounded-sm cursor-pointer flex justify-center items-center'>
                Next
            </p>

            <p className='text-[12px] font-[600] bg-header-background text-primary-color px-4 h-[34px] rounded-sm cursor-pointer flex justify-center items-center'>
                Save Draft
            </p>

        </div >
    )
}

export default NextAndDraft