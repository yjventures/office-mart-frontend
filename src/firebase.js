// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { getMessaging } from "firebase/messaging/sw";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_APIKEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_FIREBASE_APPID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

// export const requestPermission = (token = null) => {
//     console.log('Requesting permission...');
//     Notification.requestPermission().then((permission) => {
//         if (permission === 'granted') {
//             console.log('Notification permission granted.');
//             getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPIDKEY })
//                 .then((currentToken) => {
//                     if (currentToken) {
//                         // console.log('Token => ', currentToken)
//                         // Send the token to your server and update the UI if necessary
//                         if(token){
//                             token.fcm = currentToken;
//                         }
//                     } else {
//                         // Show permission request UI
//                         console.log('No registration token available. Request permission to generate one.');
//                     }
//                 }).catch((err) => {
//                     console.log('An error occurred while retrieving token. ', err);
//                 });
//         } else {
//             console.log('Unable to get permission to notify.');
//         }
//     })
// }
export const requestPermission = async () => {
    try {
        let token = null;
        // console.log('Requesting permission...');
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            // console.log('Notification permission granted.');
            const currentToken = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPIDKEY })
            if (currentToken) {
                // console.log('Token => ', currentToken)
                // Send the token to your server and update the UI if necessary
                token = currentToken;
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
            }
        } else {
            console.log('Unable to get permission to notify.');
        }
        return token;
    } catch(err) {
        console.log('Error in request token' + err);
    }
}
// requestPermission()

// export const requestPermission = () => {
//     console.log('Requesting permission...')

//     Notification.requestPermission().then(premission => {
//         if (premission === 'granted') {
//             console.log('Notification permission granted.')
//             return getToken(messaging, {
//                 vapidKey: import.meta.env.VITE_FIREBASE_VAPIDKEY
//             })
//                 .then((currentToken) => {
//                     if (currentToken) {
//                         console.log('Token => ', currentToken)
//                     } else {
//                         console.log('No registration token available. Request permission to generate one.')
//                     }
//                 })
//         } else {
//             console.log('Unable to get permission to notify.')
//         }
//     })
// }

export const onMessageListener = () => {
    // new Promise((resolve) => {
    //     onMessage(messaging, (payload) => {
    //         resolve(payload)
    //         console.log(payload)
    //     })
    // })
    onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
    });
}

export const db = getFirestore(app);