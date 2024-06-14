import React, { useRef, useState } from 'react'
import cameraIcon from 'assets/profile/camera.svg'
import { CiUser } from "react-icons/ci";
// import { tokenAtom, userAtom } from '../../../lib/jotai';
import { useAtomValue, useSetAtom } from 'jotai';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import TextField from 'src/components/Signup/TextField';
import { showToast } from 'src/components/Common/Toastify/Toastify';
import { tokenAtom, userAtom } from 'src/lib/jotai';
import { useTranslation } from 'react-i18next';

const EditDetails = () => {
    const user = useAtomValue(userAtom)
    const token = useAtomValue(tokenAtom)
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const setUser = useSetAtom(userAtom)

    const phoneInputStyles = {
        // Add custom styles here
        input: {
            width: '100%',
            padding: '20px 45px',
        }
        // Add more styles if necessary
    };

    // const handleFileChange = (e) => {
    //     console.log(e.target.files[0])
    // }
    const [newFirstName, setNewFirstName] = useState('')
    const [newLastName, setNewLastName] = useState('')
    // const [newEmail, setNewEmail] = useState('')
    const [newPhone, setNewPhone] = useState('')
    const [newBirthdate, setNewBirthdate] = useState('')
    const [coverImage, setCoverImage] = useState('')

    const handleSaveChanges = async () => {
        // hit api to update user details
        // console.log(newFirstName, newLastName, newPhone, newBirthdate)

        const data = {}
        newFirstName ? data.firstname = newFirstName : user.firstname
        newLastName ? data.lastName = newLastName : user.lastname
        coverImage ? data.image = coverImage : user.image
        // newEmail ? data.email = newEmail : user.email
        newPhone ? data.phone = newPhone : user.phone
        newBirthdate ? data.birthdate = newBirthdate : user.birthdate
        // check if data is empty
        if (Object.keys(data).length === 0) {
            showToast('Please provide at least one information', 'error')
            return;
        }

        // console.log(data)
        const response = await axios.put(`${import.meta.env.VITE_API_PATH}/users/update/${user._id}`, data, {
            headers: {
                Authorization: `Bearer ${token.accessToken}`
            }
        })
        // console.log(response)
        if (response.status == 200) {
            showToast('Details updated successfully', 'success')
            setUser(response?.data?.user)
            // clear all the fields
            setNewFirstName('')
            setNewLastName('')
            // setNewEmail('')
            setNewPhone('')
            setNewBirthdate('')

        } else {
            showToast('Something went wrong, Please try again', 'error')
        }

    }

    const coverImageRef = useRef(null)
    const onCoverButtonClick = () => {
        coverImageRef.current.click();
    };

    // cover image upload
    const handleCoverImage = (file) => {
        uploadFile(file);
    }
    const uploadFile = async (file) => {
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

        var upload = s3
            .putObject(params)
            .on("httpUploadProgress", (evt) => {
                // File uploading progress
                // console.log(
                //     "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
                // );
            })
            .promise();

        await upload.then(data => {
            showToast('Image uploaded successfully', 'success')
            setCoverImage(`https://sonbolabucket.s3.ap-southeast-2.amazonaws.com/${timeStamp + user._id + file.name}`)

        });
    };
    // format birthdate
    const formatBirthdate = (birthdate) => {
        var birthdayDate = new Date(birthdate);
        // Options for formatting
        var options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        // Format the Date object
        var formattedBirthday = birthdayDate.toLocaleDateString('en-US', options);
        return formattedBirthday;
    }

    return (
        <div className='p-2 lg:px-6 lg:py-6 rounded-sm my-4' style={{
            boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)'
        }}>
            <div className='relative'>
                {
                    coverImage !== '' ? <img src={coverImage} alt="profile-image" className='w-[80px] h-[80px] lg:w-[80px] lg:h-[80px]  rounded-full border-2 object-contain' /> : user?.image ? <img src={user?.image} alt="profile-image" className='w-[40px] h-[40px] lg:w-[80px] lg:h-[80px] rounded-full border-2 object-contain' /> : <CiUser className='w-[80px] h-[80px] rounded-full border-2' />
                }

                {/* <img src={cameraIcon} alt="avatar" className='w-[80px] h-[80px] rounded-full border-2' /> */}
                <div className='absolute bottom-1 md:bottom-0 md:left-12 left-6 cursor-pointer'>
                    {/* upload image */}
                    <img src={cameraIcon} alt="icon" className='w-6 md:w-10 ' onClick={onCoverButtonClick} />
                    <input type="file" ref={coverImageRef} className='hidden' onChange={() => {
                        handleCoverImage(coverImageRef.current.files[0])
                    }} />
                    {/* <input type="file" name="avatar" id="avatar" className='z-20 opacity- -ms-8' /> */}
                </div>
            </div>
            {/* grid cols 2 in lg and grid cols 1 in sm screen */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4 mt-4'>
                <TextField label={t('profile.first_name')} placeholder={user?.firstname} value={newFirstName} onChange={setNewFirstName} />
                <TextField label={t('profile.last_name')} placeholder={user?.lastname} value={newLastName} onChange={setNewLastName} />
                {/* <TextField label='Email' placeholder={user?.email} value={newEmail} onChange={setNewEmail} /> */}
                {/* <TextField label='Phone Number' placeholder={user?.phone ? user.phone : 'Please provide your number'} value={newPhone} onChange={setNewPhone} /> */}
                <div className='flex justify-center items-center mt-3 w-full relative '>
                    <label className='absolute -top-[24px] md:-top-[20px] lg:-top-[14px] left-[2px] text-sm z-10'>{t('profile.phone')}</label>
                    <PhoneInput
                        country={'lb'}
                        onlyCountries={['lb']}
                        value={newPhone}
                        onChange={phone => setNewPhone(phone)}
                        disableDropdown={true}
                        inputStyle={phoneInputStyles.input}
                    />
                </div>
                <TextField label={`${t('profile.birth_date')} ${t('profile.day_month')}`} placeholder={user?.birthdate ? formatBirthdate(user.birthdate) : 'Format: 24/12/2002'} value={newBirthdate} onChange={setNewBirthdate} />
            </div>
            <div className='mt-4' >
                <button className='bg-tertiary-600 text-primary-color px-4 py-2 rounded-md' onClick={handleSaveChanges}>Save Changes</button>
            </div>
        </div>
    )
}

export default EditDetails