import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { showToast } from "src/components/Common/Toastify/Toastify";
import axios from 'axios';
import { IoIosInformationCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoClose, IoCloseCircleSharp } from "react-icons/io5";

const RefundListModal = ({ setShowRefundModal, selectedItem }) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const user = JSON.parse(localStorage.getItem('user'));
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    // const handleDeleteVendor = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await axios.delete(apiEndpoint, {
    //             headers: {
    //                 Authorization: `Bearer ${token.accessToken}`
    //             }
    //         });
    //         console.log(response);
    //         if (response.status === 200) {
    //             showToast('Deleted successfully', 'success');
    //             queryClient.invalidateQueries({ queryKey: ['users'] });
    //             queryClient.invalidateQueries({ queryKey: ['customers'] });
    //             queryClient.invalidateQueries({ queryKey: ['products'] });
    //         } else {
    //             showToast('Something went wrong, Please try again', 'error');
    //         }
    //     } catch (error) {
    //         console.error('Error deleting vendor:', error);
    //         showToast('Something went wrong, Please try again', 'error');
    //     } finally {
    //         setLoading(false);
    //         setShowDeleteModal(false);
    //     }
    // };
    // console.log(selectedItem)

    return (
        <div className='fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center px-2 '>
            <div className='bg-white rounded-lg p-4 border-2 min-w-[550px] relative'>
                <p className='text-lg font-bold mb-4 uppercase flex items-center gap-2 border-b-2 pb-4'>
                    <IoIosInformationCircle className="text-gray-400 w-6 h-6" />
                    Explore refund information
                </p>
                <div className="uppercase flex flex-col gap-1">
                    <p>Reason : <span className='font-semibold'>{selectedItem?.reason?.en ? selectedItem?.reason?.en : 'System upgraded | Please delete this refund'}</span> </p>
                    <p>Refund ID : <span className='font-semibold'>#{selectedItem?._id}</span></p>
                    <p>Order ID : <span className='font-semibold'>#{selectedItem?.order?._id}</span></p>
                    <p>Product Name : <span className='font-semibold'> {selectedItem?.product_item?.name?.en} </span></p>
                    <p>Delivery Method : <span className='font-semibold'> {selectedItem?.order?.payment_method} </span></p>
                    <p>Total amount : <span className='font-semibold'> {selectedItem?.order?.total_price} USD </span></p>
                </div>
                <button
                    onClick={() => setShowRefundModal(false)}
                    className='px-4 py-2 bg-tertiary-500 text-white rounded-md
                         focus:outline-none focus:ring focus:ring-gray-400 transition flex justify-center items-center gap-2 absolute top-2 right-4'
                >
                    <IoCloseCircleSharp className="w-5 h-5 " />
                </button>
            </div>
        </div>
    );
};

export default RefundListModal;