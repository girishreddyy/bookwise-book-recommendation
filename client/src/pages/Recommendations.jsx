import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, getRecommendations } from '../api';
import { useApp } from '../state/AppContext';
import { BookCard, GenreChip, GENRES, SearchBar, Loading, ErrorMessage } from '../components';

export default function Recommendations() {
  const { interests, setInterests, readBooks, addWant, markRead, wantToRead } = useApp();
  const [items, setItems] = useState([]); const [allBooks, setAllBooks] = useState([]);
  const [search, setSearch] = useState(''); const [genre, setGenre] = useState('All');
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { getBooks().then(d => setAllBooks(d.books)).catch(e => setError(e.message)); }, []);
  useEffect(() => {
    let alive = true; setLoading(true); setError('');
    getRecommendations({interests, readBooks: readBooks.map(b => ({id:b.id, rating:b.rating || 3}))})
      .then(d => alive && setItems(d.recommendations)).catch(e => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [interests, readBooks]);
  const visible = items.filter(b => (!search || `${b.title} ${b.author}`.toLowerCase().includes(search.toLowerCase())) && (genre === 'All' || b.genres.includes(genre)));
  return <section className="page-wrap page-section">
    <div className="page-intro"><p className="eyebrow">MADE FOR YOUR TASTE</p><h1>Your next great reads.</h1><p>Recommendations blend your selected interests with the books you’ve already enjoyed.</p></div>
    <div className="recommendation-controls"><SearchBar value={search} onChange={setSearch}/><select value={genre} onChange={e=>setGenre(e.target.value)} aria-label="Filter by genre"><option>All</option>{GENRES.map(g=><option key={g}>{g}</option>)}</select></div>
    <div className="selected-interests"><span>Your interests</span>{GENRES.slice(0,11).map(g=><GenreChip key={g} label={g} active={interests.includes(g)} onClick={()=>setInterests(p=>p.includes(g)?p.filter(x=>x!==g):[...p,g])}/>)}</div>
    {readBooks.length > 0 && <p className="helper-line">Using {readBooks.length} book{readBooks.length===1?'':'s'} from your reading history. Already-read titles are excluded.</p>}
    {error && <ErrorMessage message={error}/>}
    {loading ? <Loading/> : visible.length ? <><div className="results-count">{visible.length} recommendations</div><div className="book-grid">{visible.map(b=><BookCard key={b.id} book={b} reason={b.reason} onWant={addWant} onRead={markRead} isSaved={wantToRead.some(x=>x.id===b.id)}/>)}</div></> : <div className="empty-state"><div className="empty-icon">⌕</div><h2>No matches just yet</h2><p>Try removing a filter, choosing a genre, or adding books you’ve read to improve personalization.</p><Link className="button button-primary" to="/library">Update my library</Link></div>}
  </section>;
}
