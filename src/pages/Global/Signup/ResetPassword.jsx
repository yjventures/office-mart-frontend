import React, { useState } from 'react'
import TextField from 'src/components/Signup/TextField'
import { NavLink, useNavigate } from 'react-router-dom'
import Button from 'src/components/Signup/Button'
import axios from 'axios'
import { showToast } from 'src/components/Common/Toastify/Toastify'
import background from 'assets/constant/background/bg-image.png'
import { useTranslation } from 'react-i18next'

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const navigate = useNavigate()
    const query = new URLSearchParams(window.location.search)
    const userId = query.get('userId')
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    console.log(userId)

    const handleResetPassword = async () => {
        if (password === '') {
            showToast('Please enter your password', 'error')
            return
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            showToast('Password must be at least 8 characters with one uppercase letter and a number', 'error');
            return;
        }
        if (confirmPassword === '') {
            showToast('Please enter your confirm password field', 'error')
            return
        }
        if (password !== confirmPassword) {
            showToast('Password and confirm password must be same', 'error')
            return
        }

        // calling api
        const res = await axios.put(`${import.meta.env.VITE_API_PATH}/users/reset-password`, {
            "password": password,
            "userId": userId
        })
        if (res.status === 200) {
            const user = res?.data?.user
            showToast('Password reset successfully', 'success')
            if (user.type == 'vendor') {
                navigate(`/signin?type=vendor`)
            } else {
                navigate(`/signin`)
            }
        } else {
            showToast('Something went wrong', 'error')
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
            className='px-4 w-full h-[100%] flex justify-center flex-col items-center font-main py-[53px]'>
            <div className='bg-white w-[100%] max-w-[380px] border bottom-1 flex justify-between flex-col' style={{ boxShadow: '0px 7.204px 36.022px 0px rgba(0, 0, 0, 0.12)' }}>
                <h2 className='text-center text-secondary-color font-[600] text-[20px] mt-[32px] mb-[12px]'>
                    {t('auth.reset_pass')}
                </h2>
                <p className='text-center px-2 pb-[24px] text-gray-600'>
                    {t('auth.reset_title')}
                </p>
                <div className='flex flex-col px-6 pb-6'>
                    <TextField label={t('auth.password')} type='password' placeholder={t('auth.eight_plus')} value={password} onChange={setPassword} />
                    <TextField label={t('auth.confirm_password')} type='password' placeholder='' value={confirmPassword} onChange={setConfirmPassword} />

                    <div onClick={handleResetPassword}>
                        <Button text={t('auth.reset_pass')} />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ResetPassword