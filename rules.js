// rules.js — rule-based translator pipeline (MVP).
import { PRONOUNS, AUX_VERBS, NEGATIONS, TIME_WORDS, VERBS, NOUNS, ADJECTIVES, DROP_WORDS } from "./lexicon.js";

function isLetterOrDigit(ch) {
  return /[a-z0-9]/i.test(ch);
}

export function splitIntoSentences(text) {
  const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const out = [];
  for (const line of lines) {
    const parts = line.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
    out.push(...parts);
  }
  return out;
}

export function normalize(sentence) {
  return sentence.trim().replace(/\s+/g, " ");
}

export function tokenize(sentence) {
  const lower = sentence.toLowerCase();
  let buf = "";
  for (let i = 0; i < lower.length; i++) {
    const ch = lower[i];
    if (isLetterOrDigit(ch) || ch === "'") buf += ch;
    else buf += " ";
  }
  return buf.split(/\s+/).filter(Boolean);
}

export function detectQuestion(originalSentence, tokens) {
  const s = originalSentence.trim();
  const endsQ = s.endsWith("?");
  const startsAux = tokens.length > 0 && AUX_VERBS.has(tokens[0]);
  return endsQ || startsAux;
}

export function detectTense(tokens) {
  const joined = " " + tokens.join(" ") + " ";
  if (joined.includes(" will ") || joined.includes(" gonna ") || joined.includes(" going to ")) return "fu";
  if (tokens.includes("did")) return "pa";
  for (const t of tokens) {
    const hint = TIME_WORDS[t];
    if (hint === "fu") return "fu";
    if (hint === "pa") return "pa";
  }
  return "na";
}

export function stripAuxiliaries(tokens) {
  const out = [...tokens];
  while (out.length > 1 && AUX_VERBS.has(out[0])) out.shift();
  return out;
}

export function detectAndStripNegation(tokens) {
  const out = [];
  let neg = false;

  for (const token of tokens) {
    const norm = token.replace(/'/g, "");
    if (NEGATIONS.has(norm) || norm === "nt") { neg = true; continue; }
    out.push(token);
  }
  return { tokens: out, neg };
}

export function lexicalTranslate(tokens) {
  const out = [];
  for (const raw of tokens) {
    const t = raw.replace(/'/g, "");
    if (DROP_WORDS.has(t)) continue;
    if (PRONOUNS[t]) { out.push(PRONOUNS[t]); continue; }
    if (NOUNS[t]) { out.push(...NOUNS[t].split(" ")); continue; }
    if (VERBS[t]) { out.push(VERBS[t]); continue; }
    if (ADJECTIVES[t]) { out.push(ADJECTIVES[t]); continue; }
    out.push(t);
  }
  return out;
}

function isEasyPronoun(token) {
  return token === "mi" || token === "yu" || token === "he" || token === "she" || token === "it" || token === "we" || token === "de";
}

export function render(meta, translatedTokens, options) {
  const steps = [];
  let toks = [...translatedTokens];
  const tense = meta.tense;
  const strict = options?.strictMode ?? true;

  if (toks.length === 0) {
    toks = [];
  } else if (isEasyPronoun(toks[0])) {
    if (strict || tense !== "na") {
      toks.splice(1, 0, tense);
      steps.push(`Inserted tense particle '${tense}' after subject.`);
    } else {
      steps.push("Strict mode off and tense is 'na'; omitted tense particle.");
    }
  } else {
    if (strict || tense !== "na") {
      toks.unshift(tense);
      steps.push(`Prepended tense particle '${tense}' (no clear pronoun subject detected).`);
    } else {
      steps.push("Strict mode off and tense is 'na'; omitted tense particle.");
    }
  }

  if (meta.neg) { toks.push("no"); steps.push("Detected negation; appended 'no'."); }
  if (meta.isQuestion) { toks.push("ma"); steps.push("Detected question; appended 'ma'."); }

  return { text: toks.join(" "), steps };
}

export function translateSentence(sentence, options = { strictMode: true }) {
  const steps = [];
  const norm = normalize(sentence);
  steps.push(`Normalize: "${norm}"`);

  let tokens = tokenize(norm);
  steps.push(`Tokenize: ${JSON.stringify(tokens)}`);

  const isQuestion = detectQuestion(norm, tokens);
  steps.push(`Question: ${isQuestion ? "yes" : "no"}`);

  const tense = detectTense(tokens);
  steps.push(`Tense: ${tense}`);

  const tokensNoAux = stripAuxiliaries(tokens);
  if (tokensNoAux.join(" ") !== tokens.join(" ")) steps.push(`Strip auxiliaries: ${JSON.stringify(tokensNoAux)}`);
  tokens = tokensNoAux;

  const negRes = detectAndStripNegation(tokens);
  tokens = negRes.tokens;
  const neg = negRes.neg;
  steps.push(`Negation: ${neg ? "yes" : "no"}`);
  steps.push(`After negation strip: ${JSON.stringify(tokens)}`);

  const translated = lexicalTranslate(tokens);
  steps.push(`Lexicon: ${JSON.stringify(translated)}`);

  const rendered = render({ tense, neg, isQuestion }, translated, options);
  steps.push(...rendered.steps);

  return { output: rendered.text, steps };
}

export function translateText(text, options = { strictMode: true }) {
  const sentences = splitIntoSentences(text);
  const outputs = [];
  const steps = [];

  for (const s of sentences) {
    const res = translateSentence(s, options);
    outputs.push(res.output);
    steps.push({ sentence: s, steps: res.steps });
  }

  return { output: outputs.join("\n"), steps };
}
