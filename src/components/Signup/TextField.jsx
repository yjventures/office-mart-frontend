import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";

const TextField = ({ label, type, placeholder, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='flex justify-start items-start flex-col mb-1'>
            {type !== 'password' ? (
                <>
                    <label htmlFor={label} className='text-sm text-gray-700 mb-[6px] text-[12px] font-[500] '>
                        {label}
                    </label>
                    <input
                        className='border-[1px] border-gray-300 rounded-sm py-2 mb-3 w-[100%] outline-none px-2'
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </>
            ) : (
                <div className='relative w-[100%]'>
                    <label htmlFor={label} className='text-sm text-gray-700 text-[12px] font-[500] '>
                        {label}
                    </label>
                    <input
                        className='border-[1px] border-gray-300 rounded-sm py-2 mb-3 w-[100%] outline-none px-2 mt-[6px]'
                        type={showPassword ? 'text' : 'password'}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    {showPassword ? (
                        <FiEyeOff className={`text-gray-400 text-xl cursor-pointer absolute top-10 ${currentLanguage == 'en' ? 'right-3' : 'left-3'}`} onClick={toggleShowPassword} />
                    ) : (
                        <FiEye className={`text-gray-400 text-xl cursor-pointer absolute top-10 ${currentLanguage == 'en' ? 'right-3' : 'left-3'}`} onClick={toggleShowPassword} />
                    )}
                </div>
            )}
        </div>
    );
};

export default TextField;