const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

// Note: The @google/generative-ai SDK doesn't have a direct listModels method in the same way as the REST API or Vertex AI SDK might, 
// but we can try to use the REST API directly or just guess common ones.
// Actually, the SDK doesn't expose listModels. Let's use fetch.

async function listModels() {
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Available models:');
        if (data.models) {
            data.models.forEach(m => {
                console.log(`- ${m.name} (${m.displayName})`);
            });
        } else {
            console.log('No models found or error in response:', data);
        }
    } catch (error) {
        console.log('Error fetching models:', error.message);
    }
}

listModels();
