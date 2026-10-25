const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}
export const getBooks = (search = '', genre = '') =>
  request(`/books?search=${encodeURIComponent(search)}&genre=${encodeURIComponent(genre)}`);
export const getBook = id => request(`/books/${id}`);
export const getRecommendations = payload => request('/recommend', {
  method: 'POST', body: JSON.stringify(payload)
});
