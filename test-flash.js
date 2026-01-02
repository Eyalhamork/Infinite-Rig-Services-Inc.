const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function testFlash() {
    console.log('Testing gemini-1.5-flash...');
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Say hello');
        console.log('✅ gemini-1.5-flash works!');
        console.log('Response:', result.response.text());
    } catch (error) {
        console.log('❌ gemini-1.5-flash failed:', error.message);
        if (error.response) {
            console.log('Response data:', error.response.data);
        }
    }
}

testFlash();
