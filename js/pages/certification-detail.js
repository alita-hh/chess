import { store } from '../store.js';
import { navigate, back } from '../router.js';
import { escapeHtml } from '../ui.js';
import { certificationDisplayBadge } from '../ui.js';
import {
  getDisplayStatus,
  CERT_DISPLAY_STATUS,
  CERT_BACKEND_STATUS,
  syncUserLevelFromCertifications,
} from '../certification.js';
import { getApplyLevelLabel } from '../constants.js';

export function renderCertificationDetail(container, { id }) {
  const user = store.getUser();
  if (!user) {
    navigate('#/login?redirect=' + encodeURIComponent('#/certification/detail/' + id));
    return;
  }

  const record = store.getCertificationById(id);
  if (!record || record.userId !== user.phone) {
    container.innerHTML = `
      <div class="page">
        <div class="empty-state"><div class="empty-title">申请记录不存在</div></div>
      </div>
    `;
    return;
  }

  syncUserLevelFromCertifications(user.phone);
  const displayKey = getDisplayStatus(record.status);
  const statusInfo = CERT_DISPLAY_STATUS[displayKey];
  const canResubmit = displayKey === 'rejected';
  const levelLabel = record.applyLevelLabel || getApplyLevelLabel(record.applyLevel) || record.applyLevel;

  container.innerHTML = `
    <div class="page${canResubmit ? ' has-bottom-bar' : ''}">
      <div class="navbar">
        <button class="navbar-back" id="nav-back">‹ 返回</button>
        <div class="navbar-title">认证详情</div>
        <div class="navbar-action"></div>
      </div>
      <div class="page-content">
        <div class="cert-status-banner ${statusInfo.cls}">
          ${certificationDisplayBadge(record.status)}
          <p class="cert-status-hint">${escapeHtml(statusInfo.hint)}</p>
        </div>

        ${displayKey === 'rejected' && record.rejectReason ? `
          <div class="cert-reject-box">
            <div class="cert-reject-title">驳回原因</div>
            <p>${escapeHtml(record.rejectReason)}</p>
          </div>
        ` : ''}

        ${displayKey === 'approved' && record.isPaperCertRequired ? `
          <div class="card" style="margin-bottom:16px">
            <div class="card-body">
              <div style="font-weight:600;margin-bottom:8px">纸质证书邮寄</div>
              ${record.trackingNumber ? `
                <div class="detail-info-item" style="padding:4px 0">
                  <span class="detail-info-label">物流单号</span>
                  <span class="detail-info-value">${escapeHtml(record.trackingNumber)}</span>
                </div>
              ` : `<p class="text-secondary" style="font-size:13px">纸质证书正在准备邮寄，请留意公众号通知</p>`}
            </div>
          </div>
        ` : ''}

        <div class="detail-info-list">
          <div class="detail-info-item">
            <span class="detail-info-label">真实姓名</span>
            <span class="detail-info-value">${escapeHtml(record.realName)}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">身份证号</span>
            <span class="detail-info-value">${store.maskIdNumber(record.idCard)}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">申请级别</span>
            <span class="detail-info-value">${escapeHtml(levelLabel)}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">纸质证书</span>
            <span class="detail-info-value">${record.isPaperCertRequired ? '需要' : '不需要'}</span>
          </div>
          ${record.isPaperCertRequired && record.mailingAddress ? `
            <div class="detail-info-item">
              <span class="detail-info-label">邮寄地址</span>
              <span class="detail-info-value">${escapeHtml(record.mailingAddress)}</span>
            </div>
          ` : ''}
          <div class="detail-info-item">
            <span class="detail-info-label">提交时间</span>
            <span class="detail-info-value">${new Date(record.createdAt).toLocaleString('zh-CN')}</span>
          </div>
        </div>

        <div class="cert-photo-section">
          <div class="section-title" style="margin-bottom:12px">等级证明材料</div>
          <div class="cert-images-preview">
            ${(record.certImages || []).map(src => `
              <img class="cert-photo-large" src="${src}" alt="证明材料">
            `).join('')}
          </div>
        </div>
      </div>
      ${canResubmit ? `
        <div class="bottom-bar">
          <button class="btn btn-primary btn-block" id="resubmit-btn">重新申请</button>
        </div>
      ` : ''}
    </div>
  `;

  container.querySelector('#nav-back').addEventListener('click', () => back('#/certification/index'));
  container.querySelector('#resubmit-btn')?.addEventListener('click', () => {
    navigate('#/certification/apply');
  });
}

/** 演示：在控制台可调用 simulateCertReview(id, 'approve'|'reject') 模拟审核 */
export function simulateCertReview(id, action, rejectReason = '照片不清晰，请重新上传') {
  const record = store.getCertificationById(id);
  if (!record) return null;
  const now = new Date().toISOString();
  if (action === 'approve') {
    const updated = store.updateCertification(id, {
      status: CERT_BACKEND_STATUS.APPROVED,
      rejectReason: '',
      trackingNumber: record.isPaperCertRequired ? 'SF' + Date.now().toString().slice(-10) : '',
      updatedAt: now,
    });
    const user = store.getUser();
    if (user && user.phone === record.userId) {
      store.updateProfile({
        currentLevel: updated.applyLevelLabel || getApplyLevelLabel(updated.applyLevel),
        certifiedAt: now,
      });
    }
    return updated;
  }
  if (action === 'reject') {
    return store.updateCertification(id, {
      status: CERT_BACKEND_STATUS.REJECTED_FIRST,
      rejectReason,
      updatedAt: now,
    });
  }
  return null;
}

if (typeof window !== 'undefined') {
  window.simulateCertReview = simulateCertReview;
}
