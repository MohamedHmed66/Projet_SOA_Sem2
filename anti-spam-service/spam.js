module.exports = function detectSpam(content) {
  // Validate input
  if (!content || typeof content !== 'string') {
    return {
      isSpam: false,
      reason: 'invalid input'
    };
  }

  // Règles basiques de spam
  const repeated = /(.)\1{4,}/.test(content); 
  const tooShort = content.length < 5;
  const keywordSpam = /free money|click here|win now/i.test(content);

  const isSpam = repeated || tooShort || keywordSpam;
  const reason = repeated ? "repetition" : tooShort ? "too short" : keywordSpam ? "suspicious keywords" : "clean";

  return { isSpam, reason };
};
