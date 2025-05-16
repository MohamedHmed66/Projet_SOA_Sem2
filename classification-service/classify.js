module.exports = function classifyContent(content) {
  if (/politic|government|policy/i.test(content)) return 'politics';
  if (/tech|ai|code/i.test(content)) return 'technology';
  if (/health|medicine/i.test(content)) return 'health';
  return 'general';
};
