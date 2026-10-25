import json
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from recommender import BookRecommender

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

DATA_PATH = os.path.join(os.path.dirname(__file__), "books.json")
with open(DATA_PATH, "r", encoding="utf-8") as handle:
    BOOKS = json.load(handle)
RECOMMENDER = BookRecommender(BOOKS)


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "books": len(BOOKS)})


@app.get("/api/books")
def get_books():
    query = request.args.get("search", "").strip().lower()
    genre = request.args.get("genre", "").strip().lower()
    results = BOOKS
    if query:
        results = [b for b in results if query in b["title"].lower()
                   or query in b["author"].lower()
                   or query in b["description"].lower()
                   or any(query in tag.lower() for tag in b.get("tags", []))]
    if genre and genre != "all":
        results = [b for b in results if any(genre == g.lower() for g in b["genres"])]
    return jsonify({"books": results, "total": len(results)})


@app.get("/api/books/<int:book_id>")
def get_book(book_id):
    book = next((b for b in BOOKS if b["id"] == book_id), None)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    idx = RECOMMENDER.index_by_id[book_id]
    similar = []
    for other_idx, score in enumerate(RECOMMENDER.similarity[idx]):
        if other_idx != idx:
            similar.append((float(score), BOOKS[other_idx]))
    similar.sort(key=lambda x: x[0], reverse=True)
    return jsonify({"book": book, "similar": [b for _, b in similar[:4]]})


@app.post("/api/recommend")
def recommend():
    payload = request.get_json(silent=True) or {}
    interests = payload.get("interests", [])
    read_books = payload.get("readBooks", [])
    if not isinstance(interests, list) or not isinstance(read_books, list):
        return jsonify({"error": "interests and readBooks must be arrays"}), 400
    results = RECOMMENDER.recommend(interests, read_books, limit=10)
    return jsonify({"recommendations": results, "total": len(results)})


@app.errorhandler(404)
def not_found(_error):
    return jsonify({"error": "Endpoint or book not found"}), 404


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
