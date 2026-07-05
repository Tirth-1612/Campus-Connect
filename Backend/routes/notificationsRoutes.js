import express from 'express';

const router = express.Router();

router.post('/whatsapp', async (req, res) => {
  try {
    const { phone, message, title } = req.body || {};

    if (!phone || !message) {
      return res.status(400).json({ error: 'phone and message are required' });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return res.status(200).json({
        ok: true,
        mode: 'simulated',
        message: 'WhatsApp delivery is configured as a simulated fallback because Twilio credentials are not present.',
        preview: `${title ? `${title}: ` : ''}${message}`,
      });
    }

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const body = new URLSearchParams({
      To: `whatsapp:${phone}`,
      From: `whatsapp:${fromNumber}`,
      Body: message,
    });

    const twilioRes = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const twilioData = await twilioRes.json().catch(() => ({}));

    if (!twilioRes.ok) {
      return res.status(502).json({ error: 'WhatsApp delivery failed', details: twilioData });
    }

    return res.json({ ok: true, mode: 'twilio', data: twilioData });
  } catch (error) {
    console.error('WhatsApp notification error', error);
    return res.status(500).json({ error: 'Notification failed' });
  }
});

export default router;
