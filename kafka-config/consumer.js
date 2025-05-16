const { Kafka } = require('kafkajs');
const kafka = new Kafka({ clientId: 'consumer', brokers: ['localhost:9092'] });

module.exports = async function createConsumer(groupId, topics, handleMessage) {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  for (const topic of topics) {
    await consumer.subscribe({ topic });
  }
  await consumer.run({ eachMessage: async ({ topic, message }) => handleMessage(topic, message.value.toString()) });
};