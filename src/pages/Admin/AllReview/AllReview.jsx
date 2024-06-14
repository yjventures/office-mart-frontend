import { Switch } from '@headlessui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { useState } from 'react'
import { AiFillDelete } from 'react-icons/ai';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import AdminHeader from 'src/components/Admin/AdminHeader/AdminHeader';
import PaginationComponent from 'src/components/Admin/Pagination/PaginationComponent';
import { showToast } from 'src/components/Common/Toastify/Toastify';
import { newProductAtom, tokenAtom } from 'src/lib/jotai';

export default function AllReview() {
    const token = useAtomValue(tokenAtom)
    const [productView, setProductView] = useState({})
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [search, setSearch] = useState('')
    const newProduct = useSetAtom(newProductAtom)

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
        queryClient.invalidateQueries({ queryKey: ['products'] });
    };
    const user = JSON.parse(localStorage.getItem('user'))

    const { isPending, isError, error, data } = useQuery({
        queryKey: ['reviews', limit, page],
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/reviews/get-all?limit=${limit}&page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });

                const jsonData = await response.json();
                setTotalPages(Math.ceil(jsonData?.total / limit))
                return jsonData?.reviews;
            } catch (error) {
                console.error(`Error fetching data`);
            }
        },
    });
    // console.log(data)
    if (isError) {
        console.error(error)
    }

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    // component for table cell
    const ProductTableCell = ({ label, hiddenOnLG, type, img }) => {
        const cellClasses = classNames(
            hiddenOnLG && 'hidden lg:table-cell',
            'px-3 py-3.5 text-sm text-gray-500'
        );

        return (
            <td className={cellClasses}>
                {
                    type == 'category' ?
                        <p className=' bg-gray-200 px-3 py-1 rounded-full text-center text-black'>
                            {label}
                        </p> :
                        <p className='flex gap-2 items-center'>
                            {
                                type == 'img' && <img src={img} alt="product" className='w-10 h-10 rounded-md' />
                            }
                            {label}
                        </p>
                }

            </td>
        );
    };


    const handleToggleReviewSwitch = async (reviewId, publish) => {
        // console.log(reviewId, !publish)

        const res = await axios.put(
            `${import.meta.env.VITE_API_PATH}/reviews/update/${reviewId}`,
            {
                publish: !publish
            },
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                }
            }
        );

        if (res.status === 200) {
            showToast(`Review ${publish ? 'unpublished' : 'published'} successfully`, 'info');
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
        } else {
            showToast('Something went wrong, Please try again', 'error');
        }
    };

    return (
        <>
            <AdminHeader browseWebsite={true} addNew={false} search={false} notification={true} profile={true} />

            <div className='font-main bg-gray-100 gap-2 p-2 rounded-sm'>
                <p className='text-[20px] px-2'>Product Reviews</p>
                <div className="sm:px-4 lg:px-1 overflow-scroll lg:overflow-hidden">
                    <div className="-mx-4 mt-6  sm:mx-0 bg-white rounded-md">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className=" py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:table-cell">
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                                    >
                                        Customer
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                                    >
                                        Comment
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                                    >
                                        Rating
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Flag
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        {/* No of Orders */}
                                        Published
                                    </th>
                                    {/* <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    Action
                                </th> */}

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isPending && (
                                        <tr>
                                            <td colSpan='6' className='text-center py-4'>Loading...</td>
                                        </tr>
                                    )
                                }
                                {
                                    data?.length === 0 && (
                                        <tr>
                                            <td colSpan='6' className='text-center py-4'>No Products Found</td>
                                        </tr>
                                    )
                                }
                                {/* all products here */}
                                {
                                    // review page
                                    data
                                        ?.filter((item) => {
                                            return search.toLowerCase() === '' ? item : item?.name?.en?.toLowerCase()?.includes(search);
                                        })
                                        ?.map((product, productIndex) => (
                                            <tr
                                                onClick={() => {
                                                    setProductView(product)
                                                }}
                                                key={productIndex} className={classNames(`border-t border-gray-200 ${product._id === productView?._id && 'bg-gray-50'}`)}>
                                                <ProductTableCell label={product?.product_id?.name?.en} img={product?.product_id?.images[0]} type='img' />
                                                <ProductTableCell label={product?.customer?.firstname + ' ' + product?.customer?.lastname} />
                                                <ProductTableCell label={product?.feedback ? product?.feedback : "No feedback in review"} hiddenOnLG />
                                                <ProductTableCell label={product?.rating} hiddenOnLG />
                                                <ProductTableCell label={product?.flag == true ? <span className='bg-red-500 px-3 py-1 text-white rounded-full'>Flag</span> : <span className='bg-tertiary-500 px-3 py-1 text-white rounded-full'>Good</span>} hiddenOnLG />

                                                <td
                                                    className={classNames(
                                                        productIndex === 0 ? '' : 'border-t border-gray-200',
                                                        'px-3 py-3.5 text-sm text-gray-500'
                                                    )}
                                                >
                                                    <Switch
                                                        checked={product.is_published}
                                                        onChange={() => {
                                                            newProduct(product)
                                                            handleToggleReviewSwitch(product?._id, product?.publish)
                                                        }}
                                                        className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none ms-3"
                                                    >
                                                        <span aria-hidden="true" className="pointer-events-none absolute h-full w-full rounded-md bg-white" />
                                                        <span
                                                            aria-hidden="true"
                                                            className={classNames(
                                                                product.publish == true ? 'bg-buttons' : 'bg-gray-200',
                                                                'pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out'
                                                            )}
                                                        />
                                                        <span
                                                            aria-hidden="true"
                                                            className={classNames(
                                                                product.publish ? 'translate-x-5' : 'translate-x-0',
                                                                'pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out'
                                                            )}
                                                        />
                                                    </Switch>
                                                </td>
                                                {/* <td
                                                className={classNames(
                                                    productIndex === 0 ? '' : 'border-t border-gray-200',
                                                    'ms-4 relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-center items-center gap-2'
                                                )
                                                }
                                            >
                                                <AiFillDelete
                                                    onClick={handleDeleteProduct(product?._id)}
                                                    className='mr-2 mt-2 cursor-pointer w-5 h-5 text-gray-600 hover:text-red-600 transition '
                                                />

                                            </td> */}
                                            </tr>
                                        ))}
                            </tbody>
                        </table>
                        {/* pagination */}
                        <PaginationComponent
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
