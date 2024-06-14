import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom'
import { MdKeyboardArrowRight } from "react-icons/md";
import VendorPageInfo from 'src/components/Vendor/VendorPage/VendorPageInfo';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';


function VendorPage() {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const [searchParams] = useSearchParams();
    const [name, setName] = useState(searchParams.get('name')) 
    console.log(name)

    const { isPending, isError, error, data: shopInfo } = useQuery({
        queryKey: ['shopInfo', name],
        queryFn: async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_PATH}/shops/get-all?name=${name}`)
                // console.log(response.data)
                return response?.data?.shop[0]
            } catch (error) {
                console.error(`Error fetching data`);
            }
        }
    })

    // console.log(shopInfo)

    return (
        <div className='h-full p-3 font-main max-w-7xl mx-auto' dir={currentLanguage == 'ar' && 'rtl'}>
            <h1 className='text-[24px] font-[600]'>{currentLanguage == 'ar' ? (shopInfo?.name?.ac ? shopInfo?.name?.ac : shopInfo?.name?.en) : shopInfo?.name?.en}</h1>
            <p className='text-sm text-gray-400 flex items-center gap-1 justify-start mt-2'>Shops <MdKeyboardArrowRight /> {shopInfo?.name?.en}</p>
            {/* shop image and info */}

            <VendorPageInfo
                id={shopInfo?._id}
                banner={shopInfo?.banner}
                logo={shopInfo?.logo}
                name={shopInfo?.name}
                desc={shopInfo?.description}
                region={shopInfo?.region}
                phone={shopInfo?.phone}
                links={shopInfo?.links}
            />
        </div>
    )
}

export default VendorPage