import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from 'i18next-http-backend'; // Import the backend plugin

i18n
    .use(HttpBackend) // Use the HttpBackend
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        lng: localStorage.getItem('lang') || "en", // Default language
        fallbackLng: "en", // Fallback language if the current language translations are not available
        backend: {
            // Path where resources get loaded from
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },

        interpolation: {
            escapeValue: false, // React already safes from XSS
        }
    });

export default i18n;