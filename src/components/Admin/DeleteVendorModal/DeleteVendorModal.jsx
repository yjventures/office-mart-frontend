import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { showToast } from "src/components/Common/Toastify/Toastify";
import axios from 'axios';

const DeleteVendorModal = ({ setShowDeleteModal, apiEndpoint, type }) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const user = JSON.parse(localStorage.getItem('user'));
    const queryClient = useQueryClient()

    const [loading, setLoading] = useState(false);

    const handleDeleteVendor = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(apiEndpoint, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            // console.log(response);
            if (response.status === 200) {
                showToast('Deleted successfully', 'success');
                queryClient.invalidateQueries({ queryKey: ['users'] });
                queryClient.invalidateQueries({ queryKey: ['customers'] });
                queryClient.invalidateQueries({ queryKey: ['products'] });
            } else {
                showToast('Something went wrong, Please try again', 'error');
            }
        } catch (error) {
            console.error('Error deleting vendor:', error);
            showToast('Something went wrong, Please try again', 'error');
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center px-2'>
            <div className='bg-white rounded-lg p-4 border-2'>
                <p className='text-lg font-bold mb-4'>
                    {
                        `Are you sure you want to delete this ${type ? type : 'account'}?`
                    }
                </p>
                <div className='flex justify-between gap-4'>
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className='px-4 py-2 w-full bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-400 transition'>
                        No
                    </button>
                    <button
                        onClick={handleDeleteVendor}
                        className='px-4 py-2 w-full bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-600 transition'
                        disabled={loading}>
                        {loading ? 'Deleting...' : 'Yes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteVendorModal;