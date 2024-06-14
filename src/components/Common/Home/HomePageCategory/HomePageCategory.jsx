import React from 'react'
import categoryImage from 'assets/global/home/category.svg'
import { MdKeyboardArrowRight } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const HomePageCategory = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const navigate = useNavigate()

    const { isPending, isError, error, data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_PATH}/categories/get-all?sortBy=-weight_matrics`);
            return response?.data?.categories || [];
        },
    });
    console.log(isPending, isError, error, categories)
    return (
        <div className='font-main'>
            <div className='flex justify-between'>
                <div className='flex gap-2 items-center'>
                    <img src={categoryImage} alt="icon" />
                    <p>{t('vendor_home.categories')}</p>
                </div>
                <div
                    className='flex items-center gap-2 cursor-pointer'
                    onClick={() => {
                        navigate('/product-catalogue')
                    }}
                >
                    <p>{t('vendor_home.view_all')}</p>
                    <MdKeyboardArrowRight className={currentLanguage == 'ar' && 'rotate-180'} />
                </div>
            </div>
            {/* Mapping categories */}
            <div className='grid md:grid-cols-6 grid-cols-2 gap-4 mt-4'>
                {categories?.map((item, index) => (
                    <div key={index} className='text-center flex justify-start items-center py-2 w-[95%] mx-auto cursor-pointer' style={{
                        boxShadow: '0px 1px 3px 0px #03004717'
                    }} >
                        <img src={item.image} alt={item.name} className='w-10 h-10 rounded-lg mx-2' />
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomePageCategory