import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCommentInsights } from './comment-insights.js';

const comments = [
  { id: 'c1', text: 'This serum feels lightweight and absorbs fast.' },
  { id: 'c2', text: 'Lightweight feel, and it absorbs quickly.' },
  { id: 'c3', text: 'The bottle is pretty.' }
];

test('keeps only known selected comments and phrases present in at least two selected originals', () => {
  const result = validateCommentInsights(comments, {
    selectedCommentIds: ['c1', 'c2', 'c3', 'unknown', 'c2'],
    phrases: [
      { phrase: 'lightweight', commentIds: ['c1', 'c2', 'c3'] },
      { phrase: 'absorbs', commentIds: ['c1', 'c2'] },
      { phrase: 'great results', commentIds: ['c1', 'c2'] },
      { phrase: 'pretty', commentIds: ['c3'] }
    ]
  });

  assert.deepEqual(result.selectedComments.map(comment => comment.id), ['c1', 'c2', 'c3']);
  assert.deepEqual(result.phrases, [
    { phrase: 'lightweight', mentions: 2 },
    { phrase: 'absorbs', mentions: 2 }
  ]);
});

test('returns no phrases when there are no selected comments', () => {
  assert.deepEqual(
    validateCommentInsights(comments, { selectedCommentIds: [], phrases: [] }),
    { selectedComments: [], phrases: [] }
  );
});
