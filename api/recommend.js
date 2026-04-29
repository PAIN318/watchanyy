export default async function handler(req, res) {
    const KEY = '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';
    
    // CATEGORY ENGINE: Rotating the "Elite" category
    const tiers = ["Masterpiece", "Legendary", "Elite", "High-Stakes", "Top-Rated", "Underrated Hero", "Gold-Standard"];
    const currentTier = tiers[Math.floor(Math.random() * tiers.length)];
    const count = Math.floor(Math.random() * (40 - 25 + 1)) + 25; 

    try {
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta/llama-3.1-405b-instruct",
                messages: [{ 
                    role: "user", 
                    content: `Act as a Lead Curator for a high-end film society. List exactly ${count} different ${currentTier} titles that are the absolute TOP RECOMMENDATIONS. Include vibes like 'Lord of the Mysteries' and 'Vinland Saga'. Ensure the list is unique and feels hand-selected by an expert. Return as a clean JSON array of strings only.` 
                }],
                temperature: 0.9 
            })
        });

        const data = await response.json();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'no-store, max-age=0'); 
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Selection failed" });
    }
}
