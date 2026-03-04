// static/js/search.js

class SimpleSearch {
  constructor(options = {}) {
    this.inputSelector = options.inputSelector || '#search-input';
    this.resultsSelector = options.resultsSelector || '#search-results';
    this.maxResults = options.maxResults || 10;

    this.posts = [];
    this.init();
  }

  async init() {
    try {
      const response = await fetch('/index.json');
      const data = await response.json();
      this.posts = data.posts;

      this.attachListeners();
    } catch (err) {
      console.error('Failed to load search index:', err);
    }
  }

  attachListeners() {
    const input = document.querySelector(this.inputSelector);
    if (!input) return;

    input.addEventListener('input', (e) => this.handleSearch(e));

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        this.clearResults();
      }
    });
  }

  handleSearch(event) {
    const query = event.target.value.trim().toLowerCase();

    if (query.length < 2) {
      this.clearResults();
      return;
    }

    // Simple search through posts
    const results = this.posts.filter(post => {
      return (
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }).slice(0, this.maxResults);

    this.displayResults(results);
  }

  displayResults(results) {
    const resultsDiv = document.querySelector(this.resultsSelector);

    if (results.length === 0) {
      resultsDiv.innerHTML = '<div class="no-results">No posts found</div>';
      return;
    }

    const html = results
      .map(post => `
        <a href="${post.url}" class="search-result-item">
          <div class="result-title">${this.escapeHtml(post.title)}</div>
          <div class="result-preview">${this.escapeHtml(post.content.substring(0, 100))}...</div>
          <div class="result-date">${post.date}</div>
        </a>
      `)
      .join('');

    resultsDiv.innerHTML = html;
  }

  clearResults() {
    const resultsDiv = document.querySelector(this.resultsSelector);
    if (resultsDiv) resultsDiv.innerHTML = '';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SimpleSearch();
});
