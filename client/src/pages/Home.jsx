import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBooks } from '../api';
import { useApp } from '../state/AppContext';
import { BookCard, GenreChip, GENRES, SearchBar, Loading, ErrorMessage } from '../components';

export default function Home() {
  const { interests, setInterests, readBooks, addWant, markRead, wantToRead } = useApp();
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    let alive = true; setLoading(true);
    getBooks(search).then(d => { if (alive) setBooks(d.books.slice(0, 8)); })
      .catch(e => alive && setError(e.message)).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [search]);
  const toggle = genre => setInterests(prev => prev.includes(genre) ? prev.filter(x => x !== genre) : [...prev, genre]);
  return <>
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h1>Find a book that<br/><em>feels like you.</em></h1>
        <p className="hero-subtitle">A thoughtful reading companion that learns what you love and helps you discover what’s next.</p>
        <div className="hero-buttons"><button className="button button-primary" onClick={() => document.getElementById('interests')?.scrollIntoView({behavior:'smooth'})}>Find my next read <span>↗</span></button><button className="button button-text" onClick={() => navigate('/library')}>View my library →</button></div>
        <div className="hero-stats"><div><strong>50</strong><span>hand-picked books</span></div><div><strong>13</strong><span>genres to explore</span></div><div><strong>10</strong><span>personal picks</span></div></div>
      </div>
      <div className="hero-art"><div className="sun-shape" /><div className="floating-note">A little curiosity<br/>goes a long way.</div><div className="hero-book book-one"><span>01 / FICTION</span><b>The stories<br/>we carry</b><small>BOOKWISE EDITION</small></div><div className="hero-book book-two"><span>02 / DISCOVERY</span><b>Somewhere<br/>new</b><small>YOUR NEXT CHAPTER</small></div><div className="hero-spark">✳</div></div>
    </section>
    <section className="section page-wrap" id="interests">
      <div className="section-heading"><div><p className="eyebrow">FIRST, A LITTLE ABOUT YOU</p><h2>What are you in the mood for?</h2><p>Choose as many interests as you like. We’ll shape your recommendations around them.</p></div><span className="step-count">01 <i>/ 03</i></span></div>
      <div className="genre-grid">{GENRES.map(g => <GenreChip key={g} label={g} active={interests.includes(g)} onClick={() => toggle(g)} />)}</div>
      <div className="interest-bottom"><span>{interests.length ? `${interests.length} interest${interests.length > 1 ? 's' : ''} selected` : 'Pick at least one, or let your reading history guide us.'}</span><button className="button button-primary" onClick={() => navigate('/recommendations')}>Get recommendations <span>→</span></button></div>
    </section>
    <section className="section section-tinted"><div className="page-wrap"><div className="section-heading"><div><p className="eyebrow">A GOOD PLACE TO START</p><h2>Readers are exploring</h2><p>Search the collection, save a title, or open a book to learn more.</p></div><span className="step-count">02 <i>/ 03</i></span></div>
      <SearchBar value={search} onChange={setSearch} />
      {error && <ErrorMessage message={error}/>}
      {loading ? <Loading /> : books.length ? <div className="book-grid">{books.map(b => <BookCard key={b.id} book={b} onWant={addWant} onRead={markRead} isSaved={wantToRead.some(x=>x.id===b.id)}/>)}</div> : <div className="state-panel">No books found. Try another title or author.</div>}
    </div></section>
    <section className="closing-cta page-wrap"><div><p className="eyebrow">YOUR READING LIFE, ORGANIZED</p><h2>Every great reading list<br/>starts with one book.</h2></div><button className="button button-primary" onClick={() => navigate('/library')}>Open my library →</button></section>
  </>;
}
