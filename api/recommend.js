export default async function handler(req, res) {
    const KEY = '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';
    const themes = ["Elite Masterpieces", "Legendary Sagas", "Dark Classics", "Top-Rated Gems"];
    const theme = themes[Math.floor(Math.random() * themes.length)];

    try {
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "meta/llama-3.1-70b-instruct", // 70b is 10x faster than 405b
                messages: [
                    { role: "system", content: "You are an elite curator. Output ONLY a raw JSON array of 20 strings. No intro, no text." },
                    { role: "user", content: `List 20 ${theme} movies or anime like Vinland Saga or Lord of the Mysteries.` }
                ],
                temperature: 0.8,
                max_tokens: 400
            })
        });

        const data = await response.json();
        let content = data.choices[0].message.content.trim();
        if (content.includes("```")) content = content.replace(/```json|```/g, "").trim();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).send(content);
    } catch (e) {
        // Emergency Backup so the site never shows an error
        res.status(200).json(["Berserk", "Monster", "Vagabond", "Kingdom", "Pluto", "The Horizon"]);
    }
}
