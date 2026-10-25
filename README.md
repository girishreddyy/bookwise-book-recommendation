# Bookwise — Book Recommendation App

A medium-sized full-stack book discovery app built with React + Vite and Flask. It includes 50 curated book records, TF-IDF/cosine similarity recommendations, searchable browsing, book details, and a localStorage reading library.

## Project structure

```text
book-recommender/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       ├── main.jsx
│       ├── styles.css
│       ├── components.jsx
│       ├── state/
│       │   └── AppContext.jsx
│       └── pages/
│           ├── Home.jsx
│           ├── Recommendations.jsx
│           ├── BookDetails.jsx
│           └── Library.jsx
├── server/
│   ├── app.py
│   ├── recommender.py
│   ├── requirements.txt
│   └── books.json
└── README.md
```

## Requirements

- Python 3.10+
- Node.js 18+ and npm

## Run on Windows

### 1. Start Flask API

Open a terminal in the project folder:

```powershell
cd server
py -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python app.py
```

The API runs at `http://127.0.0.1:5000`. Keep this terminal open.

### 2. Start React frontend

Open a second terminal:

```powershell
cd client
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Run on macOS / Linux

Backend: `cd server && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && python app.py`

Frontend in another terminal: `cd client && npm install && npm run dev`

## API endpoints

- `GET /api/health` — health check and dataset count
- `GET /api/books?search=dune&genre=Sci-Fi` — search and genre filter
- `GET /api/books/1` — book details and four similar titles
- `POST /api/recommend` — body: `{"interests":["Sci-Fi"],"readBooks":[{"id":1,"rating":5}]}`

CORS is configured in `server/app.py` for the local Vite origins `localhost:5173` and `127.0.0.1:5173`. If you change the frontend port, update the allowlist.

## Recommendation logic

1. The backend combines each book's title, author, genres, tags, and description into text.
2. Scikit-learn converts the text into TF-IDF vectors.
3. Cosine similarity estimates how close books are by content.
4. Interest match is combined with similarity to previously read books. Higher ratings give read books more weight.
5. Read book IDs are removed from candidates before ranking, so a known read title is never recommended.
6. The API returns up to ten candidates with a concise reason.

When the user has no interests and no reading history, the backend still returns a small default-ranked selection instead of an error. The current local dataset contains 50 records; add more book objects to `books.json` to grow it.

## Notes

- Reading lists, ratings, interests, and theme preference are saved in browser `localStorage`; there is no login or server-side user account.
- Cover art is represented by designed typographic covers, so the app works without remote image services or broken cover URLs.
- The API intentionally validates malformed recommendation payloads and returns a 404 for unknown book IDs.
