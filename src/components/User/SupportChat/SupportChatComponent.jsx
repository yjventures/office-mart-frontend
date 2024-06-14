import React, { useEffect, useState, useRef } from 'react'
import { GoPerson } from "react-icons/go";
import { collection, query, where, onSnapshot, addDoc, doc } from "firebase/firestore";
import { db } from 'src/firebase';
// import { doc, setDoc } from "firebase/firestore";
import { showToast } from 'src/components/Common/Toastify/Toastify';
import emptyChat from 'assets/global/chat/chat.gif'

export default function SupportChatComponent() {
  const queryParams = new URLSearchParams(window.location.search);
  const shopId = queryParams.get('shopId')
  // console.log(shopId)
  const messageInputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'))
  const [chats, setChats] = useState([])
  const [message, setMessage] = useState('')

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") {
      showToast('Enter valid message!', 'info')
      return;
    }

    const newMessage = {
      userName: user.firstname + ' ' + user.lastname,
      createAt: new Date(),
      message: message,
      type: user.type,
      shopId: shopId,
      userId: user._id
    };
    setMessage('');
    if (messageInputRef.current) {
      messageInputRef.current.value = '';
    }
    try {
      const docRef = await addDoc(collection(db, "messages"), newMessage);
      // Add the new message to the chats state for immediate UI update
      // Assuming createAt is stored as a Timestamp in Firestore, adjust if necessary
      const updatedChats = [...chats, { ...newMessage, id: docRef.id, createAt: { seconds: newMessage.createAt.getTime() / 1000, nanoseconds: 0 } }];
      // Sort messages by createAt timestamp after adding the new message
      updatedChats.sort((a, b) => (a.createAt.seconds - b.createAt.seconds));
      setChats(updatedChats);

    } catch (error) {
      // console.log(error)
      showToast('Somehow message is not sending! ', 'error')
    }

  }


  useEffect(() => {
    if (!shopId) {
      // console.log("Shop ID is not specified.");
      return;
    }

    const q = query(
      collection(db, "messages"),
      where("shopId", "==", shopId) // Filter messages by shopId
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];

      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      // Sort messages by createAt timestamp
      messages.sort((a, b) => (a.createAt.seconds - b.createAt.seconds));
      setChats(messages);
    });

    return () => unsubscribe;
  }, [shopId]);

  // console.log(chats)
  return (
    <div className='relative h-full'>
      {
        chats.length == 0 &&
        <div className='flex justify-center items-center flex-col h-[]'>
          <img src={emptyChat} alt="empty chat" className='w-[200px] h-[200px]' />
          <p className='text-lg'>No conversation done yet! </p>
        </div>
      }
      {
        // open , close | urgent moderate, low
        chats?.map((chat, index) => {
          const timestamp = new Date(chat?.createAt?.seconds * 1000 + chat?.createAt?.nanoseconds / 1000000); // Convert seconds to milliseconds and add nanoseconds
          const formattedDate = `${timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} | ${timestamp.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}`;

          return (
            <div className='mb-6 flex flex-col mt-3 py-4' key={index}>
              <div className='flex justify-start items-center gap-4 mb-2'>
                <GoPerson className='w-12 h-12 rounded-full border-[2px] p-1 text-gray-400' />
                <div>
                  <p className='font-[600] text-[18px]'>{chat?.name}</p>
                  <p className='text-gray-400 text-sm'>{formattedDate}</p>
                </div>
              </div>
              <p className='mt-3 ms-16 border-b-[2px] pb-6 border-gray-100'>
                {chat.message}
              </p>
            </div>
          )
        })
      }

      <div className={`flex gap-2 justify-center items-start flex-col relative ${chats?.length == 0 && 'mt-20'}`}>
        <textarea
          onChange={(e) => setMessage(e.target.value)}
          placeholder={chats?.length == 0 ? 'Start conversation now..' : 'Send a message'}
          className='bg-gray-50 text-black border-2 w-full mt-8 py-3 outline-none px-3 rounded-md'
          cols="30"
          rows="1"
          ref={messageInputRef}
        ></textarea>

        <button
          onClick={handleSendMessage}

          className='bg-tertiary-500 text-white py-1 mt-3 px-4 rounded-sm absolute bottom-[10px] right-2'
        >
          Send
        </button>
      </div>

    </div>
  )
}
