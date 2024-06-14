import axios from "axios";
import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom"
import { userAtom } from "lib/jotai";
import { showToast } from "components/Common/Toastify/Toastify";
import { useTranslation } from "react-i18next";

export default function Authenticate() {
    // check token from params
    const token = useParams().token;
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    // console.log(token)
    // if email and token is present in url then hit new api to verify email
    const navigate = useNavigate();
    const userData = useSetAtom(userAtom)
    // function to send email verification request
    const verifyEmail = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_PATH}/auth/verify`, {
                token
            })

            // console.log(response.data)
            if (response.data.status == 'success') {
                userData(response.data.data)
                showToast('Email verified successfully', 'success')
                if (response.data.data.type == 'vendor') {
                    navigate('/signin?type=vendor')
                } else {
                    navigate('/signin')
                }
            } else {
                showToast('Something went wrong, Please re-check email', 'error')
                navigate('/signup')
            }
        } catch (error) {
            showToast('Something went wrong', 'error')
            navigate('/signup')
        }
    }
    const initialized = useRef(false)
    // once token is found then hit api to verify email
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            if (token) {
                verifyEmail()
            }
        }
    }, [token])

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 font-main">
            <div className="max-w-md w-full space-y-8 flex justify-center items-center flex-col">
                {
                    token ?
                        <p className="text-center"> {t('authenticate.please_wait')}</p>
                        : <div>
                            <MailIcon className="mx-auto h-12 w-auto" />
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                {t('authenticate.check_your_email')}
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                {t('authenticate.verification_email_sent')}

                            </p>
                        </div>
                }

            </div>
        </main>
    )
}

function MailIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    )
}
