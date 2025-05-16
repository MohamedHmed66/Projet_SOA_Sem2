function displayNotification(topic, message) {
  console.log(`\n New Message from [${topic}]`);
  console.log(JSON.stringify(JSON.parse(message), null, 2));
}

module.exports = displayNotification;