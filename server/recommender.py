"""Content-based book recommendations using TF-IDF and cosine similarity."""
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class BookRecommender:
    def __init__(self, books):
        self.books = books
        self.index_by_id = {book["id"]: i for i, book in enumerate(books)}
        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        self.matrix = self.vectorizer.fit_transform([self._text(book) for book in books])
        self.similarity = cosine_similarity(self.matrix)

    @staticmethod
    def _text(book):
        return " ".join([
            " ".join(book.get("genres", [])),
            " ".join(book.get("tags", [])),
            book.get("description", ""),
            book.get("title", ""),
            book.get("author", ""),
        ])

    def recommend(self, interests=None, read_books=None, limit=10):
        interests = [str(x).strip().lower() for x in (interests or []) if str(x).strip()]
        read_books = read_books or []
        read_ids = set()
        weighted_reads = []
        for item in read_books:
            if not isinstance(item, dict):
                continue
            try:
                book_id = int(item.get("id"))
            except (TypeError, ValueError):
                continue
            if book_id not in self.index_by_id:
                continue
            read_ids.add(book_id)
            try:
                rating = max(1, min(5, float(item.get("rating", 3))))
            except (TypeError, ValueError):
                rating = 3
            weighted_reads.append((self.index_by_id[book_id], rating))

        interest_scores = []
        for book in self.books:
            genres = {g.lower() for g in book.get("genres", [])}
            tags = {t.lower() for t in book.get("tags", [])}
            matched = sum(1 for interest in interests if interest in genres or interest in tags)
            interest_scores.append(matched / max(1, len(interests)))

        candidates = []
        for idx, book in enumerate(self.books):
            if book["id"] in read_ids:
                continue
            interest_score = interest_scores[idx]
            similarity_score = 0.0
            reason_parts = []
            if weighted_reads:
                # Ratings weight the similarity of each candidate to books the user has read.
                weights = [max(0.15, rating - 1) for _, rating in weighted_reads]
                sims = [self.similarity[idx][read_idx] for read_idx, _ in weighted_reads]
                similarity_score = sum(s * w for s, w in zip(sims, weights)) / sum(weights)
                best_position = max(range(len(sims)), key=lambda i: sims[i] * weights[i])
                best_idx, best_rating = weighted_reads[best_position]
                if sims[best_position] > 0.04:
                    reason_parts.append(f"Similar to {self.books[best_idx]['title']}")
            # Interests matter most; read-book similarity adds personalization.
            score = 0.58 * interest_score + 0.42 * similarity_score if weighted_reads else interest_score
            if not interests and weighted_reads:
                score = similarity_score
            if not interests and not weighted_reads:
                score = sum(1 for g in book.get("genres", [])) * 0.01 + book.get("rating", 0) / 100
            matched_genres = [g for g in book.get("genres", []) if g.lower() in interests]
            if matched_genres:
                reason_parts.append("matches your interest in " + ", ".join(matched_genres))
            if not reason_parts:
                reason_parts.append("a strong starting point based on its themes and reader rating")
            candidates.append((score, book, "; ".join(reason_parts)))

        candidates.sort(key=lambda row: (row[0], row[1].get("rating", 0)), reverse=True)
        return [
            {**book, "score": round(float(score), 4), "reason": reason}
            for score, book, reason in candidates[:max(1, min(int(limit), 30))]
        ]
