// lexicon.js — small starter dictionaries for the translator.
// Expand these over time. Keep keys lowercase.

export const PRONOUNS = {
  "i": "mi",
  "me": "mi",
  "my": "mi",      // MVP: possessive not handled; we keep as mi + noun
  "mine": "mi",
  "you": "yu",
  "your": "yu",
  "yours": "yu",
  "he": "he",
  "him": "he",
  "his": "he",
  "she": "she",
  "her": "she",
  "hers": "she",
  "it": "it",
  "its": "it",
  "we": "we",
  "us": "we",
  "our": "we",
  "ours": "we",
  "they": "de",
  "them": "de",
  "their": "de",
  "theirs": "de"
};

export const AUX_VERBS = new Set([
  "do","does","did",
  "am","is","are","was","were",
  "have","has","had",
  "will","would","can","could","shall","should","may","might","must"
]);

export const NEGATIONS = new Set([
  "not","n't",
  "dont","don't",
  "doesnt","doesn't",
  "didnt","didn't",
  "wont","won't",
  "cant","can't",
  "cannot",
  "isnt","isn't",
  "arent","aren't",
  "wasnt","wasn't",
  "werent","weren't",
  "havent","haven't",
  "hasnt","hasn't",
  "hadnt","hadn't",
  "no"
]);

export const TIME_WORDS = {
  "yesterday": "pa",
  "ago": "pa",
  "last": "pa",
  "tomorrow": "fu",
  "later": "fu",
  "soon": "fu",
  "today": "na",
  "now": "na"
};

export const VERBS = {
  "eat": "eat",
  "go": "go",
  "come": "come",
  "see": "see",
  "give": "give",
  "take": "take",
  "make": "make",
  "do": "do",
  "say": "say",
  "know": "know",
  "think": "think",
  "want": "want",
  "like": "like",
  "need": "need",
  "have": "have",
  "be": "be"
};

export const NOUNS = {
  "house": "home",
  "home": "home",
  "restaurant": "food place",
  "school": "learn place",
  "hospital": "heal place",
  "office": "work place",
  "store": "buy place",
  "shop": "buy place",
  "car": "move tool",
  "phone": "talk tool",
  "computer": "think box"
};

export const ADJECTIVES = {
  "big": "big",
  "small": "small",
  "good": "good",
  "bad": "bad",
  "new": "new",
  "old": "old",
  "happy": "happy",
  "sad": "sad",
  "hot": "hot",
  "cold": "cold"
};

export const DROP_WORDS = new Set(["a","an","the"]);
