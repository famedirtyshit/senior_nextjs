// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.FB_APIKEY,
    authDomain: process.env.FB_DOMAIN,
    projectId: process.env.FB_PROJECTID,
    storageBucket: process.env.FB_BUCKET,
    messagingSenderId: process.env.FB_MESSAGINGSENDER,
    appId: process.env.FB_APPID,
    measurementId: process.env.FB_MEASUREMENTID
};

// Initialize Firebase
export default function initFirebase() {
    try {
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        return { app, analytics };
    } catch (e) {
        console.log(e);
        return false;
    }
}
