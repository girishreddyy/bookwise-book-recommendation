import React from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { useApp } from './state/AppContext';
import { Navbar, Footer } from './components';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import BookDetails from './pages/BookDetails';
import Library from './pages/Library';

export default function App() {
  const { darkMode, setDarkMode } = useApp();
  const location = useLocation();
  return <div className={darkMode ? 'app dark' : 'app'}>
    <Navbar />
    <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle light and dark mode">{darkMode ? '☀ Light' : '☾ Dark'}</button>
    <main key={location.pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/library" element={<Library />} />
        <Route path="*" element={<section className="page-wrap state-panel"><h2>Page not found</h2><Link to="/">Back to discovery</Link></section>} />
      </Routes>
    </main>
    <Footer />
  </div>;
}
