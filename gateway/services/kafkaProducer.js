const { Kafka } = require('kafkajs');
const kafka = new Kafka({ clientId: 'gateway', brokers: ['localhost:9092'] });
const producer = kafka.producer();
producer.connect();

module.exports = {
  publish: async (topic, message) => {
    await producer.send({ topic, messages: [{ value: JSON.stringify(message) }] });
  },
};
