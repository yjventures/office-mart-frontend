import React, { useRef, useState } from 'react'
import InputField from '../VendorInputs/InputField'
import companyCoverImage from '../../../assets/vendor/company-cover.png'
import uploadIcon from '../../../assets/vendor/camera.svg'
import { CiCircleRemove } from "react-icons/ci";
import { showToast } from '../../Common/Toastify/Toastify';
import { useAtomValue, useSetAtom } from 'jotai';
import { tokenAtom, userAtom } from '../../../lib/jotai';

const VendorShopSettingsArabic = () => {
    const [linkCount, setLinkCount] = useState(1)
    const user = useAtomValue(userAtom)
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
    // console.log(logoImage, mobileLogoImage)


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

    // image upload component
    const ImageUploadComponent = ({ img, label, reference }) => {
        return (
            <div className='flex items-center justify-center max-w-[290px] h-[150px] flex-col mt-4 relative'>

                <label className='text-sm my-2 text-start'> {label} </label>
                <img src={img} alt="image" className='fluid object-contain w-full h-[110px] rounded-md' />

                <img src={uploadIcon} alt="icon" className='absolute -bottom-2 cursor-pointer' onClick={() => onUploadButtonClick(reference)} />
                <input type="file" ref={reference} className='hidden' onChange={() => {
                    handleCoverImage(reference.current.files[0], reference == logoImageRef ? 'logo' : reference == mobileLogoImageRef ? 'mobileLogo' : reference == mainBannerImageRef ? 'mainBanner' : reference == mainBannerImageMobileRef ? 'mainBannerMobile' : reference == allProductPageBannerRef ? 'allProductPageBanner' : reference == allProductPageBannerMobileRef ? 'allProductPageBannerMobile' : null)
                }} />
            </div>
        )
    }


    return (
        <div dir="rtl">

            <p className='font-[500]'>Basic Settings</p>
            {/* show upload progress in fixed div */}
            {
                loadingUpload &&
                <div className='text-black fixed z-50 ring-1 ring-slate-400 bg-gray-300 left-10 bottom-10 px-10 py-3 rounded-md'>
                    <p className='font-[500]'>Uploaded image {progress}%</p>
                </div>
            }
            <InputField label='لرئيس التنفيذي*' type='text' placeholder='لرئيس التنفيذي' />
            <InputField label='لرئيس*' type='number' placeholder='01778787979' />
            <InputField label='التنفيذي*' type='textField' placeholder='لرئيس التنفيذي لرئيس التنفيذيلرئيس التنفيذي vلرئيس التنفيذي لرئيس التنفيذيلرئيس التنفيذيلرئيس التنفيذيلرئيس التنفيذيلرئيس التنفيذي' />
            <InputField label='التنفيذ*' type='text' placeholder='لرئيس التنفيذيلرئيس التنفيذيلرئيس التنفيذيلرئيس التنفيذيلرئيس التنفيذي, لرئيس التنفيذي. لرئيس التنفيذي' />

            {/* save changes button */}
            <button className='bg-[#319848] text-primary-color px-4 py-2 rounded-md'>التنفيذ</button>


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
                                <CiCircleRemove className='w-6 h-6 absolute top-3 left-2 text-gray-400 cursor-pointer' onClick={() => {
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
            <button className='bg-[#319848] text-primary-color px-10 py-2 rounded-md mt-4'>Save Changes</button>

        </div>
    )
}

export default VendorShopSettingsArabic