import { collection, onSnapshot, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VendorHeader from 'src/components/Vendor/VendorHeader/VendorHeader'
import { db } from 'src/firebase'
import emptyChat from 'assets/global/chat/chat.gif'
import { useTranslation } from 'react-i18next'
import { GoPerson } from 'react-icons/go'


const VendorChats = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [chats, setChats] = useState([])
    const navigate = useNavigate();
    const shopId = user?.vendor_info?.shop?._id;
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;

    useEffect(() => {
        // Ensure shopId is not undefined or null
        if (!shopId) {
            console.error("Shop ID is undefined or null. Make sure the user is associated with a shop.");
            return;
        }

        const q = query(collection(db, "messages"), where("shopId", "==", shopId));
        // This query now only fetches messages where the shopId matches the current user's shopId

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const groupedMessages = {};

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const key = `${data.shopId}-${data.userId}`; // Unique key for each user-shop pair
                if (!groupedMessages[key]) {
                    groupedMessages[key] = { ...data, id: doc.id, messages: [data] };
                } else {
                    groupedMessages[key].messages.push(data);
                }
            });

            setChats(Object.values(groupedMessages)); // Convert the grouped messages object back to an array
        });

        return () => unsubscribe;
    }, []);
    // console.log(chats)

    return (
        <div className='font-main '>
            <VendorHeader text={t('chats.title')} />
            <div className='lg:ms-2 mt-4'>

                {
                    chats.length == 0 &&
                    <div className='flex justify-center items-center flex-col mt-20'>
                        <img src={emptyChat} alt="empty chat" className='w-[200px] h-[200px]' />
                        <p className='text-lg'> There is no message to your shop yet! </p>
                    </div>
                }
                {/* map the chat list */}
                {
                    chats?.map((chat, index) => {
                        return (
                            <div
                                className='cursor-pointer py-4 shadow-md px-4 rounded-md flex gap-4 items-center'
                                onClick={() => {
                                    // navigate(`/vendor-single-chat/${chat.shopId}`)
                                    navigate(`/vendor-single-chat?shopId=${chat.shopId}&userId=${chat.userId}`);
                                }}
                                key={index}
                            >
                                {
                                    chat?.userImage ? <img src={chat?.userImage} className='w-16 h-16 rounded-lg p-[1px] text-gray-400 object-contain' /> :
                                        <GoPerson className='w-16 h-16 rounded-md border-[2px] p-1 text-gray-400' />
                                }

                                <div className='flex flex-col gap-2'>
                                    <p className='font-[600]'>{chat?.userName}</p>
                                    <p className=''>
                                        {chat && chat?.messages && chat?.messages?.length > 0 && (
                                            (() => {
                                                // Sort messages by timestamp
                                                const sortedMessages = chat?.messages?.sort((a, b) => a.createAt.seconds - b.createAt.seconds);
                                                // Get the last message
                                                const lastMessage = sortedMessages[sortedMessages.length - 1];
                                                // Display the last message
                                                return lastMessage && lastMessage.message;
                                            })()
                                        )}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default VendorChats