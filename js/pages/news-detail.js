import { getNewsById } from '../mock.js';
import { back } from '../router.js';
import { renderParagraphs, escapeHtml } from '../ui.js';

export function renderNewsDetail(container, { id }) {
  const item = getNewsById(id);
  if (!item) {
    container.innerHTML = `<div class="page"><div class="empty-state"><div class="empty-title">新闻不存在</div></div></div>`;
    return;
  }

  container.innerHTML = `
    <div class="page">
      <div class="navbar">
        <button class="navbar-back" id="nav-back">‹ 返回</button>
        <div class="navbar-title">新闻详情</div>
        <div class="navbar-action"></div>
      </div>
      <div class="news-detail-header">
        <h1 class="news-detail-title">${escapeHtml(item.title)}</h1>
        <div class="news-detail-meta">${item.date}</div>
      </div>
      <div class="news-detail-body">
        ${renderParagraphs(item.content)}
      </div>
    </div>
  `;

  container.querySelector('#nav-back').addEventListener('click', () => back('#/home'));
}
