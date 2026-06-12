/**
 * Google Gemini AI Configuration
 * Initializes the @google/generative-ai SDK and exports the configured model instance.
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. Read the Gemini API key securely from environment variables
const apiKey = process.env.GEMINI_API_KEY;

// 2. Introduce configurable model name compatible with v1beta SDK
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';

// 3. Perform a quick startup diagnostic check and log the exact status natively
if (apiKey) {
  console.log('Gemini AI Configured: YES');
} else {
  console.warn('WARNING: GEMINI_API_KEY is missing from .env');
}
console.log(`Gemini Model Selected: ${MODEL_NAME}`);

// 4. Initialize the Google Generative AI client
//    (Passing fallback string to prevent instantiation crashes if .env is not yet configured)
const genAI = new GoogleGenerativeAI(apiKey || 'UNCONFIGURED_KEY');

// 5. Instantiate and configure the specific supported model utilizing the configured variable
const geminiModel = genAI.getGenerativeModel({ model: MODEL_NAME });

// 6. Export the ready-to-use model instance consistently alongside the loaded model name
module.exports = {
  geminiModel,
  MODEL_NAME
};
