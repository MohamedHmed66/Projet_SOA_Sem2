const express = require('express');
const router = express.Router();
const grpc = require('../services/grpcClient');
const kafkaProducer = require('../services/kafkaProducer');

// Route de health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/submit', async (req, res) => {
  const { content } = req.body;
  try {
    // Appel anti-spam
    const spamResult = await grpc.spam(content);
    if (spamResult.isSpam) {
      return res.status(400).json({ error: 'Spam détecté', reason: spamResult.reason });
    }

    const moderation = await grpc.moderate(content);
    const classification = await grpc.classify(content);
    
    await kafkaProducer.publish('moderation-results', { content, ...moderation });
    await kafkaProducer.publish('classification-results', { content, ...classification });
    

    res.json({ spam: spamResult, moderation, classification });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

module.exports = router; 
