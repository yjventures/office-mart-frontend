import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { db } from 'src/firebase' // Ensure this path is correct
import ProfileSidebar from 'components/Profile/ProfileSidebar/ProfileSidebar';
import { IoReorderThreeOutline } from 'react-icons/io5';
import { RiFindReplaceFill } from "react-icons/ri";
import { IoChatbubbles } from "react-icons/io5";
import { useTranslation } from 'react-i18next';


const UserChats = () => {
    const [showSidebar, setShowSidebar] = React.useState(false)
    const [chats, setChats] = useState([])
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user?._id;
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    // const [shopNamesForNewMessage, setShopNamesForNewMessage] = useState([])


    useEffect(() => {
        if (!userId) {
            console.error("User ID is undefined or null.");
            return;
        }

        const q = query(collection(db, "messages"), where("userId", "==", userId));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const groupedMessages = {};

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Unique key for each user-shop pair
                const key = `${data.userId}-${data.shopId}`;
                if (!groupedMessages[key]) {
                    groupedMessages[key] = { ...data, id: doc.id, messages: [data] };
                } else {
                    groupedMessages[key].messages.push(data);
                }
            });

            setChats(Object.values(groupedMessages));
        });

        return () => unsubscribe;
    }, [userId]);
    // console.log(chats)

    // function findShopsWithUnreadMessages() {
    //     const shopsWithUnreadMessages = new Set();

    //     chats.forEach(chat => {
    //         chat.messages.forEach(message => {
    //             console.log('Message:', message);
    //             if (message.userRead === false) {
    //                 console.log('Adding shop:', chat.shopName);
    //                 shopsWithUnreadMessages.add(chat.shopName);
    //             }
    //         });
    //     });

    //     return Array.from(shopsWithUnreadMessages);
    // }

    // useEffect(() => {
    //     const shopsWithUnreadMessages = findShopsWithUnreadMessages();
    //     setShopNamesForNewMessage(shopsWithUnreadMessages);
    // }, [chats]);

    // console.log(shopNamesForNewMessage);


    return (
        <div className='h-full p-3 font-main lg:-ms-10'>
            <div className='lg:flex justify-between items-center relative my-2'>
                <div className='flex items-center'>
                    <IoChatbubbles className='w-5 h-5 text-tertiary-600' />
                    <p className='text-xl font-bold ms-2'>{t('chats.title')}</p>
                </div>
                <div className={`lg:hidden absolute top-0 ${currentLanguage == 'ar' ? 'left-2' : 'right-2'}`}>
                    <IoReorderThreeOutline className='w-[20px] h-[20px] cursor-pointer' onClick={() => setShowSidebar(!showSidebar)} />
                </div>
                {showSidebar && <div className='lg:hidden'><ProfileSidebar /></div>}
            </div>
            {/* Display chats */}
            <div className='flex flex-col gap-2'>
                {chats?.length === 0 ?
                    <div className='flex justify-center items-center mt-20 flex-col gap-4'>
                        <p className=''>You have no conversation yet with any vendor!</p>
                        <button
                            onClick={() => {
                                navigate('/product-catalogue')
                            }}
                            className='mt-4 bg-black text-white py-1 px-3 rounded-[5px] flex justify-center items-center gap-2'
                        >
                            Browse Product
                            <RiFindReplaceFill />
                        </button>
                    </div> : (
                        chats?.map((chat, index) => (
                            <div
                                className='cursor-pointer py-4 shadow-md px-4 rounded-md flex justify-start items-start gap-4'
                                onClick={() => navigate(`/user-single-chat?shopId=${chat.shopId}&shopName=${chat.shopName}&banner=${chat?.banner}`)} // Adjust the route as needed
                                key={index}
                            >
                                <img src={chat?.banner} alt="banner" className='w-14 h-14 object-cover rounded-md' />
                                <div className='flex flex-col gap-2 w-full'>
                                    <div className='flex justify-between items-center'>
                                        <p className='font-[600]'>{chat?.shopName} </p>
                                        {/* {
                                            shopNamesForNewMessage?.find((shop) => shop == chat?.shopName) &&
                                            <span class="bg-tertiary-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ">New Message</span>
                                        } */}
                                    </div>
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
                        ))
                    )}
            </div>
        </div>
    )
}

export default UserChats