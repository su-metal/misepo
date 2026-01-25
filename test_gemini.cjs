
const fs = require('fs');
const { GoogleGenAI, Type } = require('@google/genai');

async function test() {
    let apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey && fs.existsSync('.env.local')) {
        const env = fs.readFileSync('.env.local', 'utf8');
        const match = env.match(/GEMINI_API_KEY=(.+)/);
        if (match) apiKey = match[1].trim().replace(/['\"]/g, '');
    }

    if (!apiKey) {
        console.error('No API key found in env or .env.local');
        return;
    }
    
    // v1beta is required for thinking and newer models
    const genAI = new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });

    const contentSchema = {
        type: Type.OBJECT,
        properties: {
          test: { type: Type.STRING }
        }
    };

    // Test 2.5 Flash with JSON and Thinking
    try {
        console.log('\n--- Testing gemini-2.5-flash with JSON + Thinking ---');
        const resp = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: 'Output JSON with test="hello"' }] }],
            config: {
                responseMimeType: 'application/json',
                responseSchema: contentSchema,
                thinkingConfig: { includeThoughts: true, thinkingBudget: 1024 }
            }
        });
        console.log('STATUS:', resp.sdkHttpResponse.status);
        console.log('SUCCESS (2.5 JSON+THINK):', resp.text);
    } catch (e) {
        console.error('FAILED (2.5 JSON+THINK):', e.message);
    }
}

test();
