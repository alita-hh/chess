import { store } from '../store.js';
import { navigate, back } from '../router.js';
import { escapeHtml, certificationDisplayBadge } from '../ui.js';
import { syncUserLevelFromCertifications } from '../certification.js';
import { getApplyLevelLabel } from '../constants.js';

export function renderCertificationIndex(container) {
  const user = store.getUser();
  if (!user) {
    navigate('#/login?redirect=' + encodeURIComponent('#/certification/index'));
    return;
  }

  syncUserLevelFromCertifications(user.phone);
  const refreshed = store.getUser();
  const records = store.getCertificationsByUser(user.phone);
  const hasLevel = !!refreshed.currentLevel;

  container.innerHTML = `
    <div class="page">
      <div class="navbar">
        <button class="navbar-back" id="nav-back">‹ 返回</button>
        <div class="navbar-title">等级认证</div>
        <button class="navbar-action navbar-link" id="go-apply">申请</button>
      </div>
      <div class="page-content">
        <div class="cert-level-card ${hasLevel ? 'cert-level-card--active' : ''}">
          ${hasLevel ? `
            <div class="cert-level-card-label">当前等级</div>
            <div class="cert-level-card-value">${escapeHtml(refreshed.currentLevel)}</div>
            <div class="cert-level-card-date">发证日期：${formatDate(refreshed.certifiedAt)}</div>
          ` : `
            <div class="cert-level-card-empty">暂无等级认证</div>
            <p class="cert-level-card-hint">完成等级认证后，方可报名有棋力要求的赛事活动</p>
            <button class="btn btn-primary" id="empty-apply">去认证</button>
          `}
        </div>

        <div class="section-header" style="margin: 20px 0 12px">
          <span class="section-title">历史申请记录</span>
        </div>
        ${records.length === 0 ? `
          <div class="empty-state" style="padding: 32px 0">
            <div class="empty-icon">📄</div>
            <div class="empty-title">暂无历史申请记录</div>
          </div>
        ` : records.map(r => historyCard(r)).join('')}
      </div>
    </div>
  `;

  container.querySelector('#nav-back').addEventListener('click', () => back('#/profile'));
  container.querySelector('#go-apply')?.addEventListener('click', () => navigate('#/certification/apply'));
  container.querySelector('#empty-apply')?.addEventListener('click', () => navigate('#/certification/apply'));

  container.querySelectorAll('.cert-history-card').forEach(card => {
    card.addEventListener('click', () => navigate('#/certification/detail/' + card.dataset.id));
  });
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('zh-CN');
}

function historyCard(record) {
  const levelLabel = getApplyLevelLabel(record.applyLevel) || record.applyLevel;
  return `
    <div class="cert-card cert-history-card" data-id="${record.id}">
      <div class="cert-card-header">
        <span class="cert-type-tag">象棋</span>
        ${certificationDisplayBadge(record.status)}
      </div>
      <div class="cert-card-level">${escapeHtml(levelLabel)}</div>
      <div class="cert-card-date">提交时间：${new Date(record.createdAt).toLocaleString('zh-CN')}</div>
    </div>
  `;
}
