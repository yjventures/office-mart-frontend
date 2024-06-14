import React, { useState } from 'react'
import TextField from 'src/components/Signup/TextField'
import Button from 'src/components/Signup/Button'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSetAtom } from 'jotai'
import { verifyEmailAtom } from 'lib/jotai'
import { showToast } from 'src/components/Common/Toastify/Toastify'
import background from 'assets/constant/background/bg-image.png'
import Spinner from 'src/components/Signup/Spinner'
import { useTranslation } from 'react-i18next'

const ForgetPassword = () => {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const setverifyEmail = useSetAtom(verifyEmailAtom)
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    // console.log(email)
    const handleSendCode = async () => {
        setLoading(true)
        if (email === '') {
            showToast('Please enter your email address', 'error')
            setLoading(false)
            return
        }
        // validate email
        const emailRegex = /\S+@\S+\.\S+/
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error')
            setLoading(false)
            return
        }
        // set email in jotai
        setverifyEmail(email)
        // calling api
        const response = await axios.post(`${import.meta.env.VITE_API_PATH}/users/forget-password`, { email: email })
        if (response.status === 200) {
            showToast('Email sent successfully', 'success')
            navigate('/email-verificaiton')
            setLoading(false)
        } else {
            showToast('Something went wrong', 'error')
            setLoading(false)
        }

    }

    return (
        <div
            style={{
                backgroundImage: `url(${background})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
            }}
            className='w-full h-[100%] flex justify-center flex-col items-center py-[53px] font-main'>
            <div className='bg-white w-[100%] max-w-[380px] flex justify-between flex-col' style={{ boxShadow: '0px 7.204px 36.022px 0px rgba(0, 0, 0, 0.12)' }}>
                {/* header part */}
                <h2 className='text-center text-secondary-color font-[600] text-[20px] mt-[32px] mb-[12px]'>
                    {t('auth.forgot_password')}
                </h2>
                <p className='text-center px-3 pb-[24px] text-gray-600'>
                    {t('auth.forgot_title')}
                </p>

                <div className='flex flex-col px-6 pb-6'>
                    {/* text field */}
                    <TextField label={t('auth.email')} type='email' placeholder='' value={email} onChange={setEmail} />
                    {
                        loading ?
                            <Spinner /> :
                            <div onClick={handleSendCode}>
                                <Button text={t('auth.send_code')} />
                            </div>
                    }


                    {/* extra links */}
                    <div className='text-[14px] space-y-1 my-[24px] pb-6 border-b-2 border-gray-200'>
                        <p className='text-gray-600'>
                            {t('auth.already_have')}  <NavLink to="/signin" className='text-tertiary-700 font-[500]'>  {t('auth.signin')}</NavLink>
                        </p>
                        <p className='text-gray-600'>
                            {t('auth.dont_have')} <NavLink to="/signup" className='text-tertiary-700 font-[500]'> {t('auth.signup')}</NavLink>
                        </p>
                    </div>
                    <p className='text-[14px] text-gray-600'>
                        {t('auth.forgot_password_contact_first_part')}  <NavLink to={'/customerService'} style={{ color: "#2DB224", fontWeight: 600 }}>{t('auth.forgot_password_customer_service')}</NavLink>  {t('auth.forgot_password_contact_last_part')}
                    </p>

                </div>
            </div>
        </div>
    )
}

export default ForgetPassword