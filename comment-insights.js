function normalizeText(value) {
  return String(value || '').normalize('NFKC').toLocaleLowerCase();
}

export function validateCommentInsights(comments, modelResult) {
  const commentsById = new Map(comments.map(comment => [comment.id, comment]));
  const selectedIds = Array.isArray(modelResult?.selectedCommentIds)
    ? [...new Set(modelResult.selectedCommentIds.filter(id => commentsById.has(id)))]
    : [];
  const selectedIdSet = new Set(selectedIds);
  const selectedComments = selectedIds.map(id => commentsById.get(id));
  const phrases = [];
  const seenPhrases = new Set();

  for (const item of Array.isArray(modelResult?.phrases) ? modelResult.phrases : []) {
    const phrase = typeof item?.phrase === 'string' ? item.phrase.trim().slice(0, 80) : '';
    const phraseKey = normalizeText(phrase);
    if (phrase.length < 2 || seenPhrases.has(phraseKey)) continue;

    const supportingIds = Array.isArray(item.commentIds)
      ? [...new Set(item.commentIds.filter(id => selectedIdSet.has(id) &&
        normalizeText(commentsById.get(id).text).includes(phraseKey)))]
      : [];
    if (supportingIds.length < 2) continue;

    seenPhrases.add(phraseKey);
    phrases.push({ phrase, mentions: supportingIds.length });
    if (phrases.length >= 12) break;
  }

  return { selectedComments, phrases };
}
