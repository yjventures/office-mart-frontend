import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from 'src/firebase';
import { collection, query, where, getDocs, addDoc, onSnapshot, limit, orderBy, updateDoc } from 'firebase/firestore';
import { GoPerson } from 'react-icons/go';
import emptyChat from 'assets/global/chat/chat.gif'
import { MdArrowBackIosNew } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";
import axios from 'axios'
import { showToast } from 'src/components/Common/Toastify/Toastify';
import { vendorNewMessageAtom } from 'src/lib/jotai';
import { useAtom } from 'jotai';

export default function VendorSingleChat() {
    // const { id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const shopId = queryParams.get("shopId");
    const userId = queryParams.get("userId");
    const [venodrNewMessage, setVendorNewMessage] = useAtom(vendorNewMessageAtom)

    const [chatData, setChatData] = useState([]);
    const [message, setMessage] = useState('')
    const messageInputRef = useRef(null);
    const [relatedUserName, setRelatedUserName] = useState('')
    const [relatedUserImage, setRelatedUserImage] = useState('')
    const user = JSON.parse(localStorage.getItem('user'))
    const banner = user?.vendor_info?.shop?.banner;
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;

    useEffect(() => {

        const q = query(
            collection(db, "messages"),
            where("shopId", "==", shopId),
            where("userId", "==", userId),
            // limit(4),
            // orderBy("createAt", "desc"),
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages = [];
            querySnapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });

            // Sort messages by createAt timestamp
            messages.sort((a, b) => (a.createAt.seconds - b.createAt.seconds));
            setChatData(messages);
            if (messages.length > 0) {
                setRelatedUserName(messages[0]?.userName)
                setRelatedUserImage(messages[0]?.userImage)
            }
        });

        return () => unsubscribe(); // Clean up subscription on component unmount
    }, [chatData]);


    useEffect(() => {
        if (!shopId || !userId) {
            // console.log("Shop ID or user ID is not specified.");
            return;
        }

        const q = query(
            collection(db, "messages"),
            where("shopId", "==", shopId),
            where("userId", "==", userId),
            where("vendorRead", "==", false) // Only fetch messages where userRead is false
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                updateDoc(doc.ref, { vendorRead: true });
            });
        });
        setVendorNewMessage(false)
        return () => unsubscribe;
    }, [shopId, userId, chatData]);

    // console.log(relatedUser)
    const handleSendMessage = async (e) => {
        // e.preventDefault();

        if (message.trim() === "") {
            showToast('Enter valid message!', 'info')
            return;
        }

        const newMessage = {
            shopName: user?.vendor_info?.shop?.name?.en,
            createAt: new Date(),
            message: message,
            type: user.type,
            shopId: shopId,
            userId: userId,
            userName: relatedUserName,
            banner: banner,
            userImage: relatedUserImage ? relatedUserImage : '',
            userRead: false
        };
        setMessage('');
        if (messageInputRef.current) {
            messageInputRef.current.value = '';
        }
        try {
            await addDoc(collection(db, "messages"), newMessage);
            // Assuming createAt is stored as a Timestamp in Firestore, adjust if necessary
            const updatedMessages = [...chatData, { ...newMessage, createAt: { seconds: newMessage.createAt.getTime() / 1000, nanoseconds: 0 } }];
            // Sort messages by createAt timestamp after adding the new message
            updatedMessages.sort((a, b) => (a.createAt.seconds - b.createAt.seconds));
            setChatData(updatedMessages);
        } catch (error) {
            console.error(error)
        }

        try {

            const emailResponse = await axios.post(`${import.meta.env.VITE_API_PATH}/auth/send-multidevice-notification`,
                {
                    userId: userId,
                    message: {
                        "title": "Hurry up!",
                        "body": `You got a new message from the shop ${user?.vendor_info?.shop?.name?.en}`,
                    }
                },
            )

            if (emailResponse.status == 200) {
                // console.log('Notification sent to vendor successfully')
            } else {
                console.error('Failed to send notification')
            }
        } catch (error) {
            console.error(error)
        }
    }
    // const divRef = useRef(null);
    // useEffect(() => {
    //     divRef.current.scrollIntoView({ behavior: 'smooth' });
    // });
    // ref={divRef}

    return (
        <div className='h-[150vh] md:h-dvh overflow-x-hidden overflow-y-auto' >
            <div
                className='flex justify-start items-center gap-3 cursor-pointer'
                onClick={() => {
                    navigate('/vendor-chats')
                }}
            >
                <MdArrowBackIosNew className='w-4 h-4 ' />
                <p className='font-[600] mb-[2px]'>Go Back</p>
            </div>
            <div dir={currentLanguage == 'ar' && 'rtl'}>
                {
                    // open , close | urgent moderate, low
                    chatData?.map((chat, index) => {
                        const timestamp = new Date(chat?.createAt?.seconds * 1000 + chat?.createAt?.nanoseconds / 1000000); // Convert seconds to milliseconds and add nanoseconds
                        const formattedDate = `${timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} | ${timestamp.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}`;

                        return (
                            <div className='my-1 flex flex-col py-4' key={index}>
                                <div className='flex justify-start items-center gap-4 mb-1'>
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
                                <p className={`mt-2 ms-16  pb-3 ${chatData?.length !== index + 1 && 'border-b-[2px] border-gray-100'}`}>
                                    {chat.message}
                                </p>
                            </div>
                        )
                    })
                }


                <div className={`flex gap-2 justify-center items-start flex-col relative ${chatData?.length == 0 && 'mt-20'}`}>
                    <input
                        type='text'
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={chatData?.length === 0 ? `${t('chats.start_conversation')}` : `${t('chats.send_message')}`}
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
                        className={`${message?.length > 0 ? `bg-tertiary-500` : `bg-tertiary-500 opacity-20`} text-white py-1 mt-3 px-4 rounded-md absolute bottom-[10px]  ${currentLanguage == 'ar' ? `left-3` : 'right-2'}`}
                    >
                        {t('chats.send')}
                    </button>
                </div>
                {/* <div className='flex justify-end'>
                    <button className='bg-tertiary-500 text-white px-4 py-2 rounded-sn mt-2 '>Load previous chat</button>
                </div> */}

            </div>

        </div >
    )
}
