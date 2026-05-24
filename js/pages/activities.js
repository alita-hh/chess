import { activities } from '../mock.js';
import { getActivityStatus, getRemainingSlots } from '../store.js';
import { navigate } from '../router.js';
import { statusBadge, formatFee, escapeHtml } from '../ui.js';

export function renderActivities(container, { filter = 'all' } = {}) {
  let list = activities.map(a => ({ ...a, computedStatus: getActivityStatus(a) }));

  if (filter === 'open') {
    list = list.filter(a => a.computedStatus === 'open' || a.computedStatus === 'full');
  } else if (filter === 'ended') {
    list = list.filter(a => a.computedStatus === 'ended');
  }

  container.innerHTML = `
    <div class="page has-tabbar">
      <div class="filter-tabs">
        <button class="filter-tab${filter === 'all' ? ' active' : ''}" data-filter="all">全部</button>
        <button class="filter-tab${filter === 'open' ? ' active' : ''}" data-filter="open">报名中</button>
        <button class="filter-tab${filter === 'ended' ? ' active' : ''}" data-filter="ended">已结束</button>
      </div>
      <div class="page-content">
        ${list.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">📅</div>
            <div class="empty-title">暂无活动</div>
            <div class="empty-desc">换个筛选条件试试</div>
          </div>
        ` : list.map(a => activityListCard(a)).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      renderActivities(container, { filter: tab.dataset.filter });
    });
  });

  container.querySelectorAll('.activity-card').forEach(card => {
    card.addEventListener('click', () => {
      navigate('#/activity/' + card.dataset.id);
    });
  });
}

function activityListCard(activity) {
  const status = activity.computedStatus;
  const remaining = getRemainingSlots(activity);
  return `
    <div class="activity-card" data-id="${activity.id}">
      <img class="activity-cover" src="${activity.cover}" alt="" loading="lazy">
      <div class="activity-info">
        <div class="activity-title">${escapeHtml(activity.title)}</div>
        <div class="activity-meta">${activity.startTime}</div>
        <div class="activity-meta">${escapeHtml(activity.location)}</div>
        <div class="activity-footer">
          <div style="display:flex;gap:6px;align-items:center">
            ${statusBadge(status)}
            ${formatFee(activity.fee)}
          </div>
          ${status === 'open' ? `<span class="badge badge-slots">剩 ${remaining}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}
