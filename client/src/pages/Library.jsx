import React, { useEffect, useMemo, useState } from 'react';
import { getBooks } from '../api';
import { useApp } from '../state/AppContext';
import { BookCard, SearchBar, StarRating, Loading, ErrorMessage } from '../components';

export default function Library() {
  const {wantToRead, readBooks, addWant, markRead, removeBook} = useApp();
  const [tab,setTab]=useState('want'); const [search,setSearch]=useState('');
  const [catalog,setCatalog]=useState([]); const [lookup,setLookup]=useState(''); const [matches,setMatches]=useState([]);
  const [ratingId,setRatingId]=useState(null); const [rating,setRating]=useState(5);
  const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  useEffect(()=>{getBooks().then(d=>setCatalog(d.books)).catch(e=>setError(e.message));},[]);
  useEffect(()=>{const q=lookup.trim().toLowerCase();setMatches(q.length<2?[]:catalog.filter(b=>`${b.title} ${b.author}`.toLowerCase().includes(q)).filter(b=>!readBooks.some(r=>r.id===b.id)).slice(0,6));},[lookup,catalog,readBooks]);
  const active = tab==='want' ? wantToRead : readBooks;
  const filtered = useMemo(()=>active.filter(b=>`${b.title} ${b.author}`.toLowerCase().includes(search.toLowerCase())),[active,search]);
  const saveRating = book => { markRead(book, rating); setRatingId(null); setRating(5); };
  return <section className="page-wrap page-section">
    <div className="page-intro"><p className="eyebrow">YOUR PERSONAL SHELF</p><h1>My library.</h1><p>Keep track of what you want to read and the stories you’ve finished. Your library stays on this device.</p></div>
    <div className="library-summary"><div><strong>{wantToRead.length}</strong><span>Want to read</span></div><div><strong>{readBooks.length}</strong><span>Already read</span></div></div>
    <section className="read-add-panel"><div><p className="eyebrow">ADD A BOOK YOU’VE FINISHED</p><h2>Build your reading history</h2><p>Ratings help the recommender understand which books you liked most.</p></div><div className="autocomplete"><SearchBar value={lookup} onChange={setLookup} placeholder="Search title or author to add…"/>{matches.length>0&&<div className="autocomplete-menu">{matches.map(b=><button key={b.id} onClick={()=>{setRatingId(b.id);setRating(5);setLookup('');setMatches([]);}}><span>{b.title}</span><small>{b.author}</small></button>)}</div>}</div></section>
    {ratingId && <div className="rating-prompt"><span>How much did you like “{catalog.find(b=>b.id===ratingId)?.title}”?</span><StarRating value={rating} onChange={setRating}/><button className="button button-primary button-small" onClick={()=>saveRating(catalog.find(b=>b.id===ratingId))}>Save as read</button><button className="button button-text" onClick={()=>setRatingId(null)}>Cancel</button></div>}
    {error&&<ErrorMessage message={error}/>}
    <div className="library-tabs"><button className={tab==='want'?'active':''} onClick={()=>setTab('want')}>Want to read <span>{wantToRead.length}</span></button><button className={tab==='read'?'active':''} onClick={()=>setTab('read')}>Already read <span>{readBooks.length}</span></button></div>
    <SearchBar value={search} onChange={setSearch} placeholder="Filter your library…"/>
    {loading?<Loading/>:filtered.length?<div className="book-grid library-grid">{filtered.map(b=><div className="library-item" key={b.id}><BookCard book={b} onWant={tab==='read'?addWant:undefined} onRead={tab==='want'?markRead:undefined} isSaved={wantToRead.some(x=>x.id===b.id)}/>{tab==='read'&&<div className="saved-rating"><span>Your rating</span><StarRating value={b.rating||0} readOnly/></div>}<button className="remove-link" onClick={()=>removeBook(b.id,tab)}>Remove from library</button></div>)}</div>:<div className="empty-state"><div className="empty-icon">＋</div><h2>{search?'No matching books':'Your shelf is waiting'}</h2><p>{search?'Try a different title or author.':'Save a book from discovery or add a title you have already read.'}</p></div>}
  </section>;
}
