// Quick test to see what models your API key can access
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function listModels() {
  console.log('Testing API key:', process.env.GOOGLE_API_KEY?.substring(0, 15) + '...');
  console.log('\nAttempting to list available models...\n');

  try {
    // Try to use a generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say hello');
    console.log('✅ gemini-1.5-flash works!');
    console.log('Response:', result.response.text());
  } catch (error) {
    console.log('❌ gemini-1.5-flash failed:', error.message);
  }

  try {
    // Try embedding model
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent('test');
    console.log('✅ text-embedding-004 works!');
  } catch (error) {
    console.log('❌ text-embedding-004 failed:', error.message);
  }
}

listModels();
