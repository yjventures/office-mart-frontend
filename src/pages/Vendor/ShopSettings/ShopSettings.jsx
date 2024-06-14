import React, { useEffect, useRef, useState } from 'react'
import VendorHeader from 'components/Vendor/VendorHeader/VendorHeader'
import { useNavigate } from 'react-router-dom'
import { showToast } from 'src/components/Common/Toastify/Toastify'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { shopAtom, tokenAtom, userAtom } from 'src/lib/jotai'
import InputField from 'src/components/Vendor/VendorInputs/InputField'
import companyCoverImage from 'assets/vendor/company-cover.png'
import uploadIcon from 'assets/vendor/camera.svg'
import { CiCircleRemove } from "react-icons/ci";
import axios from 'axios'
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Input } from 'postcss'
import { useTranslation } from 'react-i18next'

const ShopSettings = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const navigate = useNavigate()
    const [tab, setTab] = useState('english')
    const user = useAtomValue(userAtom)
    // console.log(user)
    const setUser = useSetAtom(userAtom)
    const [shop, setShop] = useAtom(shopAtom)
    useEffect(() => {
        setShop(user?.vendor_info?.shop)
    }, [user])
    const token = useAtomValue(tokenAtom)
    const [loadingUpload, setLoadingUpload] = useState(false)
    const [progress, setProgress] = useState(0)
    const [logoImage, setLogoImage] = useState('')
    const [mobileLogoImage, setMobileLogoImage] = useState('')
    const [mainBannerImage, setMainBannerImage] = useState('')
    const [mainBannerImageMobile, setMainBannerImageMobile] = useState('')
    const [allProductPageBanner, setAllProductPageBanner] = useState('')
    const [allProductPageBannerMobile, setAllProductPageBannerMobile] = useState('')
    const [links, setLinks] = useState(['']);
    // console.log(token)
    // setShop(user?.vendor_info?.shop)
    // console.log(shop)

    const [shopNameEng, setShopNameEng] = useState('')
    const [phone, setPhone] = useState('')
    const [descriptionEng, setDescriptionEng] = useState('')
    const [addressEng, setAddressEng] = useState('')
    const [shopNameAr, setShopNameAr] = useState('')
    const [descriptionAr, setDescriptionAr] = useState('')
    const [addressAr, setAddressAr] = useState('')
    const [categories, setCategories] = useState([]);
    const [returnPeriod, setReturnPeriod] = useState('')
    const [refundPolicyEng, setRefundPolicyEng] = useState('')
    const [returnAuthorizationMethodEng, setReturnAuthorizationMethodEng] = useState('')
    const [returnShippingMethodEng, setReturnShippingMethodEng] = useState('')
    const [refundPolicyAr, setRefundPolicyAr] = useState('')
    const [returnAuthorizationMethodAr, setReturnAuthorizationMethodAr] = useState('')
    const [returnShippingMethodAr, setReturnShippingMethodAr] = useState('')
    const [shopForCategory, setShopForCategory] = useState('')
    // console.log(shopNameEng, phone, categories, descriptionEng, addressEng, shopNameAr, descriptionAr, addressAr)

    useEffect(() => {
        const shopData = localStorage.getItem('shop');
        if (shopData) {
            try {
                const parsedShopData = JSON.parse(shopData);
                // console.log(parsedShopData.categories[0].name)
                if (parsedShopData?.categories[0]?.name) {
                    setShopForCategory(parsedShopData?.categories[0]?.name);
                    setCategories(parsedShopData?.categories[0]?.name);
                }
               
                setLinks(parsedShopData.links)
            } catch (error) {
                console.error("Error parsing shop data from localStorage:", error);
            }
        }
    }, [user, shop]);

    const logoImageRef = useRef(null)
    const mobileLogoImageRef = useRef(null)
    const mainBannerImageRef = useRef(null)
    const mainBannerImageMobileRef = useRef(null)
    const allProductPageBannerRef = useRef(null)
    const allProductPageBannerMobileRef = useRef(null)

    // select image from which file to upload
    const onUploadButtonClick = (reference) => {
        switch (reference) {
            case logoImageRef:
                logoImageRef.current.click()
                break;
            case mobileLogoImageRef:
                mobileLogoImageRef.current.click()
                break;
            case mainBannerImageRef:
                mainBannerImageRef.current.click()
                break;
            case mainBannerImageMobileRef:
                mainBannerImageMobileRef.current.click()
                break;
            case allProductPageBannerRef:
                allProductPageBannerRef.current.click()
                break;
            case allProductPageBannerMobileRef:
                allProductPageBannerMobileRef.current.click()
                break;
            default:
                break;
        }
    };

    const handleCoverImage = (file, type) => {
        uploadFile(file, type);
    }

    const uploadFile = async (file, type) => {
        // S3 Bucket Name & region
        const S3_BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
        const REGION = import.meta.env.VITE_AWS_REGION;

        // S3 Credentials
        AWS.config.update({
            accessKeyId: import.meta.env.VITE_AWS_ACCESSKEYID,
            secretAccessKey: import.meta.env.VITE_AWS_SECRETACCESSKEY,
        });
        const s3 = new AWS.S3({
            params: { Bucket: S3_BUCKET },
            region: REGION,
        });

        // Files Parameters
        const timeStamp = Math.floor(Date.now() / 1000);
        // return;
        const params = {
            Bucket: S3_BUCKET,
            Key: timeStamp + user._id + file.name,
            Body: file,
        };

        // Uploading file to s3
        setLoadingUpload(true)
        var upload = s3
            .putObject(params)
            .on("httpUploadProgress", (evt) => {
                // File uploading progress
                setProgress(parseInt((evt.loaded * 100) / evt.total))
                console.log(
                    "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
                );
            })
            .promise();

        await upload.then(data => {
            showToast('Image uploaded successfully', 'success')
            if (type == 'logo') {
                setLogoImage(`https://sonbolabucket.s3.ap-southeast-2.amazonaws.com/${timeStamp + user._id + file.name}`)
            } else if (type == 'mobileLogo') {
                setMobileLogoImage(`https://sonbolabucket.s3.ap-southeast-2.amazonaws.com/${timeStamp + user._id + file.name}`)
            } else if (type == 'mainBanner') {
                setMainBannerImage(`https://sonbolabucket.s3.ap-southeast-2.amazonaws.com/${timeStamp + user._id + file.name}`)
            } else if (type == 'mainBannerMobile') {
                setMainBannerImageMobile(`https://sonbolabucket.s3.ap-southeast-2.amazonaws.com/${timeStamp + user._id + file.name}`)
            } else if (type == 'allProductPageBanner') {
                setAllProductPageBanner(`https://sonbolabucket.s3.ap-southeast-2.amazonaws.com/${timeStamp + user._id + file.name}`)
            } else if (type == 'allProductPageBannerMobile') {
                setAllProductPageBannerMobile(`https://sonbolabucket.s3.ap-southeast-2.amazonaws.com/${timeStamp + user._id + file.name}`)
            }

            setLoadingUpload(false)
        });
    };

    const handleShopSettings = async () => {
        // update shop
        if (shop) {
            const currentTime = new Date();
            const threeMinutesAgo = new Date(currentTime);
            threeMinutesAgo.setMinutes(currentTime.getMinutes() - 3);

            const timestampToCheck = new Date(shop.updatedAt);

            if (timestampToCheck > threeMinutesAgo) {
                // console.log('The timestamp is less than 3 minutes ago.');
                showToast('You can only update shop once in 3 minutes', 'error');
                return;
            }

            const data = {}
            if (shopNameEng) data.name = { en: shopNameEng }
            if (shopNameAr) data.name = { ...data.name, ac: shopNameAr }
            if (phone) data.phone = phone
            if (categories) data.categories = [categories]
            if (descriptionEng) data.description = { en: descriptionEng }
            if (descriptionAr) data.description = { ...data.description, ac: descriptionAr }
            if (addressEng) data.region = { en: addressEng }
            if (addressAr) data.region = { ...data.region, ac: addressAr }
            if (logoImage) data.logo = logoImage
            if (mobileLogoImage) data.logo_mobile = mobileLogoImage
            if (mainBannerImage) data.banner = mainBannerImage
            if (mainBannerImageMobile) data.banner_mobile = mainBannerImageMobile
            if (allProductPageBanner) data.product_banner = allProductPageBanner
            if (allProductPageBannerMobile) data.product_banner_mobile = allProductPageBannerMobile
            if (links) data.links = links
            if (returnPeriod) data.return_period = { en: returnPeriod, ac: returnPeriod }
            if (refundPolicyEng) data.refund_policy = { en: refundPolicyEng }
            if (returnAuthorizationMethodEng) data.return_authorization_method = { en: returnAuthorizationMethodEng }
            if (returnShippingMethodEng) data.return_shipping_method = { en: returnShippingMethodEng }
            if (refundPolicyAr) data.refund_policy = { ...data.refund_policy, ac: refundPolicyAr }
            if (returnAuthorizationMethodAr) data.return_authorization_method = { ...data.return_authorization_method, ac: returnAuthorizationMethodAr }
            if (returnShippingMethodAr) data.return_shipping_method = { ...data.return_shipping_method, ac: returnShippingMethodAr }


            JSON.stringify(data)
            try {
                const response = await axios.put(`${import.meta.env.VITE_API_PATH}/shops/update/${shop?._id}`, data)
                // console.log(response)
                if (response.status == 200) {
                    showToast('Shop updated successfully', 'success')
                    // call user api again to get updated data
                    const userResponse = await axios.get(`${import.meta.env.VITE_API_PATH}/users/user/${user?._id}`, {
                        headers: {
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                        }
                    })
                    // console.log(userResponse)
                    if (userResponse.status == 200) {
                        setUser(userResponse.data.user)
                        navigate('/vendor-dashboard')
                    } else {
                        showToast('Something is fisshy, lets login again', 'err')
                        navigate('/signin?type=vendor')
                    }
                }
            } catch (error) {
                // console.log(error)
                showToast('Might be problem occured during shop creation | Make sure your internet connection is okay', 'error')
            }
        } else {
            // create shop
            if (shopNameEng && shopNameAr && phone && categories && descriptionEng && addressEng && descriptionAr && addressAr && logoImage && mobileLogoImage && mainBannerImage && mainBannerImageMobile && allProductPageBanner && allProductPageBannerMobile && refundPolicyEng && returnPeriod && refundPolicyAr) {
                const data = {
                    name: {
                        en: shopNameEng,
                        ac: shopNameAr
                    },
                    phone: phone,
                    categories: [categories],
                    description: {
                        en: descriptionEng,
                        ac: descriptionAr
                    },
                    region: {
                        en: addressEng,
                        ac: addressAr
                    },
                    logo: logoImage,
                    logo_mobile: mobileLogoImage,
                    banner: mainBannerImage,
                    banner_mobile: mainBannerImageMobile,
                    product_banner: allProductPageBanner,
                    product_banner_mobile: allProductPageBannerMobile,
                    vendor_id: user?.vendor_info?._id,
                    links: links,
                    shipping_method: 'FedEx',
                    return_period: {
                        en: returnPeriod,
                        ac: returnPeriod
                    },
                    refund_policy: {
                        en: refundPolicyEng,
                        ac: refundPolicyAr
                    },
                    return_authorization_method: {
                        en: returnAuthorizationMethodEng,
                        ac: returnAuthorizationMethodAr
                    },
                    return_shipping_method: {
                        en: returnShippingMethodEng,
                        ac: returnShippingMethodAr
                    }
                }
                JSON.stringify(data)
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_PATH}/shops/create`, data)
                    // console.log(response)
                    if (response.status == 200) {
                        showToast('Shop created successfully', 'success')
                        // call user api again to get updated data
                        const userResponse = await axios.get(`${import.meta.env.VITE_API_PATH}/users/user/${user._id}`, {
                            headers: {
                                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                            }
                        })

                        if (userResponse.status == 200) {
                            setUser(userResponse.data.user)
                            navigate('/vendor-dashboard')
                        } else {
                            showToast('Something is fisshy, lets login again', 'err')
                            navigate('/signin?type=vendor')
                        }
                    }
                } catch (error) {
                    showToast('Something went wrong', 'err')
                }

            } else {
                // check all arabic fields are filled
                if (!shopNameAr || !descriptionAr || !addressAr || !refundPolicyAr) {
                    showToast('Arabic data are not provided', 'error')
                    return
                }
                showToast('all fields are not filled', 'error')
            }
        }


    }

    // image upload component
    const ImageUploadComponent = ({ img, label, reference }) => {
        return (
            <div className='flex items-center lg:items-start justify-center max-w-[290px] h-[150px] flex-col mt-4 relative'>

                <label className='text-sm my-2 text-start'> {label} </label>
                <img src={img} alt="image" className='fluid object-contain w-full h-[110px] rounded-md' />

                <img src={uploadIcon} alt="icon" className='absolute -bottom-2 cursor-pointer left-[43%]' onClick={() => onUploadButtonClick(reference)} />
                <input type="file" ref={reference} className='hidden' onChange={() => {
                    handleCoverImage(reference?.current?.files[0], reference == logoImageRef ? 'logo' : reference == mobileLogoImageRef ? 'mobileLogo' : reference == mainBannerImageRef ? 'mainBanner' : reference == mainBannerImageMobileRef ? 'mainBannerMobile' : reference == allProductPageBannerRef ? 'allProductPageBanner' : reference == allProductPageBannerMobileRef ? 'allProductPageBannerMobile' : null)
                }} />
            </div>
        )
    }


    return (
        <div className='font-main lg:-ms-10 px-2 lg:px-0'>
            <VendorHeader text={t('vendor_sidebar.shop_settings')} />
            <div className='flex w-full py-3 text-black'>
                <p className={`text-md w-[100%] lg:w-[50%] pb-2 text-center cursor-pointer ${tab == 'english' ? 'font-[600] border-b-2 border-[#A6E66E]' : 'font-normal'}`} onClick={() => {
                    setTab('english')
                }}>
                    English
                </p>
                <p className={`text-md w-[100%] lg:w-[50%] pb-2 text-center cursor-pointer ${tab == 'arabic' ? 'font-[600] border-b-2 border-[#A6E66E]' : 'font-normal'}`} onClick={() => {
                    setTab('arabic')
                }}>
                    Arabic
                </p>
            </div>
            {
                tab == 'english' ?
                    <div className='relative'>
                        <p className='font-[500]'>Basic Settings</p>
                        {/* show upload progress in fixed div */}
                        {
                            loadingUpload &&
                            <div className='text-black fixed z-50 ring-1 ring-slate-400 bg-gray-300 right-10 bottom-10 px-10 py-3 rounded-md'>
                                <p className='font-[500]'>Uploaded image {progress}%</p>
                            </div>
                        }
                        <InputField label='Shop Name*' type='text' placeholder={shop?.name.en ? shop?.name.en : 'Provide information here'} value={shopNameEng} onChange={setShopNameEng} />
                        <InputField
                            label='Shop Phone*'
                            type='number'
                            value={phone}
                            onChange={setPhone}
                            placeholder={shop?.phone ? shop?.phone : 'Provide information here'}
                        />
                        <InputField label='Shop Categories*' type='category' placeholder={shopForCategory ? shopForCategory : 'Provide information here'} value={shopForCategory} onChange={setCategories} />
                        <InputField label='Shop Description*' type='textField' placeholder={shop?.description?.en ? shop?.description?.en : 'Provide information here'} value={descriptionEng} onChange={setDescriptionEng} />
                        <InputField label='Shop Address*' type='text' placeholder={shop?.region?.en ? shop?.region?.en : 'Provide information here'} value={addressEng} onChange={setAddressEng} />

                        {/* save changes button */}
                        {/* <button
                            className='bg-[#319848] text-primary-color px-4 py-2 rounded-md'
                            onClick={handleShopSettingsTextData}
                        >
                            {
                                shop ? 'Save Changes' : 'Create Shop'
                            }
                        </button> */}
                        {/* shop page settings */}
                        <p className='font-[500] mt-8'>Shop Page Settings</p>
                        <div className='grid grid-cols-1 md:grid-cols-2'>
                            {/* logo */}
                            <ImageUploadComponent label='Company Logo (500 x 500) *' reference={logoImageRef} img={logoImage ? logoImage : shop?.logo ? shop?.logo : companyCoverImage} />
                            <ImageUploadComponent label='Company Logo Mobile Version (500 x 500) *' reference={mobileLogoImageRef} img={mobileLogoImage ? mobileLogoImage : shop?.logo_mobile ? shop?.logo_mobile : companyCoverImage} />
                            {/* main banner */}
                            <ImageUploadComponent label='Main Banner (1920 x 500) *' reference={mainBannerImageRef} img={mainBannerImage ? mainBannerImage : shop?.banner ? shop?.banner : companyCoverImage} />
                            <ImageUploadComponent label='Main Banner (1920 x 500) *' reference={mainBannerImageMobileRef} img={mainBannerImageMobile ? mainBannerImageMobile : shop?.banner_mobile ? shop?.banner_mobile : companyCoverImage} />
                            {/* all product page banner */}
                            <ImageUploadComponent label='All products page banner * (Recommended size 1025x120)' reference={allProductPageBannerRef} img={allProductPageBanner ? allProductPageBanner : shop?.product_banner ? shop?.product_banner : companyCoverImage} />
                            <ImageUploadComponent label='All products page banner Mobile Version * (Recommended size 1025x120)' reference={allProductPageBannerMobileRef} img={allProductPageBannerMobile ? allProductPageBannerMobile : shop?.product_banner_mobile ? shop?.product_banner_mobile : companyCoverImage} />
                        </div>
                        <p className='text-gray-600 text-sm my-6'>
                            We had to limit height to maintian consistancy. Some device both side of the banner might cropped for height limitation.
                        </p>

                        <div>
                            {links.map((link, index) => (
                                <div key={index} className='relative'>
                                    <InputField
                                        label={`Link ${index + 1}`}
                                        type='text'
                                        placeholder='https://www.productbanner.com'
                                        value={link}
                                        onChange={(value) => {
                                            const updatedLinks = [...links];
                                            updatedLinks[index] = value;
                                            setLinks(updatedLinks);
                                        }}
                                    />
                                    <CiCircleRemove
                                        className='w-6 h-6 absolute top-3 right-2 text-gray-400 cursor-pointer'
                                        onClick={() => {
                                            if (links.length > 1) {
                                                const updatedLinks = [...links];
                                                updatedLinks.splice(index, 1);
                                                setLinks(updatedLinks);
                                            } else {
                                                showToast('We recommend at least one link, if none you can proceed', 'error');
                                            }
                                        }}
                                    />
                                </div>
                            ))}

                        </div>
                        <button
                            className='bg-gray-100 px-4 py-2 rounded-md'
                            onClick={() => {
                                if (links.length < 5) {
                                    setLinks([...links, '']);
                                } else {
                                    showToast('You can add a maximum of 5 links', 'error');
                                }
                            }}
                        >
                            Add {links.length === 0 ? 'Link' : 'New Link'}
                        </button>
                        {/* shipping options */}
                        <p className='font-[500] mt-8'>Shipping Options</p>
                        <div className='relative mt-2'>
                            <select className='w-full border border-gray-300 rounded-md p-3 mt-4 appearance-none outline-none cursor-pointer text-sm'>
                                {
                                    ['FedEx', 'DHL', 'UPS', 'USPS', 'Other'].map((option, index) => (
                                        <option key={index} className='text-sm py-2' value={option}>{option}</option>
                                    ))
                                }
                            </select>
                            <MdOutlineKeyboardArrowDown className='absolute top-7 right-2 w-5 h-5 text-gray-400' />
                            <label htmlFor="shipping_method" className='absolute top-[7px] left-2 text-[12px] bg-white px-2'> Shipping Method * </label>
                        </div>
                        {/* return policy */}
                        <p className='font-[500] mt-8'>Return Policies</p>
                        <InputField label='Return Period*' type='text' placeholder={shop?.return_period?.en ? shop?.return_period?.en : 'Provide information here'} value={returnPeriod} onChange={setReturnPeriod} />
                        <InputField label='Refund Policy*' type='textField' placeholder={shop?.refund_policy?.en ? shop?.refund_policy?.en : 'Provide information here'} value={refundPolicyEng} onChange={setRefundPolicyEng} />
                        <InputField label='Return Authorization Method' type='textField' placeholder={shop?.return_authorization_method?.en ? shop?.return_authorization_method?.en : 'Provide information here'} value={returnAuthorizationMethodEng} onChange={setReturnAuthorizationMethodEng} />
                        <InputField label='Return Shipping Method' type='textField' placeholder={shop?.return_shipping_method?.en ? shop?.return_shipping_method?.en : 'Provide information here'} value={returnShippingMethodEng} onChange={setReturnShippingMethodEng} />
                        {/* save changes */}
                        <br />
                        <button
                            className='bg-[#319848] text-primary-color px-10 py-2 rounded-md'
                            onClick={handleShopSettings}
                        >
                            {
                                shop ? 'Save Changes' : 'Create Shop'
                            }
                        </button>

                    </div>

                    :


                    // Arabic tab part 
                    <div dir="rtl">
                        <p className='font-[500]'>الإعدادات الأساسية</p>
                        {/* show upload progress in fixed div */}
                        {
                            loadingUpload &&
                            <div className='text-black fixed z-50 ring-1 ring-slate-400 bg-gray-300 left-10 bottom-10 px-10 py-3 rounded-md'>
                                <p className='font-[500]'>الصورة التي تم تحميلها {progress}%</p>
                            </div>
                        }
                        <InputField label='اسم المحل*' type='text' placeholder={shop?.name.ac ? shop?.name.ac : 'Provide information here'} value={shopNameAr} onChange={setShopNameAr} />
                        {/* <InputField label='Shop Phone*' type='text' placeholder={shop?.phone ? shop?.phone : 'Provide information here'} value={phone} onChange={setPhone} /> */}
                        <InputField label='وصف المتجر' type='textField' placeholder={shop?.description.ac ? shop?.description.ac : 'Provide information here'} value={descriptionAr} onChange={setDescriptionAr} />
                        <InputField label='عنوان المحل' type='text' placeholder={shop?.region?.ac ? shop?.region?.ac : 'Provide information here'} value={addressAr} onChange={setAddressAr} />

                        {/* save changes button */}
                        {/* <button className='bg-[#319848] text-primary-color px-4 py-2 rounded-md'>التنفيذ</button> */}


                        {/* shop page settings */}
                        <p className='font-[500] mt-8'>إعدادات صفحة المتجر</p>
                        <div className='grid grid-cols-1 md:grid-cols-2'>
                            {/* logo */}
                            <ImageUploadComponent label='شعار الشركة (500 × 500) *' reference={logoImageRef} img={logoImage ? logoImage : shop?.logo ? shop?.logo : companyCoverImage} />
                            <ImageUploadComponent label='شعار الشركة نسخة الجوال (500 × 500) *' reference={mobileLogoImageRef} img={mobileLogoImage ? mobileLogoImage : shop?.logo_mobile ? shop?.logo_mobile : companyCoverImage} />
                            {/* main banner */}
                            <ImageUploadComponent label='الشعار الرئيسي (1920 × 500) *' reference={mainBannerImageRef} img={mainBannerImage ? mainBannerImage : shop?.banner ? shop?.banner : companyCoverImage} />
                            <ImageUploadComponent label='الشعار الرئيسي (1920 × 500) *' reference={mainBannerImageMobileRef} img={mainBannerImageMobile ? mainBannerImageMobile : shop?.banner_mobile ? shop?.banner_mobile : companyCoverImage} />
                            {/* all product page banner */}
                            <ImageUploadComponent label='شعار صفحة جميع المنتجات * (الحجم الموصى به 1025 × 120)' reference={allProductPageBannerRef} img={allProductPageBanner ? allProductPageBanner : shop?.product_banner ? shop?.product_banner : companyCoverImage} />
                            <ImageUploadComponent label='شعار صفحة جميع المنتجات إصدار الهاتف المحمول * (الحجم الموصى به 1025 × 120)' reference={allProductPageBannerMobileRef} img={allProductPageBannerMobile ? allProductPageBannerMobile : shop?.product_banner_mobile ? shop?.product_banner_mobile : companyCoverImage} />
                        </div>
                        <p className='text-gray-600 text-sm my-6'>
                            كان علينا أن نحد من الارتفاع مع الحفاظ على الاتساق. قد يتم اقتصاص جانب بعض الأجهزة من اللافتة للحد من الارتفاع.
                        </p>
                        <div>
                            {links.map((link, index) => (
                                <div key={index} className='relative'>
                                    <InputField
                                        label={`وصلة ${index + 1}`}
                                        type='text'
                                        placeholder='https://www.productbanner.com'
                                        value={link}
                                        onChange={(value) => {
                                            const updatedLinks = [...links];
                                            updatedLinks[index] = value;
                                            setLinks(updatedLinks);
                                        }}
                                    />
                                    <CiCircleRemove
                                        className='w-6 h-6 absolute top-3 left-2 text-gray-400 cursor-pointer'
                                        onClick={() => {
                                            if (links.length > 1) {
                                                const updatedLinks = [...links];
                                                updatedLinks.splice(index, 1);
                                                setLinks(updatedLinks);
                                            } else {
                                                showToast('نوصي برابط واحد على الأقل، إذا لم يكن هناك رابط يمكنك المتابعة', 'error');
                                            }
                                        }}
                                    />
                                </div>
                            ))}

                        </div>
                        <button
                            className='bg-gray-100 px-10 py-2 rounded-md'
                            onClick={() => {
                                if (links.length < 5) {
                                    setLinks([...links, '']);
                                } else {
                                    showToast('You can add a maximum of 5 links', 'error');
                                }
                            }}
                        >
                            Add {links.length === 0 ? 'Link' : 'New Link'}
                        </button>
                        {/* shipping options */}
                        <p className='font-[500] mt-8'>خيارات الشحن</p>
                        <div className='relative mt-2'>
                            <select className='w-full border border-gray-300 rounded-md p-3 mt-4 appearance-none outline-none cursor-pointer text-sm'>
                                {
                                    ['FedEx', 'DHL', 'UPS', 'USPS', 'Other'].map((option, index) => (
                                        <option key={index} className='text-sm py-2' value={option}>{option}</option>
                                    ))
                                }
                            </select>
                            <MdOutlineKeyboardArrowDown className='absolute top-7 right-2 w-5 h-5 text-gray-400' />
                            <label htmlFor="shipping_method" className={`absolute top-[7px] text-[12px] bg-white px-2 whitespace-nowrap ${currentLanguage == 'ar' ? 'right-2' : 'left-2'}`}> طريقة الشحن * </label>
                        </div>
                        {/* return policy */}
                        <p className='font-[500] mt-8'>سياسات الإرجاع</p>
                        <InputField label='فترة العائد الربحي*' type='text' placeholder={shop?.return_period?.ac ? shop?.return_period?.ac : 'Provide information here'} value={returnPeriod} onChange={setReturnPeriod} />
                        <InputField label='سياسة الاسترجاع*' type='textField' placeholder={shop?.refund_policy?.ac ? shop?.refund_policy?.ac : 'Provide information here'} value={refundPolicyAr} onChange={setRefundPolicyAr} />
                        <InputField label='طريقة إذن العودة' type='textField' placeholder={shop?.return_authorization_method?.ac ? shop?.return_authorization_method?.ac : 'Provide information here'} value={returnAuthorizationMethodAr} onChange={setReturnAuthorizationMethodAr} />
                        <InputField label='طريقة شحن الإرجاع' type='textField' placeholder={shop?.return_shipping_method?.ac ? shop?.return_shipping_method?.ac : 'Provide information here'} value={returnShippingMethodAr} onChange={setReturnShippingMethodAr} />
                        {/* save changes */}
                        <br />
                        <button
                            className='bg-tertiary-600 text-primary-color px-10 py-2 rounded-md mt-4'
                            onClick={handleShopSettings}
                        >
                            {
                                shop ? 'Save Changes' : 'Create Shop'
                            }
                        </button>
                    </div>
            }
        </div>
    )
}

export default ShopSettings