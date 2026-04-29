import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const historyKey = `history:${userIP}`;

    if (req.method === 'POST') {
        const { title, poster } = JSON.parse(req.body);
        let history = await kv.get(historyKey) || [];
        history = history.filter(item => item.title !== title);
        history.unshift({ title, poster, timestamp: Date.now() });
        await kv.set(historyKey, history.slice(0, 10));
        return res.status(200).json({ success: true });
    }

    if (req.method === 'GET') {
        const history = await kv.get(historyKey) || [];
        return res.status(200).json(history);
    }
}
