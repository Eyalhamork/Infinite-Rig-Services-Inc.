const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function testGeminiPro() {
    console.log('Testing gemini-pro...');
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent('Say hello');
        console.log('✅ gemini-pro works!');
        console.log('Response:', result.response.text());
    } catch (error) {
        console.log('❌ gemini-pro failed:', error.message);
        console.log('Full error:', error);
    }
}

testGeminiPro();
