import React from 'react';
import { Link } from 'react-router-dom';

export const GENRES = ['Fiction','Sci-Fi','Fantasy','Mystery','Romance','Self-Help','Business','History','Biography','Tech','Psychology','Adventure','Thriller'];
export function GenreChip({ label, active, onClick }) {
  return <button type="button" className={`genre-chip ${active ? 'active' : ''}`} onClick={onClick} aria-pressed={!!active}>{label}</button>;
}
export function SearchBar({ value, onChange, placeholder = 'Search books or authors...' }) {
  return <label className="search-bar"><span aria-hidden="true">⌕</span><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} /></label>;
}
export function StarRating({ value = 0, onChange, readOnly = false }) {
  return <div className="stars" aria-label={`${value} out of 5 stars`}>{[1,2,3,4,5].map(n =>
    <button key={n} type="button" disabled={readOnly} className={n <= value ? 'star selected' : 'star'} onClick={() => onChange?.(n)} aria-label={`${n} stars`}>★</button>
  )}</div>;
}
export function BookCard({ book, reason, onWant, onRead, isSaved = false }) {
  return <article className="book-card">
    <Link to={`/books/${book.id}`} className="cover-link" aria-label={`Details for ${book.title}`}>
      <div className="book-cover"><div className="cover-mark">B.</div><div className="cover-title">{book.title}</div><div className="cover-author">{book.author}</div></div>
    </Link>
    <div className="book-card-body">
      <div className="book-meta">{(book.genres || []).slice(0, 2).join(' · ')}</div>
      <Link to={`/books/${book.id}`} className="book-title">{book.title}</Link>
      <p className="book-author">{book.author}</p>
      <p className="book-rating">★ {Number(book.rating || 0).toFixed(1)} <span>reader rating</span></p>
      {reason && <p className="recommendation-reason">{reason}</p>}
      <div className="card-actions">
        {onWant && <button className="button button-small button-outline" onClick={() => onWant(book)} disabled={isSaved}>{isSaved ? 'Saved' : '+ Want to read'}</button>}
        {onRead && <button className="button button-small button-muted" onClick={() => onRead(book)}>Mark read</button>}
      </div>
    </div>
  </article>;
}
export function Navbar() {
  return <header className="navbar"><Link className="brand" to="/"><span className="brand-icon">B.</span> bookwise</Link><nav><Link to="/">Discover</Link><Link to="/recommendations">For you</Link><Link to="/library">My library</Link></nav></header>;
}
export function Footer() { return <footer className="footer"><span>bookwise</span><span>Make room for a good story.</span></footer>; }
export function Loading({ text = 'Finding your next great read…' }) { return <div className="state-panel"><span className="loader" />{text}</div>; }
export function ErrorMessage({ message }) { return <div className="error-panel" role="alert">{message} <span>Check that the Flask API is running on port 5000.</span></div>; }
