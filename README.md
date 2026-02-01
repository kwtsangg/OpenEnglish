# goal.md — Easy English Translator (GitHub Pages)

Build a **static website** hosted on **GitHub Pages (github.io)** that translates **English sentences → Easy English** using a **simple, explainable, rule-based** JavaScript engine (no server, no external dependencies). This is an MVP designed for iteration.

---

## Repository structure

Create these files:

```
/
  index.html
  styles.css
  app.js
  rules.js
  lexicon.js
  README.md
  LICENSE (optional: MIT)
```

Optional later:

```
/examples.json
/tests/translator.test.js
```

---

## Easy English spec (MVP)

### Design principles
- Prefer **short, consistent words**.
- Prefer simple structure: **SVO** (Subject–Verb–Object).
- Use fixed particles (never change form):
  - `pa` = past
  - `na` = present/now (MVP default: include for clarity)
  - `fu` = future
  - `no` = negation
  - `ma` = question marker (always at end)

### Pronouns (MVP)
- `I/me` → `mi`
- `you` → `yu`
- `he/him` → `he`
- `she/her` → `she`
- `it` → `it`
- `we/us` → `we`
- `they/them` → `de`

### Output shape (guideline)
Aim for:

`[SUBJ] [TENSE] [VERB] [OBJ] [no?] [ma?]`

Negation placement (simple + consistent):
- “I will not go.” → `mi fu go no`

### Questions (MVP)
Detect yes/no questions and append `ma`.
- If input ends with `?` OR begins with an auxiliary (do/does/did/will/can/is/are/was/were/have/has/had), treat as a question.
- Remove the auxiliary from output (use particles for tense instead).

Examples:
- “Did you eat?” → `yu pa eat ma`
- “Will they come?” → `de fu come ma`

### Tense detection (MVP)
Heuristics:
- Contains `will` or phrase `going to` → `fu`
- Contains `did`, or past time hints (`yesterday`, `ago`, `last`) → `pa`
- Else default → `na`

### Negation detection (MVP)
If sentence contains any of:
- `not`, `don't`, `doesn't`, `didn't`, `won't`, `can't`, `cannot`, `isn't`, `aren't`, `wasn't`, `weren't`, `haven't`, `hasn't`, `hadn't`
then:
- Flag negation → add `no`
- Remove the negation word(s) from tokens

### Vocabulary approach (MVP)
- Use a small lexicon mapping common words to Easy English roots.
- Unknown words: keep them (lowercase) as fallback.
- Multi-word mappings supported (e.g., `going to`).

---

## Website requirements

### UI (index.html)
- Title: **Easy English Translator**
- Two text areas:
  - Input: English sentence(s)
  - Output: Easy English translation (read-only)
- Buttons:
  - Translate
  - Copy output
  - Clear
- Toggles:
  - “Show steps” (shows which rules fired)
  - “Strict mode” (forces `na` even when not needed; default **ON**)

### UX behavior
- Translate on button click
- Translate on **Ctrl+Enter / Cmd+Enter**
- Display a small note: “Rule-based translator. Not perfect. Designed for clarity.”

### Hosting
- Must run as a **fully static** site on GitHub Pages.
- Use **vanilla** HTML/CSS/JS (no frameworks) for MVP.

---

## Implementation details

### `lexicon.js`
Export dictionaries as plain objects:

- `PRONOUNS`
- `AUX_VERBS` (for question detection)
- `NEGATIONS` (normalize to `no`)
- `TIME_WORDS` (tense hints; categorize as `pa|na|fu`)
- `VERBS` (eat, go, see, give, take, make, do, say, know, think, come, want, like, need, have, be)
- `COMMON_NOUNS` (small starter set)
- `ADJECTIVES` (big, small, good, bad, new, old, etc.)

Include multi-word keys where needed:
- `going to` → future marker
- `a lot of` → `many` (optional)

### `rules.js`
Create small, pure functions and a pipeline that returns:
- `outputText`
- `steps[]` (human-readable applied rules)

Suggested pipeline:

1. `splitIntoSentences(text)`
2. For each sentence:
   - `normalize(sentence)`
   - `detectQuestion(sentence, tokens)`
   - `detectTense(tokens, sentence)`
   - `detectNegation(tokens)`
   - `stripAuxiliaries(tokens)`
   - `lexicalTranslate(tokens)`
   - `render(meta, tokens)`:
     - If first token is a pronoun (mi/yu/he/she/it/we/de), insert tense after it.
     - Append `no` if negation flag set.
     - Append `ma` if question flag set.

MVP ordering rule:
- Keep token order after stripping auxiliaries/negations (no heavy parsing).

### `app.js`
- Wire UI to the translator functions.
- Show output in the output textarea.
- If “Show steps” is enabled, show a collapsible panel listing `steps[]`.
- Implement Copy/Clear buttons.

---

## MVP translation examples (must pass)

1) `Did you eat?`  
→ `yu pa eat ma`

2) `I will not go.`  
→ `mi fu go no`

3) `We see the big house.`  
→ `we na see the big home`  
(If `house → home` exists; otherwise keep `house`)

4) `They don't know.`  
→ `de na know no`

5) `She is happy.`  
→ `she na happy`  
(`is` treated as auxiliary and stripped)

---

## README.md requirements

README must include:

- What the project is
- What “Easy English” is (brief)
- Rules summary (particles + pronouns + negation + questions)
- How to run locally:
  - Open `index.html` directly **or**
  - `python -m http.server 8000`
- How to deploy to GitHub Pages:
  - GitHub repo → Settings → Pages → Deploy from branch → `main` / root
- Limitations:
  - Rule-based heuristics, not full grammar parsing
  - Complex inputs may translate oddly
- Contribution guide:
  - Add words in `lexicon.js`
  - Add/adjust rules in `rules.js`
  - Add examples

---

## Code style requirements
- Use modern JS **ES modules**
  - In `index.html`: `<script type="module" src="app.js"></script>`
- Keep functions small and testable
- Comment each rule in plain English
- No external dependencies for MVP

---

## Deliverables checklist
- [ ] index.html (UI)
- [ ] styles.css (clean layout)
- [ ] app.js (UI wiring)
- [ ] rules.js (translator pipeline)
- [ ] lexicon.js (starter dictionaries)
- [ ] README.md (rules + deploy steps)
- [ ] Works on GitHub Pages

---

## Nice-to-have (phase 2)
- Compounding suggestions (e.g., “restaurant” → “food place”)
- Highlight unknown words
- Shareable URL with encoded input
- Tiny test suite
