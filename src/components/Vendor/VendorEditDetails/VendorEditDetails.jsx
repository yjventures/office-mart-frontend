import React, { useRef, useState } from 'react'
import { tokenAtom, userAtom } from '../../../lib/jotai'
import { useAtomValue, useSetAtom } from 'jotai'
import cameraIcon from 'assets/profile/camera.svg'
import coverPhoto from 'assets/vendor/cover-photo.png'
import coverUpload from 'assets/vendor/cover-upload.png'
import { RiUser3Line } from "react-icons/ri";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
  LanguageSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import axios from 'axios'
import AWS, { Backup } from 'aws-sdk';
import { Buffer } from 'buffer';
import { showToast } from '../../Common/Toastify/Toastify'
import TextField from 'src/components/Signup/TextField'
import { useTranslation } from 'react-i18next'
Buffer.from('anything', 'base64');


const VendorEditDetails = () => {
  const user = useAtomValue(userAtom)
  const token = useAtomValue(tokenAtom)
  const setUser = useSetAtom(userAtom)
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language;
  const [profileImage, setProfileImage] = useState('')
  const [coverImage, setCoverImage] = useState('')

  const [file, setFile] = useState(null);

  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName, setNewLastName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newCountry, setNewCountry] = useState('')
  // console.log(profileImage)
  // console.log(coverImage)

  // Function to upload file to s3
  const uploadFile = async (file, type) => {
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
        console.log(
          "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
        );
      })
      .promise();

    await upload.then(data => {
      // Fille successfully uploaded
      showToast('Image uploaded successfully', 'success')
      if (type == 'cover') {
        setCoverImage(`https://sonbolabucket.s3.ap-southeast-2.amazonaws.com/${timeStamp + user._id + file.name}`)
      } else {
        setProfileImage(`https://sonbolabucket.s3.ap-southeast-2.amazonaws.com/${timeStamp + user._id + file.name}`)
      }
    });
  };

  // profile image upload
  const handleProfileImage = (file) => {
    uploadFile(file, 'profile');
  }

  // profile image upload button
  const profileImageRef = useRef(null)
  const onButtonClick = () => {
    profileImageRef.current.click();
  };

  const coverImageRef = useRef(null)
  const onCoverButtonClick = () => {
    coverImageRef.current.click();
  };

  // cover image upload
  const handleCoverImage = (file) => {
    uploadFile(file, 'cover');
  }

  // console.log(profileImage)
  // console.log(coverImage)

  const handleSaveChanges = async () => {
    // hit api to update user details
    // console.log(newCountry)

    const data = {}
    newFirstName ? data.firstname = newFirstName : user.firstname
    newLastName ? data.lastName = newLastName : user.lastname
    profileImage ? data.image = profileImage : user.image
    const vendorData = {}

    // newEmail ? data.email = newEmail : user.email
    // newCity ? vendorData.city = newCity : user.city
    newPhone ? vendorData.business_phone_no = newPhone : user?.vendor_info?.business_phone_no
    newCountry ? vendorData.region = newCountry : user?.vendor_info?.region
    coverImage ? vendorData.backgorund_image = coverImage : user?.vendor_info?.backgorund_image
    // check if data is empty
    if (Object.keys(data).length === 0 && Object.keys(vendorData).length === 0) {
      showToast('Please provide at least one information', 'error')
      return;
    }

    // console.log(data)
    // return;
    const res = await axios.put(`${import.meta.env.VITE_API_PATH}/vendors/update/${user?.vendor_info?._id}`, vendorData, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    })
    if (res.status == 200) {
      const response = await axios.put(`${import.meta.env.VITE_API_PATH}/users/update/${user._id}`, data, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      })
      if (response.status == 200) {
        setUser(response?.data?.user)
        showToast('Details updated successfully', 'success')
        setUser(response?.data?.user)
        // clear all the fields
        setNewFirstName('')
        setNewLastName('')
        setNewPhone('')
        // setNewEmail('')
        setNewCountry('')
        setNewCity('')
      } else {
        showToast('Something went wrong, Please try again', 'error')
      }
    }
  }



  return (
    <div className='p-2 lg:px-6 lg:py-6 rounded-sm my-4' style={{
      boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)'
    }}>
      <div className='relative'>
        {/* cover image */}
        {
          coverImage !== '' ? <img src={coverImage} alt="cover-image" className='w-full h-[120px] lg:h-[150px] object-cover rounded' /> : user?.vendor_info?.backgorund_image ? <img src={user?.vendor_info?.backgorund_image} alt="cover-image" className='w-full h-[120px] lg:h-[150px] object-cover rounded' /> : <img src={coverPhoto} alt="cover-image" className='w-full h-[120px] lg:h-[150px] object-cover rounded' />
        }
        {/* profile image */}
        <div className='absolute bottom-1 left-2'>
          {
            profileImage !== '' ? <img src={profileImage} alt="profile-image" className='w-[40px] h-[40px] lg:w-[80px] lg:h-[80px] rounded-full border-2 object-cover' /> : user?.image ? <img src={user?.image} alt="profile-image" className='w-[40px] h-[40px] lg:w-[80px] lg:h-[80px] rounded-full border-2 object-contain' /> : <RiUser3Line className='w-[40px] h-[40px] lg:w-[80px] lg:h-[80px] rounded-full border-2' />
          }
          <img src={cameraIcon} onClick={onButtonClick} alt="icon" className='w-[30px] h-[30px] absolute bottom-0 left-8 lg:left-12 cursor-pointer' />
          <input type="file" ref={profileImageRef} className='hidden' onChange={() => {
            handleProfileImage(profileImageRef.current.files[0])
          }} />
        </div>
        {/* cover image upload button */}
        <input type="file" ref={coverImageRef} className='hidden' onChange={() => {
          handleCoverImage(coverImageRef.current.files[0])
        }} />
        <img src={coverUpload} onClick={onCoverButtonClick} alt="icon" className='absolute top-2 right-4 cursor-pointer' />
      </div>
      {/* grid cols 2 in lg and grid cols 1 in sm screen */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4 mt-4 font-main'>

        <TextField label={t('dashboard.first_name')} placeholder={user?.firstname} value={newFirstName} onChange={setNewFirstName} />
        <TextField label={t('dashboard.last_name')} placeholder={user?.lastname} value={newLastName} onChange={setNewLastName} />
        {/* <TextField label='Email' placeholder={user?.email} value={newEmail} onChange={setNewEmail} /> */}
        <TextField label={t('dashboard.phone')} placeholder={user?.vendor_info?.business_phone_no ? user?.vendor_info?.business_phone_no : 'Please provide your number'} value={newPhone} onChange={setNewPhone} />
        <TextField label={t('dashboard.region')} placeholder={user?.vendor_info?.region ? user?.vendor_info?.region : 'Please provide your country'} value={newCountry} onChange={setNewCountry} />
        {/* <div>
          <h6 className='text-[14px]'>Country</h6>
          <CountrySelect
            className={styles.select}
            onChange={(e) => {
              setNewCountry(e.name)
            }}
            // remove all the styles
            placeHolder="Select Country"

          />
        </div> */}
        {/* <TextField label='City' placeholder={user?.city ? user.city : 'Please provide your city'} value={newCity} onChange={setNewCity} /> */}
      </div>
      <div className='mt-4' >
        <button className='bg-tertiary-600 text-primary-color px-4 py-2 rounded-md' onClick={handleSaveChanges}>{t('dashboard.save_changes')}</button>
      </div>
    </div>
  )
}

export default VendorEditDetails