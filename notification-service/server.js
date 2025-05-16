const createConsumer = require('../kafka-config/consumer');
const topics = require('../kafka-config/topics');
const notify = require('./notify');

async function startService(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempting to start notification service (attempt ${i + 1}/${retries})...`);
      await createConsumer(
        'notification-service',
        [
          topics.MODERATION_TOPIC,
          topics.CLASSIFICATION_TOPIC,
          topics.VALIDATION_TOPIC
        ],
        notify
      );
      console.log('Notification service started successfully!');
      return;
    } catch (error) {
      console.error(`Failed to start notification service (attempt ${i + 1}/${retries}):`, error.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  console.error('Failed to start notification service after all retries');
  process.exit(1);
}

startService();