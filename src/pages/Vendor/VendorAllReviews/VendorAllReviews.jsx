import React, { useState } from 'react'
import VendorHeader from 'src/components/Vendor/VendorHeader/VendorHeader'
import mobile from 'assets/vendor/mobile.png'
import { IoFilterCircleOutline, IoSearchOutline } from 'react-icons/io5'
import PaginationComponent from 'src/components/Admin/Pagination/PaginationComponent'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { newProductAtom } from 'src/lib/jotai'

const VendorAllReviews = () => {
    const { id } = useParams();
    const newProduct = useAtomValue(newProductAtom)

    const [search, setSearch] = useState('');

    const { isPending: reviewPending, isError: reviewError, data: reviewData } = useQuery({
        queryKey: ['product_review', id],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/reviews/get-all?product_id=${id}`)
            const result = await response.json();
            return result.reviews;
        }

    })
    const navigate = useNavigate();
    // Mapping between table headers and data properties
    const columnMappings = {
        // 'Name': 'customer.firstname',
        'Review': 'feedback',
        'Ratings': 'rating',
        'Date': 'updatedAt'
        // Add more mappings for additional columns
    };


    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    // component for table cell
    const ProductTableCell = ({ label, hiddenOnLG, type }) => {
        const cellClasses = classNames(
            hiddenOnLG && 'hidden lg:table-cell',
            'px-3 py-3.5 text-sm text-gray-500'
        );

        return (
            <td className={cellClasses}>
                {
                    type == 'rating' ?
                        <p className=''>
                            {label} {type == 'rating' && '⭐️'}
                        </p> :
                        <div className=''>
                            {
                                type == 'updatedAt' ?
                                    <p>
                                        {new Date(label).toDateString()}
                                    </p> :
                                    <p>
                                        {label}
                                    </p>
                            }
                        </div>
                }

            </td>
        );
    };

    return (
        <div className='font-main lg:-ms-10'>
            <VendorHeader text='Product Review' />
            {/* name and image */}
            <div className='flex items-center gap-2 mt-6 ms-2 bg-gray-50 py-1'>
                <img src={newProduct?.images[0]} alt="image" className='w-10 h-10 rounded-sm object-contain' />
                <p>
                    {
                        newProduct?.name?.en
                    }
                </p>
            </div>
            {/* searching and filtering */}
            {/* <div className='flex justify-between items-center gap-3 mt-4'>
                <div className='relative text-[12px] w-full'>
                    <input type="text"
                        placeholder='Search a product'
                        // search text here
                        onChange={(e) => setSearch(e.target.value.toLowerCase())}
                        className='shadow-sm rounded-md px-8 py-2 w-full lg:w-[550px] outline-none text-gray-500' />
                    <IoSearchOutline className='absolute top-[12px] left-3 text-gray-400' />
                </div>
                <button
                    className="flex items-center space-x-1 px-4 py-1 border-2 border-gray-100 rounded-md"
                    variant="outline"
                // onClick={handleFilters}
                >
                    <span>Filters</span>
                </button>
            </div> */}
            {/* table for all comments */}
            <div className="sm:px-6 lg:px-1 overflow-scroll lg:overflow-hidden">
                <div className="-mx-4 mt-10  sm:mx-0 bg-white">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                {Object.keys(columnMappings).map((header, index) => (
                                    <th
                                        key={index}
                                        scope="col"
                                        className={classNames(
                                            index > 0 && index < Object.keys(columnMappings)?.length - 1 && 'hidden lg:table-cell',
                                            'px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                                        )}
                                    >
                                        {header}
                                    </th>
                                ))}
                                <th
                                    scope="col"
                                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                reviewData?.length === 0 && <p className='py-2 ms-3'>No review available</p>
                            }
                            {
                                reviewData && reviewData?.map((product, productIndex) => (
                                    <tr key={productIndex}>
                                        {Object.keys(columnMappings).map((header, index) => (
                                            <ProductTableCell
                                                key={index}
                                                label={product[columnMappings[header]]}
                                                hiddenOnLG={index > 0 && index < Object.keys(columnMappings).length - 1}
                                                type={columnMappings[header]}
                                            />
                                        ))}
                                        <td>
                                            <MdOutlineRemoveRedEye
                                                onClick={() => {
                                                    navigate(`/product/${id}`)
                                                }}
                                                className='ms-12 cursor-pointer w-5 h-5 text-gray-600 hover:text-tertiary-600 transition'
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {/* pagination */}
                    {/* <PaginationComponent
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    /> */}
                </div>
            </div>
        </div>
    )
}

export default VendorAllReviews