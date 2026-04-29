import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Identify the user by their IP address provided by Vercel's headers
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const historyKey = `history:${userIP}`;

    if (req.method === 'POST') {
        const { title, poster } = JSON.parse(req.body);
        
        // Fetch current history
        let history = await kv.get(historyKey) || [];
        
        // Add new item to the start (no duplicates)
        history = history.filter(item => item.title !== title);
        history.unshift({ title, poster, timestamp: Date.now() });
        
        // Keep only the last 10 items
        await kv.set(historyKey, history.slice(0, 10));
        
        return res.status(200).json({ success: true });
    }

    if (req.method === 'GET') {
        const history = await kv.get(historyKey) || [];
        return res.status(200).json(history);
    }
}
