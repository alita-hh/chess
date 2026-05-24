import { getArticleById } from '../mock.js';
import { back } from '../router.js';
import { escapeHtml } from '../ui.js';

function renderBlocks(blocks) {
  if (!blocks || blocks.length === 0) return '';
  return blocks.map(block => {
    if (block.type === 'image') {
      const caption = block.caption
        ? `<figcaption class="article-detail-caption">${escapeHtml(block.caption)}</figcaption>`
        : '';
      return `
        <figure class="article-detail-figure">
          <img src="${block.src}" alt="${escapeHtml(block.caption || '')}" loading="lazy">
          ${caption}
        </figure>
      `;
    }
    return `<p>${escapeHtml(block.text)}</p>`;
  }).join('');
}

export function renderArticleDetail(container, { id }) {
  const item = getArticleById(id);
  if (!item) {
    container.innerHTML = `<div class="page"><div class="empty-state"><div class="empty-title">资讯不存在</div></div></div>`;
    return;
  }

  container.innerHTML = `
    <div class="page">
      <div class="navbar">
        <button class="navbar-back" id="nav-back">‹ 返回</button>
        <div class="navbar-title">资讯详情</div>
        <div class="navbar-action"></div>
      </div>
      <div class="article-detail-header">
        <h1 class="article-detail-title">${escapeHtml(item.title)}</h1>
        <time class="article-detail-meta">${item.publishedAt}</time>
      </div>
      <div class="article-detail-body">
        ${renderBlocks(item.blocks)}
      </div>
    </div>
  `;

  container.querySelector('#nav-back').addEventListener('click', () => back('#/articles'));
}
