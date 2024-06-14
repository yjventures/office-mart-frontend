import React, { useEffect, useRef, useState } from 'react'
import InputField from '../VendorInputs/InputField'
import companyCoverImage from '../../../assets/vendor/company-cover.png'
import uploadIcon from '../../../assets/vendor/camera.svg'
import { CiCircleRemove } from "react-icons/ci";
import { showToast } from '../../Common/Toastify/Toastify';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { shopAtom, tokenAtom, userAtom } from '../../../lib/jotai';


const VendorShopSettingsEnglish = () => {
    const [linkCount, setLinkCount] = useState(1)
    const user = useAtomValue(userAtom)
    // const shop = useAtomValue(shopAtom)
    const token = useAtomValue(tokenAtom)
    const [loadingUpload, setLoadingUpload] = useState(false)
    const [progress, setProgress] = useState(0)
    const [logoImage, setLogoImage] = useState('')
    const [mobileLogoImage, setMobileLogoImage] = useState('')
    const [mainBannerImage, setMainBannerImage] = useState('')
    const [mainBannerImageMobile, setMainBannerImageMobile] = useState('')
    const [allProductPageBanner, setAllProductPageBanner] = useState('')
    const [allProductPageBannerMobile, setAllProductPageBannerMobile] = useState('')

    // console.log(token)
    // console.log(user)
    const setUser = useSetAtom(userAtom)
    const [shop, setShop] = useAtom(shopAtom)
    // console.log(shop)
    // useEffect(() => {
    // setShop(user?.vendor_info?.shop)
    // }, [shop])

    const [shopName, setShopName] = useState('')
    const [phone, setPhone] = useState('')
    const [categories, setCategories] = useState('')
    const [description, setDescription] = useState('')
    const [address, setAddress] = useState('')

    // const [shopName, setShopName] = useAtom(user?.vendor_info?.shop?.name)
    // console.log(shopName)
    const logoImageRef = useRef(null)
    const mobileLogoImageRef = useRef(null)
    const mainBannerImageRef = useRef(null)
    const mainBannerImageMobileRef = useRef(null)
    const allProductPageBannerRef = useRef(null)
    const allProductPageBannerMobileRef = useRef(null)

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

    const handleShopSettingsTextData = () => {
        const data = {
            name: {
                en: shopName,
                ac: ''
            },
            phone: phone,
            categories: [],
            description: {
                en: description,
                ac: ''
            },
            region: {
                en: address,
                ac: ''
            },

        }
        setShop(data)
        // check data is not empty
        // categories == '' ||
        if (shopName == '' || phone == '' || description == '' || address == '') {
            showToast('Please provide all the information', 'error')
            return
        }
        // check phone number is valid
        // if (phone.length < 11) {
        //     showToast('Please enter a valid phone number', 'error')
        //     return
        // }
        // // check categories is valid
        // if (categories.length < 2) {
        //     showToast('Please enter a valid category', 'error')
        //     return
        // }

    }

    // image upload component
    const ImageUploadComponent = ({ img, label, reference }) => {
        return (
            <div className='flex items-center lg:items-start justify-center max-w-[290px] h-[150px] flex-col mt-4 relative'>

                <label className='text-sm my-2 text-start'> {label} </label>
                <img src={img} alt="image" className='fluid object-contain w-full h-[110px] rounded-md' />

                <img src={uploadIcon} alt="icon" className='absolute -bottom-2 cursor-pointer left-[43%]' onClick={() => onUploadButtonClick(reference)} />
                <input type="file" ref={reference} className='hidden' onChange={() => {
                    handleCoverImage(reference.current.files[0], reference == logoImageRef ? 'logo' : reference == mobileLogoImageRef ? 'mobileLogo' : reference == mainBannerImageRef ? 'mainBanner' : reference == mainBannerImageMobileRef ? 'mainBannerMobile' : reference == allProductPageBannerRef ? 'allProductPageBanner' : reference == allProductPageBannerMobileRef ? 'allProductPageBannerMobile' : null)
                }} />
            </div>
        )
    }

    return (
        <div className='relative'>
            <p className='font-[500]'>Basic Settings</p>
            {/* show upload progress in fixed div */}
            {
                loadingUpload &&
                <div className='text-black fixed z-50 ring-1 ring-slate-400 bg-gray-300 right-10 bottom-10 px-10 py-3 rounded-md'>
                    <p className='font-[500]'>Uploaded image {progress}%</p>
                </div>
            }
            <InputField label='Shop Name*' type='text' placeholder={shop?.name.en ? shop?.name.en : 'Not Given'} value={shopName} onChange={setShopName} />
            <InputField label='Shop Phone*' type='number' placeholder={shop?.phone ? shop?.phone : 'Not Given'} value={phone} onChange={setPhone} />
            <InputField label='Shop Categories*' type='category' placeholder={categories ? categories : 'Not Given'} value={categories} onChange={setCategories} />
            <InputField label='Shop Description*' type='textField' placeholder={shop?.description?.en ? shop?.description?.en : 'Not Given'} value={description} onChange={setDescription} />
            <InputField label='Shop Address*' type='text' placeholder={shop?.address?.en ? shop?.address?.en : 'Not Given'} value={address} onChange={setAddress} />

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
            <div className='grid grid-cols-1 lg:grid-cols-2'>
                {/* logo */}
                <ImageUploadComponent label='Company Logo (500 x 500) *' reference={logoImageRef} img={logoImage ? logoImage : companyCoverImage} />
                <ImageUploadComponent label='Company Logo Mobile Version (500 x 500) *' reference={mobileLogoImageRef} img={mobileLogoImage ? mobileLogoImage : companyCoverImage} />
                {/* main banner */}
                <ImageUploadComponent label='Main Banner (1920 x 500) *' reference={mainBannerImageRef} img={mainBannerImage ? mainBannerImage : companyCoverImage} />
                <ImageUploadComponent label='Main Banner (1920 x 500) *' reference={mainBannerImageMobileRef} img={mainBannerImageMobile ? mainBannerImageMobile : companyCoverImage} />
                {/* all product page banner */}
                <ImageUploadComponent label='All products page banner * (Recommended size 1025x120)' reference={allProductPageBannerRef} img={allProductPageBanner ? allProductPageBanner : companyCoverImage} />
                <ImageUploadComponent label='All products page banner Mobile Version * (Recommended size 1025x120)' reference={allProductPageBannerMobileRef} img={allProductPageBannerMobile ? allProductPageBannerMobile : companyCoverImage} />
            </div>
            <p className='text-gray-600 text-sm my-6'>
                We had to limit height to maintian consistancy. Some device both side of the banner might cropped for height limitation.
            </p>
            <div>
                {
                    [[...Array(linkCount)]?.map((_, i) => {
                        return (
                            <div className='relative'>
                                <InputField label='Link' type='text' placeholder='https://www.productbanner.com' />
                                <CiCircleRemove className='w-6 h-6 absolute top-3 right-2 text-gray-400 cursor-pointer' onClick={() => {
                                    // if (linkCount > 1) setLinkCount(linkCount - 1)
                                    // else showToast('We recommend at least one link, if none you can proceed', 'error')
                                    setLinkCount(linkCount - 1)
                                }} />
                            </div>
                        )
                    })]
                }

            </div>
            <button className='bg-gray-100 px-10 py-2 rounded-md' onClick={() => {
                if (linkCount < 5) setLinkCount(linkCount + 1)
                else showToast('You can add maximum 5 links', 'error')
            }}>
                Add {linkCount == 0 ? 'Link' : 'New Link'}
            </button>
            {/* save changes */}
            <br />
            <button
                className='bg-[#319848] text-primary-color px-10 py-2 rounded-md mt-4'
                onClick={handleShopSettingsTextData}
            >
                {
                    shop ? 'Save Changes' : 'Create Shop'
                }
            </button>

        </div>
    )
}

export default VendorShopSettingsEnglish