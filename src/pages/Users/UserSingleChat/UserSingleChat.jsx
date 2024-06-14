import React, { useEffect, useState, useRef } from 'react'
import { GoPerson } from "react-icons/go";
import { collection, query, where, onSnapshot, addDoc, limit, orderBy, updateDoc } from "firebase/firestore";
import { db } from 'src/firebase';
import { showToast } from 'src/components/Common/Toastify/Toastify';
import emptyChat from 'assets/global/chat/chat.gif'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { MdArrowBackIosNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { RiSendPlane2Fill } from 'react-icons/ri';
import { userNewMessageAtom } from 'src/lib/jotai';
import { useAtom } from 'jotai';

export default function UserSingleChat() {
    const queryParams = new URLSearchParams(window.location.search);
    const [userNewMessage, setUserNewMessage] = useAtom(userNewMessageAtom)
    const shopId = queryParams.get('shopId')
    const shopName = queryParams.get('shopName')
    const shopBanner = queryParams.get('banner')
    const messageInputRef = useRef(null);
    // console.log(shopName)
    const user = JSON.parse(localStorage.getItem('user'))
    const [chats, setChats] = useState([])
    const [message, setMessage] = useState('')
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const navigate = useNavigate()
    const handleSendMessage = async (e) => {
        // e.preventDefault();
        if (message.trim() === "") {
            showToast('Enter valid message!', 'info')
            return;
        }

        const newMessage = {
            userName: user.firstname + ' ' + user.lastname,
            shopName: shopName,
            message: message,
            createAt: new Date(),
            type: user.type,
            shopId: shopId,
            userId: user._id,
            banner: shopBanner,
            userImage: user.image || '',
            vendorRead: false
        };
        
        setMessage('');
        if (messageInputRef.current) {
            messageInputRef.current.value = '';
        }
        try {
            const docRef = await addDoc(collection(db, "messages"), newMessage);
            const updatedChats = [...chats, { ...newMessage, id: docRef.id, createAt: { seconds: newMessage.createAt.getTime() / 1000, nanoseconds: 0 } }];
            updatedChats.sort((a, b) => (a.createAt.seconds - b.createAt.seconds));
            setChats(updatedChats);


        } catch (error) {
            console.error(error)
            showToast('Somehow message is not sending! ', 'error')
        }

        // send notification to vendor to notify message
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_PATH}/shops/get-user`, {
                "shop": shopId
            })

            const notificationResponse = await axios.post(`${import.meta.env.VITE_API_PATH}/auth/send-multidevice-notification`,
                {
                    userId: res?.data?.user?._id,
                    message: {
                        "title": "Hurry up!",
                        "body": `You got a new message from ${user.firstname + ' ' + user.lastname}`,
                    }
                },
            )

            if (notificationResponse.status == 200) {
                // console.log('Notification sent to vendor successfully')
            } else {
                console.error('Failed to send notification')
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (!shopId || !user?._id) {
            console.error("Shop ID or user ID is not specified.");
            return;
        }

        const q = query(
            collection(db, "messages"),
            where("shopId", "==", shopId),
            where("userId", "==", user?._id),
            // limit(4),
            // orderBy("createAt", "desc"),
        );

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const messages = [];

            querySnapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            messages.sort((a, b) => (a.createAt.seconds - b.createAt.seconds));
            setChats(messages);
        });
        return () => unsubscribe;
    }, [shopId, user?._id, chats]);

    // console.log(chats)

    useEffect(() => {
        if (!shopId || !user?._id) {
            console.error("Shop ID or user ID is not specified.");
            return;
        }

        const q = query(
            collection(db, "messages"),
            where("shopId", "==", shopId),
            where("userId", "==", user?._id),
            where("userRead", "==", false) // Only fetch messages where userRead is false
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                updateDoc(doc.ref, { userRead: true });
            });
        });
        setUserNewMessage(false)
        return () => unsubscribe;
    }, [shopId, user?._id, chats]);

    return (
        <div className='h-[150vh] md:h-dvh overflow-x-hidden overflow-y-auto relative chats' dir={currentLanguage == 'ar' && 'rtl'} >
            <div
                className='flex justify-start items-center gap-3 cursor-pointer'
                onClick={() => {
                    navigate('/user-chats')
                }}
            >
                <MdArrowBackIosNew className='w-4 h-4 ' />
                <p className='font-[600] mb-[2px]'>Go Back</p>
            </div>
            {
                chats.length == 0 &&
                <div className='flex justify-center items-center flex-col h-[]'>
                    <img src={emptyChat} alt="empty chat" className='w-[200px] h-[200px]' />
                    <p className='text-lg'>No conversation done yet! </p>
                </div>
            }
            {
                chats?.map((chat, index) => {
                    const timestamp = new Date(chat?.createAt?.seconds * 1000 + chat?.createAt?.nanoseconds / 1000000);
                    const formattedDate = `${timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} | ${timestamp.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}`;

                    return (
                        <div className='my-1 flex flex-col py-4' key={index}>
                            <div className='flex justify-start items-center gap-4 mb-2'>
                                {/* {
                                    user.image ?
                                        <img src={user.image} className='w-12 h-12 rounded-full border-[2px] p-1 text-gray-400 object-contain' /> :
                                        <GoPerson className='w-12 h-12 rounded-full border-[2px] p-1 text-gray-400' />
                                } */}
                                {
                                    chat?.type == 'customer' ?
                                        <>
                                            {
                                                chat?.userImage ? <img src={chat?.userImage} className='w-12 h-12 rounded-full border-[2px] p-[1px] text-gray-400 object-contain' /> :
                                                    <GoPerson className='w-12 h-12 rounded-full border-[2px] p-1 text-gray-400' />
                                            }
                                        </>
                                        :
                                        <>
                                            {
                                                chat?.banner ? <img src={chat?.banner} className='w-12 h-12 rounded-full border-[2px] p-[1px] text-gray-400 object-contain' /> :
                                                    <GoPerson className='w-12 h-12 rounded-full border-[2px] p-1 text-gray-400' />
                                            }
                                        </>
                                }
                                <div>
                                    <p className='font-[600] text-[18px]'>{chat?.type == 'customer' ? chat.userName : chat.shopName}</p>
                                    <p className='text-gray-400 text-sm'>{formattedDate}</p>
                                </div>
                            </div>
                            <p className={`mt-2 ms-16  pb-3 ${chats?.length !== index + 1 && 'border-b-[2px] border-gray-100'}`}>
                                {chat.message}
                            </p>
                        </div>
                    )
                })
            }

            <div className="relative sm:mr-2">
                <input
                    type='text'
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={chats?.length === 0 ? `${t('chats.start_conversation')}` : `${t('chats.send_message')}`}
                    className='bg-gray-50 text-black border-2 w-full mt-8 py-3 outline-none px-3 rounded-md'
                    cols="30"
                    rows="1"
                    ref={messageInputRef}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            handleSendMessage();
                        }
                    }}
                />

                <button
                    onClick={handleSendMessage}
                    className={`${message?.length > 0 ? `bg-tertiary-500` : `bg-tertiary-500 opacity-50`} text-white p-1 mt-3 flex items-center rounded-full absolute bottom-[10px] transition ${currentLanguage == 'ar' ? `left-3` : 'right-2'}`}
                >
                    <span className='ps-2 pe-1'>{t('chats.send')}</span>
                    <RiSendPlane2Fill className='h-6 w-6 p-1' />
                </button>
            </div>
        </div>
    )
}