import express from 'express'

const router = express.Router()

router.get('/health', (req, res) => {
  console.log(`[HEALTH CHECK] Ping received at ${new Date().toISOString()}`);
  res.status(200).json({ status: 'ok' });
});


export default router;