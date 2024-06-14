import React, { useMemo, useState } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { showToast } from 'src/components/Common/Toastify/Toastify';
import { useTranslation } from 'react-i18next';


const DeliveryInput = ({ label, type, placeholder, value, onChange, required }) => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const [country, setCountry] = useState('Lebanon');
    const options = useMemo(() => {
        // Get the original country list data
        const originalOptions = countryList().getData();
        // Filter out Israel from the country list
        const filteredOptions = originalOptions.filter(option => option.value !== 'IL');
        return filteredOptions;
    }, []);
    const handleSelectChange = (selectedOption) => {
        // console.log(selectedOption);
        setCountry(selectedOption.label); // Set only the value of the selected option
        onChange(selectedOption.label); // Call the parent component's onChange with the selected value
    };

    return (
        <div className="relative my-2">
            <label
                htmlFor="name"
                className={`-ms-1 bg-white px-1 text-xs font-medium text-gray-900 mb-2 ${currentLanguage == 'ar' ? 'right-2' : 'left-2'}`}
            >
                {label} {required && <span className="text-red-600">*</span>}
            </label>
            {label === 'Country' ? (
                // <Select
                //     options={options}
                //     onChange={handleSelectChange}
                //     value={options.find((option) => option.label === country)}
                //     className="mt-2"
                // />
                <Select
                    defaultValue={options.find(option => option.label === 'Lebanon')}
                    className="mt-2"
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)} // Pass the input value to onChange
                    className="w-full h-10 px-4 border-[1px] border-gray-300 rounded-md focus:outline-none focus:border-green-600 mt-2"
                />
            )}
        </div>
    );
};
export default DeliveryInput