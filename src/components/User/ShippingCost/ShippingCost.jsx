import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { userDestinationCost, userDestinationVat } from 'src/lib/jotai';
import { calculateTaxAmount } from 'src/lib/helper/calculateTax';

function ShippingDestinationComponent({ shippingAndVats, subtotal }) {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;

    const [shippingDestinationCost, setShippingDestinationCost] = useAtom(userDestinationCost)
    const [shippingDestinationVat, setShippingDestinationVat] = useAtom(userDestinationVat)
    const [myDestination, setMyDestination] = useState(shippingAndVats && shippingAndVats[0]?.area || '')

    useEffect(() => {
        setShippingDestinationCost(shippingAndVats && shippingAndVats[0]?.shipping_charge)
        setShippingDestinationVat(shippingAndVats && shippingAndVats[0]?.vat)
        setMyDestination(shippingAndVats && shippingAndVats[0]?.area)
    }, [shippingAndVats])


    const handleCostChange = (place) => {
        setMyDestination(place.area);
        setShippingDestinationCost(place.shipping_charge);
        setShippingDestinationVat(place.vat)
        const newCartData = JSON.parse(localStorage.getItem('cartItems'))

        const updatedCartItems = {
            ...newCartData,
            tax: Number(calculateTaxAmount(Number(subtotal), Number(place.vat)))  
        }
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems))

        // console.log(updatedCartItems)
    }

    return (
        <div>
            <p className='text-black font-[600] my-2'>{t('cart.shipping_estimates')}</p>
            <p className="mt-1 text-sm text-gray-500">Choose any of the options that match you best</p>
            <fieldset className="mt-2">
                <legend className="sr-only">Shipping destination</legend>
                <div className="divide-y divide-gray-200">
                    {shippingAndVats?.map((place, placeIdx) => (
                        <div key={placeIdx} className="relative flex items-start pb-4 pt-3.5">
                            <div className="min-w-0 flex-1 text-sm leading-6">
                                <label htmlFor={`place-${place.id}`} className="font-medium text-gray-900">
                                    {place?.area}
                                </label>
                                <p id={`place-${place.id}-description`} className="text-gray-500">
                                    Charge upto {place?.shipping_charge} USD
                                </p>
                            </div>
                            <div className="ml-3 flex h-6 items-center">
                                <input
                                    id={`place-${place.id}`}
                                    name="place"
                                    type="radio"
                                    onClick={() => {
                                        handleCostChange(place);
                                    }}
                                    checked={myDestination === place?.area}
                                    defaultChecked={shippingAndVats[0]?.area}
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                />
                            </div>
                        </div>
                    ))}

                </div>
            </fieldset>
        </div >
    )
}

export default ShippingDestinationComponent