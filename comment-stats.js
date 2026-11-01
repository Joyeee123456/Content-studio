export const sentimentLabels = ['正面', '负面', '中性', '混合'];
export const themeLabels = ['功能效果', '价格价值', '质量耐用', '使用体验', '设计包装', '配送服务', '其他'];

export function dedupeComments(input) {
  const comments = input.map(comment => comment.trim()).filter(Boolean);
  const uniqueByText = new Map();
  for (const comment of comments) {
    const key = comment.normalize('NFKC').toLocaleLowerCase();
    if (!uniqueByText.has(key)) uniqueByText.set(key, comment);
  }
  const uniqueComments = [...uniqueByText.values()];
  return { comments, uniqueComments };
}

export function summarizeCommentLabels(uniqueCount, labels) {
  const sentiments = Object.fromEntries(sentimentLabels.map(label => [label, 0]));
  const themes = Object.fromEntries(themeLabels.map(label => [label, 0]));
  const seenIndexes = new Set();

  for (const item of labels) {
    if (!Number.isInteger(item?.index) || item.index < 1 || item.index > uniqueCount ||
        seenIndexes.has(item.index) || !sentimentLabels.includes(item.sentiment) ||
        !themeLabels.includes(item.theme)) continue;
    seenIndexes.add(item.index);
    sentiments[item.sentiment] += 1;
    themes[item.theme] += 1;
  }

  return { classifiedCount: seenIndexes.size, sentiments, themes };
}
