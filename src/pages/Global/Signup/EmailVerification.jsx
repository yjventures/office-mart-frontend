import React, { useState } from 'react'
import Button from 'src/components/Signup/Button'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAtomValue } from 'jotai'
import { verifyEmailAtom } from 'lib/jotai'
import { showToast } from 'src/components/Common/Toastify/Toastify'
import background from 'assets/constant/background/bg-image.png'
import ReactCodeInput from 'react-code-input'
import Spinner from 'src/components/Signup/Spinner'
import { useTranslation } from 'react-i18next'

const EmailVerification = () => {
    const [code, setCode] = useState('')
    const navigate = useNavigate()
    const email = useAtomValue(verifyEmailAtom)
    const [userId, setUserId] = useState('')
    const [loading, setLoading] = useState(false)
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    // console.log(email)
    const handleVerify = async () => {
        setLoading(true)
        if (code === '') {
            showToast('Please enter your verification code', 'error')
            return
        }

        const response = await axios.post(`${import.meta.env.VITE_API_PATH}/users/verify-otp`, {
            "email": email,
            "code": code
        })
        if (response.status === 200) {
            showToast('Email verified successfully', 'success')
            navigate(`/reset-password?userId=${response.data.userId}`)
        } else {
            showToast('Something went wrong', 'error')
        }
        setLoading(false)
    }

    const handlePinChange = pinCode => {
        // console.log(typeof(pinCode))
        if(pinCode == '' || pinCode == null || pinCode == undefined) return;
        setCode(pinCode);
    };

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
                <h2 className='text-center text-secondary-color font-[600] text-[20px] mt-[32px] mb-[12px]'>
                    {t('auth.verify_email')}
                </h2>
                <p className='text-center px-3 pb-[24px] text-gray-600'>
                    {t('auth.verify_title')}
                </p>
                {/* text field */}
                <div className='flex flex-col px-6 pb-6'>
                    <div className='relative flex justify-center'>
                        <ReactCodeInput
                            type='text'
                            fields={4}
                            style={{
                                height: '50px',
                                marginBottom: '30px',
                            }}
                            value={code}
                            onChange={handlePinChange}
                        />

                    </div>
                    {
                        loading ?
                            <Spinner />
                            :
                            <div onClick={handleVerify}>
                                <Button text={t('auth.verify_btn')} />
                            </div>
                    }
                    <p
                        className='text-sm text-tertiary-700 text-center mt-2  font-[600] cursor-pointer'
                        onClick={() => {
                            showToast('Resend code api here', 'info')
                        }}
                    >
                        {t('auth.resend')}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default EmailVerification