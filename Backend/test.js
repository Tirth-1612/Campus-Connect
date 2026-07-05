import express from 'express';
const app = express();
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.listen(5001, () => console.log('Test server is operational'));
