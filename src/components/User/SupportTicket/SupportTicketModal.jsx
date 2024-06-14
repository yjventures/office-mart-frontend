import React, { useState } from 'react';
import axios from 'axios';
import { showToast } from 'src/components/Common/Toastify/Toastify';
import { CiCircleRemove } from 'react-icons/ci'; // Assuming you're using react-icons for consistency
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const SupportTicketModal = ({ setShowSupportTicketModal }) => {
    const [caption, setCaption] = useState('');
    const [reason, setReason] = useState('');
    const [detail, setDetail] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    const token = JSON.parse(localStorage.getItem('token'));
    const queryClient = useQueryClient()
    const { t, i18n } = useTranslation()


    const handleCreateSupportTicket = async () => {
        if (caption === '' || detail == '') {
            showToast('Please fillup title and problem', 'info')
            return
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_PATH}/support-tickets/create`, {
                user_id: user?._id,
                caption: caption,
                detail: detail,
            }, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            queryClient.invalidateQueries({ queryKey: ['supportTicket'] });
            queryClient.invalidateQueries({ queryKey: ['profile_sidebar_count'] });
            queryClient.invalidateQueries({ queryKey: ['vendor_info_count'] });
            
            if (response.status === 200) {
                showToast('Support ticket created successfully', 'success');
                setShowSupportTicketModal(false);
            } else {
                showToast('Error creating support ticket', 'error');
            }
        } catch (error) {
            showToast('Something went wrong', 'error');
            console.error('Error creating support ticket:', error);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-2'>
            <div className='bg-white py-4 rounded-sm flex flex-col gap-3 w-[472px]'>
                <div className='flex justify-between px-4 items-center'>
                    <p className='mb-1 uppercase font-[500]'>{t('support_ticket.button')}</p>
                    <CiCircleRemove
                        className='w-6 h-6 cursor-pointer text-gray-400 hover:text-red-500 transition duration-300 ease-in-out'
                        onClick={() => setShowSupportTicketModal(false)}
                    />
                </div>
                <hr />
                <div className='px-4'>
                    <input
                        type="text"
                        placeholder="Give it a title"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className='mt-2 p-2 border-2 border-gray-200 rounded-md w-full outline-none'
                    />
                    {/* <input
                        type="text"
                        placeholder="Problem in less words"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className='mt-2 p-2 border-2 border-gray-200 rounded-md w-full outline-none'
                    /> */}
                    <textarea
                        placeholder="Provide details here"
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                        className='mt-2 p-2 border-2 border-gray-200 rounded-md w-full h-28 outline-none'
                    />
                </div>
                <div className='px-4 py-2'>
                    <button
                        onClick={handleCreateSupportTicket}
                        className='px-3 py-1 border-2 bg-tertiary-700 rounded-md text-white font-medium w-full hover:bg-buttons transition'
                    >
                        {t('support_ticket.submit_btn')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupportTicketModal;