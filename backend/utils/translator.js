
const { Translate } = require('@google-cloud/translate').v2;

// Initialize the Google Translate API
let translate;

try {
  translate = new Translate({
    projectId: process.env.GOOGLE_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
  });
} catch (error) {
  console.error('Error initializing Google Translate:', error);
}

/**
 * Simple in-memory cache for translations to reduce API calls
 */
const translationCache = {};

/**
 * Translates text from source language to target language
 * @param {string} text - Text to translate
 * @param {string} sourceLanguage - Source language code (e.g., 'en', 'hi')
 * @param {string} targetLanguage - Target language code (e.g., 'en', 'hi')
 * @returns {Promise<string>} - Translated text
 */
async function translateText(text, sourceLanguage, targetLanguage) {
  try {
    // If source and target languages are the same, return the original text
    if (sourceLanguage === targetLanguage) {
      return text;
    }
    
    // Check if translation is in cache
    const cacheKey = `${sourceLanguage}_${targetLanguage}_${text}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }
    
    // If Google Translate API is not available, return original text
    if (!translate) {
      console.warn('Google Translate API not initialized. Returning original text.');
      return text;
    }
    
    const [translation] = await translate.translate(text, {
      from: sourceLanguage,
      to: targetLanguage,
    });
    
    // Cache the translation
    translationCache[cacheKey] = translation;
    
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text in case of error
    return text;
  }
}

module.exports = {
  translateText
};
