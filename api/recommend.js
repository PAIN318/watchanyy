export default async function handler(req, res) {
    const AI_KEY = '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';
    const count = Math.floor(Math.random() * (45 - 31 + 1)) + 31;

    try {
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${AI_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta/llama-3.1-405b-instruct",
                messages: [{ 
                    role: "user", 
                    content: `Provide exactly ${count} famous and diverse movies or anime titles like 'Lord of the Mysteries', 'Vinland Saga', and 'Naruto' as a clean JSON array of strings only. No text.` 
                }]
            })
        });

        const data = await response.json();
        res.setHeader('Access-Control-Allow-Origin', '*'); // Allows your site to talk to this API
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch from AI" });
    }
}
