import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBook } from '../api';
import { useApp } from '../state/AppContext';
import { BookCard, Loading, ErrorMessage } from '../components';

export default function BookDetails() {
  const { id } = useParams(); const { addWant, markRead, wantToRead } = useApp();
  const [data,setData]=useState(null); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  useEffect(()=>{let alive=true;setLoading(true);getBook(id).then(d=>alive&&setData(d)).catch(e=>alive&&setError(e.message)).finally(()=>alive&&setLoading(false));return()=>{alive=false};},[id]);
  if(loading) return <section className="page-wrap page-section"><Loading text="Opening book details…"/></section>;
  if(error || !data) return <section className="page-wrap page-section"><ErrorMessage message={error || 'Book not found'}/><Link to="/">Back home</Link></section>;
  const {book,similar}=data;
  return <section className="page-wrap page-section">
    <Link to="/" className="back-link">← Back to discovery</Link>
    <div className="detail-layout"><div className="detail-cover"><div className="book-cover large-cover"><div className="cover-mark">B.</div><div className="cover-title">{book.title}</div><div className="cover-author">{book.author}</div></div></div>
      <div className="detail-copy"><p className="eyebrow">BOOK DETAILS</p><div className="detail-genres">{book.genres.map(g=><span key={g}>{g}</span>)}</div><h1>{book.title}</h1><p className="detail-author">by {book.author}</p><p className="detail-rating">★ {Number(book.rating).toFixed(1)} <span>community rating</span> · {book.year}</p><p className="detail-description">{book.description}</p>
      <div className="detail-actions"><button className="button button-primary" onClick={()=>addWant(book)} disabled={wantToRead.some(b=>b.id===book.id)}>{wantToRead.some(b=>b.id===book.id)?'In your list':'＋ Want to read'}</button><button className="button button-outline" onClick={()=>markRead(book)}>Mark as read</button></div></div></div>
    <div className="section-heading related-heading"><div><p className="eyebrow">KEEP EXPLORING</p><h2>Books with a similar feel</h2></div></div>
    <div className="book-grid">{similar.map(b=><BookCard key={b.id} book={b} onWant={addWant} isSaved={wantToRead.some(x=>x.id===b.id)}/>)}</div>
  </section>;
}
