# Easy English Translator (rule-based)

A tiny **static** translator that converts English sentences into a simplified “Easy English” form using **clear, explainable rules** (no server, no dependencies). Designed to run on **GitHub Pages**.

---

## What is “Easy English”?

This project uses a simplified grammar with fixed particles:

- `pa` = past  
- `na` = present / now  
- `fu` = future  
- `no` = negation  
- `ma` = question marker (always at end)

Core idea: keep meaning readable, rules consistent, and vocabulary small (with optional compounding).

---

## Key rules (MVP)

### Pronouns
- I/me → `mi`
- you → `yu`
- he/him → `he`
- she/her → `she`
- it → `it`
- we/us → `we`
- they/them → `de`

### Tense
Heuristic particles:
- contains `will` or `going to` → `fu`
- contains `did`, or `yesterday/ago/last` → `pa`
- otherwise → `na`

> Default behavior includes `na` for clarity. You can turn that off by unchecking **Strict mode**.

### Negation
Negation words (`not`, `don't`, `can't`, `won't`, etc.) become `no` at the end:
- `I will not go.` → `mi fu go no`

### Questions
Yes/no questions end with `ma`:
- `Did you eat?` → `yu pa eat ma`

### Word order
MVP keeps word order mostly as-is (after stripping auxiliaries / articles). Target shape:

`[SUBJ] [TENSE] [VERB] [OBJ] [no?] [ma?]`

---

## Examples
- `Did you eat?` → `yu pa eat ma`
- `I will not go.` → `mi fu go no`
- `They don't know.` → `de na know no`
- `She is happy.` → `she na happy`

---

## Run locally

Option 1: open `index.html` directly.

Option 2: run a local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`

---

## Deploy to GitHub Pages

1. Create a GitHub repo and push these files to the `main` branch.
2. In GitHub: **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: **main**, Folder: **/ (root)**
5. Save. Your site will appear at:

`https://<your-username>.github.io/<repo-name>/`

---

## Extend it

### Add vocabulary
Edit `lexicon.js`:
- Add entries to `VERBS`, `NOUNS`, `ADJECTIVES`
- Add time hints in `TIME_WORDS`

### Add rules
Edit `rules.js`:
- The pipeline is in `translateSentence()`
- Keep rules small and explainable

---

## Limitations
- Rule-based heuristics, not a full parser
- Complex sentences may translate oddly
- Past tense detection is limited in MVP
