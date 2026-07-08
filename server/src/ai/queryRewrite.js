// server/src/ai/queryRewrite.js

// Category/keyword vocabulary pulled from your actual catalog domain.
// Used to pad out vague queries so they land closer to real product
// descriptions in embedding space.
const CATEGORY_VOCAB = 'gold rings necklaces earrings bangles bracelets pendants ' +
  'bridal sets diamond jewellery 22K gold jewellery';

// Queries that carry browse/discovery intent but little to no product-
// specific semantic content ("show me new products", "what do you have").
// These embed poorly against product text because there's nothing
// concrete (metal, category, occasion) for cosine similarity to latch onto.
const BROWSE_INTENT_REGEX = /\b(show me|what do you have|new arrival|new product|latest|browse|collection|options?|kuch (achha|naya)|dikhao)\b/i;

// Below this token count, treat the query as too sparse to trust on its
// own regardless of regex match (covers phrasing you haven't anticipated).
const MIN_MEANINGFUL_TOKENS = 3;

const isVagueQuery = (query) => {
  const tokenCount = query.trim().split(/\s+/).length;
  return BROWSE_INTENT_REGEX.test(query) || tokenCount < MIN_MEANINGFUL_TOKENS;
};

// Heuristic rewrite: append category vocabulary rather than replacing the
// original query, so any specific words the user *did* use (e.g. "new
// gold products") are preserved and still contribute to the embedding.
const rewriteQuery = (query) => {
  if (!isVagueQuery(query)) return query;
  return `${query} ${CATEGORY_VOCAB}`;
};

module.exports = { rewriteQuery, isVagueQuery };