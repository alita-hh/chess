import { articles } from '../mock.js';
import { back, navigate } from '../router.js';
import { escapeHtml } from '../ui.js';

export function renderArticles(container) {
  container.innerHTML = `
    <div class="page">
      <div class="navbar">
        <button class="navbar-back" id="nav-back">‹ 返回</button>
        <div class="navbar-title">实时资讯</div>
        <div class="navbar-action"></div>
      </div>
      <div class="page-content">
        ${articles.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">📰</div>
            <div class="empty-title">暂无资讯</div>
          </div>
        ` : articles.map(a => articleCard(a)).join('')}
      </div>
    </div>
  `;

  container.querySelector('#nav-back').addEventListener('click', () => back('#/home'));

  container.querySelectorAll('.article-card').forEach(card => {
    card.addEventListener('click', () => {
      navigate('#/articles/' + card.dataset.id);
    });
  });
}

function articleCard(article) {
  return `
    <article class="article-card" data-id="${article.id}">
      <img class="article-card-cover" src="${article.cover}" alt="" loading="lazy">
      <div class="article-card-body">
        <h3 class="article-card-title">${escapeHtml(article.title)}</h3>
        <p class="article-card-summary">${escapeHtml(article.summary)}</p>
        <time class="article-card-date">${article.publishedAt}</time>
      </div>
    </article>
  `;
}
