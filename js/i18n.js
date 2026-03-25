let currentLang = localStorage.getItem('language') || 'es';
let translations = {};

export async function initI18n(translationsData) {
    translations = translationsData;
    updateLanguage();
}

export function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
}

export function getCurrentLanguage() {
    return currentLang;
}

export function t(key) {
    return translations[currentLang]?.[key] || key;
}

export function updateLanguage() {
    // This will be called to re-render UI
    document.documentElement.lang = currentLang;
}