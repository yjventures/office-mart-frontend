import React, { useEffect, useState } from 'react'
import TextField from 'src/components/Signup/TextField'
import Button from 'src/components/Signup/Button'
import GoogleAndAppleButton from 'src/components/Signup/GoogleAndAppleButton'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { authLoadingAtom, tokenAtom, userAtom } from 'lib/jotai'
import { useSetAtom } from 'jotai'
import Spinner from 'src/components/Signup/Spinner'
import background from 'assets/constant/background/bg-image.png'
import { showToast } from 'src/components/Common/Toastify/Toastify'
import { useTranslation } from 'react-i18next'
import { requestPermission } from 'src/firebase'

const AdminSignin = ({ }) => {
    const navigate = useNavigate()
    const setUserAtom = useSetAtom(userAtom)
    const setAuthLoadingAtom = useSetAtom(authLoadingAtom)
    const setTokenAtom = useSetAtom(tokenAtom)
    // const params = new URLSearchParams(window.location.search)
    // const type = params.get('type')
    const location = useLocation();
    const path = location.pathname;
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const from = location.state?.from?.pathname || '/';

    const [token, setToken] = useState(null);
    useEffect(() => {
        const handleRequest = async () => {
            const lastToken = await requestPermission();
            // console.log(lastToken, 'use effect token');
            setToken(lastToken);
        };
        const isDeviceisIphone = () => {
            if (typeof window === undefined || typeof navigator === undefined) return false;
            return /iPhone|iPad|iPod/i.test(navigator.userAgent);
        };
        const iphone = isDeviceisIphone();
        // console.log('Is that an Iphone ?', iphone)
        if (iphone) {
            console.log('Mehdi vai apne shamlan')
        } else {
            handleRequest();
        }
    }, [])

    const handleSignin = async () => {

        const isDeviceisIphone = () => {
            if (typeof window === undefined || typeof navigator === undefined) return false;
            return /iPhone|iPad|iPod/i.test(navigator.userAgent);
        };
        const iphone = isDeviceisIphone();
        // console.log('Is that an Iphone ?', iphone)
        if (iphone) {
            console.log('Mehdi vai apne shamlan')
        } else {
            const lastToken = await requestPermission();
            setToken(lastToken);
        }

        // check everything is filled
        if (!email || !password) {
            showToast('Please fill all the fields', 'error')
            return;
        }
        // console.log(token, 'singin token')
        // setAuthLoadingAtom(true)
        setLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_PATH}/auth/login`, {
                "email": email,
                "password": password,
                "type": "email",
                "userType": 'admin',
                "fcm_token": token
            });
            // console.log(response.data)
            // Check the status code for success
            if (response.data) {
                setTokenAtom({
                    accessToken: response.data?.data?.user?.accessToken,
                    refreshToken: response.data?.data?.user?.refreshToken
                })
                setUserAtom(response?.data?.data?.user);
                if (response?.data?.data?.user?.type == 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate(from, { replace: true });
                }

            } else {
                console.error(response)
                showToast('Something went wrong', 'error')
            }

        } catch (error) {
            showToast(error?.response?.data?.message, 'error')
            console.error(error.response.data.message)
        }
        setLoading(false)
    }

    return (
        <div
            // add background image
            style={{
                backgroundImage: `url(${background})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
            }}
            className=' w-full h-[100%] flex justify-center flex-col items-center font-main py-[53px] px-2'>
            <div className='bg-white lg:my-32 w-[100%] max-w-[380px] border bottom-1 flex justify-between flex-col' style={{ boxShadow: '0px 7.204px 36.022px 0px rgba(0, 0, 0, 0.12)' }}>
                {/* tab for switching singin and singup */}
                <div className='flex w-full py-3 text-black'>
                    <p className={`text-xl w-[100%] pb-2 text-center font-[600] border-b-4 border-[#A6E66E] cursor-pointer`} >
                        ADMIN SIGN IN
                    </p>
                    {/* 
                    <p className={`text-xl w-[100%] pb-2 text-center font-normal cursor-pointer`} onClick={() => {
                        if (type) {
                            if (path.includes('vendor')) {
                                navigate(`/vendor-signup?type=${type}`)
                            } else {
                                navigate(`/signup?type=${type}`)
                            }
                        } else {
                            if (path.includes('vendor')) {
                                navigate(`/vendor-signup`)
                            } else {
                                navigate('/signup')
                            }

                        }
                    }}>
                        Sign Up
                    </p> */}
                </div>
                {/* show different tabs based on selected tab numbers */}
                <div className='flex flex-col px-6 pb-6'>
                    <TextField label={t('auth.email')} type='email' placeholder='' value={email} onChange={setEmail} />
                    <div className='relative'>
                        <TextField label={t('auth.password')} type='password' placeholder='' value={password} onChange={setPassword} />
                        <NavLink to='/forget-password' className={`text-sm text-tertiary-700 text-right absolute top-1 font-[600] cursor-pointer ${currentLanguage == 'en' ? 'right-1' : 'left-1'}`}>{t('auth.forgot_password')}</NavLink>
                    </div>

                    {/* handle singin  */}
                    {
                        loading == true ?
                            // spinner
                            <Spinner />
                            : <div onClick={handleSignin}>
                                <Button text={t('auth.signin')} />
                            </div>
                    }
                    {/* 0auth registration*/}
                    {/* <div className='flex justify-center items-center mt-[20px] mb-[15px]'>
                        <div className='w-[100%] h-[1px] bg-gray-300'></div>
                        <p className='text-sm text-gray-400 mx-2 mb-1'>or</p>
                        <div className='w-[100%] h-[1px] bg-gray-300'></div>
                    </div> */}

                    {/* google and apple button */}
                    {/* <GoogleAndAppleButton type={'google'} text={'Sign up with Google'} />
                    <p className='h-4'></p>
                    <GoogleAndAppleButton type={'apple'} text={'Sign up with Apple'} /> */}

                </div>
            </div>

        </div>
    )
}

export default AdminSignin