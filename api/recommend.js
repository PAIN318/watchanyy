export default async function handler(req, res) {
    const KEY = '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';
    
    // Rotating themes to keep it fresh
    const moods = ["Epic & Legendary", "Dark & Psychological", "Masterpieces", "Hidden Gems"];
    const currentMood = moods[Math.floor(Math.random() * moods.length)];

    try {
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${KEY}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "meta/llama-3.1-70b-instruct", 
                messages: [
                    { 
                        role: "system", 
                        content: "You are an elite curator. You only output raw JSON arrays of strings. No conversation." 
                    },
                    { 
                        role: "user", 
                        content: `Provide exactly 30 ${currentMood} recommendations. You MUST follow this ratio: 10 Movies, 10 Anime, and 10 Live-Action TV Series. Mix them randomly in the list. Focus on high-quality titles similar in tone to 'Lord of the Mysteries' or 'Vinland Saga'. Output ONLY a JSON array of 30 strings.` 
                    }
                ],
                temperature: 0.85, // Higher randomness for more variety
                max_tokens: 700
            })
        });

        const data = await response.json();
        let content = data.choices[0].message.content.trim();
        
        // Safety cleaning
        if (content.includes("```")) {
            content = content.replace(/```json|```/g, "").trim();
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'no-store, max-age=0');
        res.status(200).send(content);

    } catch (e) {
        // High-quality mixed backup list in case of AI timeout
        const backup = [
            "The Dark Knight", "Inception", "Gladiator", // Movies
            "Breaking Bad", "Game of Thrones", "Succession", // Series
            "Berserk", "Monster", "Steins;Gate", // Anime
            "Interstellar", "The Witcher", "Attack on Titan"
        ];
        res.status(200).json(backup);
    }
}
