import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app;
let auth;
let recaptchaVerifier;

export const initFirebaseAuth = () => {
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.appId) {
        throw new Error('Firebase credentials are not configured. Set the VITE_FIREBASE_* environment variables.');
    }

    if (!app) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
    }

    return auth;
};

export const sendPhoneOtp = async(phoneNumber, containerId = 'recaptcha-container') => {
    const authInstance = initFirebaseAuth();

    if (!recaptchaVerifier) {
        recaptchaVerifier = new RecaptchaVerifier(
            authInstance,
            containerId, {
                size: 'invisible',
                callback: () => {},
                'expired-callback': () => {},
            }
        );
    }

    await recaptchaVerifier.render();
    return signInWithPhoneNumber(authInstance, phoneNumber, recaptchaVerifier);
};

export const confirmPhoneOtp = async(confirmationResult, otp) => {
    if (!confirmationResult) {
        throw new Error('Phone verification session is not ready.');
    }

    return confirmationResult.confirm(otp);
};

export const resetPhoneRecaptcha = () => {
    if (recaptchaVerifier) {
        recaptchaVerifier.clear();
    }
    recaptchaVerifier = null;
};