function ModerateContent(call, callback) {
  const { content } = call.request;
  const toxicWords = ['stupid', 'idiot', 'nonsense', 'shut up', 'hate', 'trash']; // tu peux en ajouter plus
  const lower = content.toLowerCase();
  const isToxic = toxicWords.some(word => lower.includes(word));
  const score = isToxic ? 0.9 : 0.1;
  callback(null, { isToxic, score });
}
