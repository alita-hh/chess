import { banners, gridItems, news, activities, articles } from '../mock.js';
import { getActivityStatus, getRemainingSlots, store } from '../store.js';
import { navigate } from '../router.js';
import { showToast, initBanner, statusBadge, escapeHtml } from '../ui.js';

export function renderHome(container) {
  const user = store.getUser();
  const greeting = user ? `${user.nickname}，您好` : '欢迎来到象棋协会';

  const openActivities = activities
    .filter(a => getActivityStatus(a) !== 'ended')
    .slice(0, 3);

  const previewArticles = articles.slice(0, 2);

  container.innerHTML = `
    <div class="page has-tabbar">
      <div class="home-header">
        <div class="home-greeting">${escapeHtml(greeting)}</div>
        <div class="home-sub">传承象棋文化，以棋会友</div>
        <div class="banner" id="home-banner">
          <div class="banner-track">
            ${banners.map(b => `
              <div class="banner-slide" data-link-type="${b.linkType}" data-link-id="${b.linkId}">
                <img src="${b.image}" alt="${escapeHtml(b.title)}" loading="lazy">
              </div>
            `).join('')}
          </div>
          <div class="banner-dots">
            ${banners.map((_, i) => `<button class="banner-dot${i === 0 ? ' active' : ''}" aria-label="第${i + 1}张"></button>`).join('')}
          </div>
        </div>
      </div>
      <div class="page-content" style="padding-top:0">
        <div class="section">
          <div class="grid-menu">
            ${gridItems.map(item => `
              <button class="grid-item" data-grid-id="${item.id}">
                <div class="grid-icon">${item.icon}</div>
                <span class="grid-label">${escapeHtml(item.label)}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <span class="section-title">活动预约</span>
            <a class="section-more" href="#/activities">查看更多 ›</a>
          </div>
          ${openActivities.length === 0 ? `
            <div class="empty-state">
              <div class="empty-icon">📅</div>
              <div class="empty-title">暂无活动</div>
            </div>
          ` : openActivities.map(a => activityPreviewCard(a)).join('')}
        </div>

        <div class="section">
          <div class="section-header">
            <span class="section-title">实时资讯</span>
            <a class="section-more" href="#/articles">查看更多 ›</a>
          </div>
          ${previewArticles.map(a => homeArticleCard(a)).join('')}
        </div>

        <div class="section">
          <div class="section-header">
            <span class="section-title">协会新闻</span>
          </div>
          ${news.slice(0, 3).map(n => `
            <a class="news-item" href="#/news/${n.id}">
              <div class="news-title">${escapeHtml(n.title)}</div>
              <div class="news-summary">${escapeHtml(n.summary)}</div>
              <div class="news-date">${n.date}</div>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  initBanner(container.querySelector('#home-banner'));

  container.querySelectorAll('.banner-slide').forEach(slide => {
    slide.addEventListener('click', () => {
      const type = slide.dataset.linkType;
      const id = slide.dataset.linkId;
      if (type === 'activity') navigate('#/activity/' + id);
    });
  });

  container.querySelectorAll('.grid-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = gridItems.find(g => g.id === Number(btn.dataset.gridId));
      if (!item) return;
      if (item.requireAuth && !store.isLoggedIn()) {
        navigate('#/login?redirect=' + encodeURIComponent(item.route));
        return;
      }
      if (item.action === 'route') {
        navigate(item.route);
        if (item.hash) {
          setTimeout(() => {
            const el = document.getElementById(item.hash);
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else if (item.action === 'toast') {
        showToast(item.message);
      }
    });
  });

  container.querySelectorAll('.activity-card').forEach(card => {
    card.addEventListener('click', () => {
      navigate('#/activity/' + card.dataset.id);
    });
  });

  container.querySelectorAll('.home-article-card').forEach(card => {
    card.addEventListener('click', () => {
      navigate('#/articles/' + card.dataset.id);
    });
  });
}

function homeArticleCard(article) {
  return `
    <article class="home-article-card" data-id="${article.id}">
      <img class="home-article-cover" src="${article.cover}" alt="" loading="lazy">
      <div class="home-article-body">
        <h3 class="home-article-title">${escapeHtml(article.title)}</h3>
        <p class="home-article-summary">${escapeHtml(article.summary)}</p>
        <time class="home-article-date">${article.publishedAt}</time>
      </div>
    </article>
  `;
}

function activityPreviewCard(activity) {
  const status = getActivityStatus(activity);
  const remaining = getRemainingSlots(activity);
  return `
    <div class="activity-card" data-id="${activity.id}">
      <img class="activity-cover" src="${activity.cover}" alt="" loading="lazy">
      <div class="activity-info">
        <div class="activity-title">${escapeHtml(activity.title)}</div>
        <div class="activity-meta">${activity.startTime}</div>
        <div class="activity-meta">${escapeHtml(activity.location)}</div>
        <div class="activity-footer">
          ${statusBadge(status)}
          ${status === 'open' ? `<span class="badge badge-slots">剩余 ${remaining} 名额</span>` : ''}
        </div>
      </div>
    </div>
  `;
}
