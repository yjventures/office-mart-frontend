import React, { useState } from 'react'
import TextField from 'src/components/Signup/TextField'
import Button from 'src/components/Signup/Button'
import { vendorAtom } from '../../../lib/jotai'
import { useSetAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import background from 'assets/constant/background/bg-image.png'
import { showToast } from 'src/components/Common/Toastify/Toastify'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useTranslation } from 'react-i18next'


const VendorStepOne = () => {
  const setVendorAtom = useSetAtom(vendorAtom)

  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('')
  const [terms, setTerms] = useState(false)
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language;

  const phoneInputStyles = {
    // Add custom styles here
    input: {
      width: '100%',
      padding: '20px 45px',
    }
    // Add more styles if necessary
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const { isPending, isError, error, data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_PATH}/categories/get-all?sortBy=-weight_matrics`,) //&limit=${limit}
        return res.data.categories;

      } catch (error) {
        console.error('Something went wrong')
      }
    }
  })
  // console.log(isError, categories, isPending, error)
  if (isError) {
    showToast('Error loading categories, try again later', 'info')
    console.error(error, 'error')
  }

  // change category
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  // console.log(selectedCategory, 'selected')


  const handleContinueButton = () => {
    if (terms === false) {
      showToast('Please agree to the terms and conditions', 'error')
      return
    }

    if (email && companyName && selectedCountry && selectedCategory && phoneNumber) {
      setVendorAtom({
        business_email: email,
        business_name: companyName,
        region: selectedCountry,
        main_category: selectedCategory,
        business_phone_no: phoneNumber
      })

      navigate('/vendor-step-two')
    } else {
      showToast('Please fill all the fields', 'error')
    }
  }


  // main return
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
      }}
    >
      <div className='max-w-7xl mx-auto mt-[87px] font-main pb-10 lg:pb-20 px-4'>

        <p className='font-teko text-[60px] text-center px-2'>
          {t('vendor_step_one.title')}
        </p>
        <p className='font-teko text-[18px] text-center'>
          {t('vendor_step_one.sub_title')}
        </p>

        <div
          style={{ boxShadow: '0px 7.204px 36.022px 0px rgba(0, 0, 0, 0.12)' }}
          className='bg-white w-full h-[100%] max-w-[786px] mx-auto pb-6 flex justify-center flex-col items-center mt-[20px] font-main'>
          <h2 className='text-center text-gray-dark font-[600] text-[18px] mt-[14px] pb-[12px] border-b-2 w-full border-b-gray-100'>
            {t('vendor_step_one.form_title')}
          </h2>
          <div className='w-[100%] grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-4'>
            <TextField label={t('vendor_step_one.company_email')} type='email' placeholder='' value={email} onChange={setEmail} />
            <TextField label={t('vendor_step_one.company_name')} type='text' placeholder='' value={companyName} onChange={setCompanyName} />
            <TextField label={t('vendor_step_one.company_address')} type='text' placeholder='' value={selectedCountry} onChange={setSelectedCountry} />

            {/* <div>
              <label className='text-sm text-gray-700 text-[12px] font-[500]'>
                Region where company is located
              </label>
              <select
                className='w-[100%] px-2 py-2.5 border outline-none'
                value={selectedCountry}
                onChange={handleCountryChange}
              >
                <option value=''>Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div> */}

            <div className='flex justify-center items-center mt-2 w-full relative'>
              <label className='absolute -top-[25px] sm:-top-[10px] left-1 text-sm'>{t('vendor_step_one.company_phone')}</label>
              <PhoneInput
                country={'lb'}
                onlyCountries={['lb']}
                value={phoneNumber}
                onChange={phone => setPhoneNumber(phone)}
                disableDropdown={true}
                inputStyle={phoneInputStyles.input}
              />
            </div>
            {/* <TextField label='Phone Number' type='text' placeholder='' value={phoneNumber} onChange={setPhoneNumber} /> */}
          </div>
          <div className='w-full px-6'>
            <select
              className='w-[100%] px-2 py-2.5 border outline-none'
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value=''>{t('vendor_step_one.select_category')}</option>
              {
                isPending && <option value='loading'>Loading</option>
              }
              {
                categories?.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))
              }
            </select>
          </div>

          <div className='w-full px-6 mt-6' onClick={handleContinueButton}>
            <Button text={t('vendor_step_one.continue')} />
          </div>
          <div className='flex items-center mb-4 w-full px-6'>
            <input type='checkbox' className='mr-2 mb-4 w-4 h-4 text-tertiary-500 mt-4' onChange={() => {
              setTerms(!terms)
            }} />
            <p className='text-sm text-gray-400 mx-2'>{t('vendor_step_one.agree')} <span className='text-tertiary-700 cursor-pointer'>{t('vendor_step_one.terms')}</span> {t('vendor_step_one.and')} <span className='text-tertiary-700 cursor-pointer'> {t('vendor_step_one.privacy')}</span></p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default VendorStepOne