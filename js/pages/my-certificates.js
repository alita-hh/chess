import { store } from '../store.js';
import { navigate, back } from '../router.js';
import { showToast, certReviewBadge, escapeHtml } from '../ui.js';
import { getChessTypeLabel, REVIEW_STATUS } from '../constants.js';

export function renderMyCertificates(container, { filter = 'all' } = {}) {
  const user = store.getUser();
  if (!user) {
    navigate('#/login?redirect=' + encodeURIComponent('#/my-certificates'));
    return;
  }

  let certs = store.getCertificatesByUser(user.phone);
  if (filter !== 'all') {
    certs = certs.filter(c => c.reviewStatus === filter);
  }

  const filterTabs = [
    { key: 'all', label: '全部' },
    { key: 'pending_first', label: '待初审' },
    { key: 'pending_second', label: '待复审' },
    { key: 'approved', label: '已通过' },
    { key: 'rejected', label: '已驳回' },
  ];

  container.innerHTML = `
    <div class="page">
      <div class="navbar">
        <button class="navbar-back" id="nav-back">‹ 返回</button>
        <div class="navbar-title">我的证书</div>
        <button class="navbar-action navbar-link" id="add-cert">添加</button>
      </div>
      <div class="filter-tabs cert-filter-tabs">
        ${filterTabs.map(t => `
          <button class="filter-tab${filter === t.key ? ' active' : ''}" data-filter="${t.key}">${t.label}</button>
        `).join('')}
      </div>
      <div class="page-content">
        ${certs.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">🏅</div>
            <div class="empty-title">暂无证书记录</div>
            <div class="empty-desc">提交您的棋类等级证书，协会审核通过后即可展示</div>
            <button class="btn btn-primary" id="go-add">添加证书</button>
          </div>
        ` : certs.map(c => certCard(c)).join('')}
      </div>
    </div>
  `;

  container.querySelector('#nav-back').addEventListener('click', () => back('#/profile'));
  container.querySelector('#add-cert')?.addEventListener('click', () => navigate('#/certificate/add'));
  container.querySelector('#go-add')?.addEventListener('click', () => navigate('#/certificate/add'));

  container.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      renderMyCertificates(container, { filter: tab.dataset.filter });
    });
  });

  container.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      navigate('#/certificate/' + card.dataset.id);
    });
  });
}

function certCard(cert) {
  return `
    <div class="cert-card" data-id="${cert.id}">
      <div class="cert-card-header">
        <span class="cert-type-tag">${escapeHtml(getChessTypeLabel(cert.chessType))}</span>
        ${certReviewBadge(cert.reviewStatus)}
      </div>
      <div class="cert-card-level">${escapeHtml(cert.certLevel)}</div>
      <div class="cert-card-meta">${escapeHtml(cert.eventName)}</div>
      <div class="cert-card-meta">编号：${escapeHtml(cert.certNo)}</div>
      <div class="cert-card-date">${new Date(cert.submittedAt).toLocaleString('zh-CN')}</div>
    </div>
  `;
}

export function renderCertificateDetail(container, { id }) {
  const user = store.getUser();
  if (!user) {
    navigate('#/login?redirect=' + encodeURIComponent('#/certificate/' + id));
    return;
  }

  const cert = store.getCertificateById(id);
  if (!cert || cert.phone !== user.phone) {
    container.innerHTML = `<div class="page"><div class="empty-state"><div class="empty-title">证书不存在</div></div></div>`;
    return;
  }

  const statusInfo = REVIEW_STATUS[cert.reviewStatus] || REVIEW_STATUS.pending_first;
  const canResubmit = cert.reviewStatus === 'rejected';

  container.innerHTML = `
    <div class="page${canResubmit ? ' has-bottom-bar' : ''}">
      <div class="navbar">
        <button class="navbar-back" id="nav-back">‹ 返回</button>
        <div class="navbar-title">证书详情</div>
        <div class="navbar-action"></div>
      </div>
      <div class="page-content">
        <div class="cert-status-banner ${statusInfo.cls}">
          ${certReviewBadge(cert.reviewStatus)}
          <p class="cert-status-hint">${statusInfo.hint}</p>
        </div>

        ${cert.rejectReason ? `
          <div class="cert-reject-box">
            <div class="cert-reject-title">驳回原因</div>
            <p>${escapeHtml(cert.rejectReason)}</p>
          </div>
        ` : ''}

        <div class="detail-info-list">
          <div class="detail-info-item">
            <span class="detail-info-label">棋类类型</span>
            <span class="detail-info-value">${escapeHtml(getChessTypeLabel(cert.chessType))}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">证书级别</span>
            <span class="detail-info-value">${escapeHtml(cert.certLevel)}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">证书编号</span>
            <span class="detail-info-value">${escapeHtml(cert.certNo)}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">赛事名称</span>
            <span class="detail-info-value">${escapeHtml(cert.eventName)}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">提交时间</span>
            <span class="detail-info-value">${new Date(cert.submittedAt).toLocaleString('zh-CN')}</span>
          </div>
          ${cert.reviewedAt ? `
            <div class="detail-info-item">
              <span class="detail-info-label">审核时间</span>
              <span class="detail-info-value">${new Date(cert.reviewedAt).toLocaleString('zh-CN')}</span>
            </div>
          ` : ''}
        </div>

        <div class="cert-photo-section">
          <div class="section-title" style="margin-bottom:12px">证书照片</div>
          <img class="cert-photo-large" src="${cert.certPhoto}" alt="证书照片">
        </div>
      </div>
      ${canResubmit ? `
        <div class="bottom-bar">
          <button class="btn btn-primary btn-block" id="resubmit-btn">重新提交</button>
        </div>
      ` : ''}
    </div>
  `;

  container.querySelector('#nav-back').addEventListener('click', () => back('#/my-certificates'));
  container.querySelector('#resubmit-btn')?.addEventListener('click', () => {
    navigate('#/certificate/add?editId=' + cert.id);
  });
}
