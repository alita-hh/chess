import { XQ_CERT_LEVELS, getApplyLevelLabel } from './constants.js';
import { store } from './store.js';

/** 后端 status: 0待初审 1初审驳回 2待复审 3终审通过 4复审驳回 */
export const CERT_BACKEND_STATUS = {
  PENDING_FIRST: 0,
  REJECTED_FIRST: 1,
  PENDING_SECOND: 2,
  APPROVED: 3,
  REJECTED_SECOND: 4,
};

/** C 端合并展示（BR-09） */
export const CERT_DISPLAY_STATUS = {
  reviewing: { label: '审核中', cls: 'badge-pending', hint: '您的资料已提交，工作人员正在快马加鞭审核中，请留意公众号通知' },
  approved: { label: '已通过', cls: 'badge-open', hint: '恭喜，您的资质审核已通过！' },
  rejected: { label: '已驳回', cls: 'badge-rejected', hint: '' },
};

export function getDisplayStatus(backendStatus) {
  if (backendStatus === CERT_BACKEND_STATUS.APPROVED) return 'approved';
  if (backendStatus === CERT_BACKEND_STATUS.REJECTED_FIRST ||
      backendStatus === CERT_BACKEND_STATUS.REJECTED_SECOND) return 'rejected';
  return 'reviewing';
}

export function isPendingBackendStatus(status) {
  return status === CERT_BACKEND_STATUS.PENDING_FIRST ||
    status === CERT_BACKEND_STATUS.PENDING_SECOND;
}

export function getLevelRank(levelLabel) {
  if (!levelLabel) return 0;
  return XQ_CERT_LEVELS.find(l => l.label === levelLabel)?.rank ?? 0;
}

export function meetsMinLevel(userLevel, minRequired) {
  if (!minRequired) return true;
  if (!userLevel) return false;
  return getLevelRank(userLevel) >= getLevelRank(minRequired);
}

export function isValidIdCard(id) {
  return /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(id);
}

export function syncUserLevelFromCertifications(phone) {
  const user = store.getUser();
  if (!user || user.phone !== phone) return;
  const approved = store.getCertificationsByUser(phone)
    .filter(c => c.status === CERT_BACKEND_STATUS.APPROVED);
  if (approved.length === 0) return;
  const best = approved.reduce((a, b) =>
    getLevelRank(b.applyLevel) > getLevelRank(a.applyLevel) ? b : a
  );
  const levelLabel = best.applyLevelLabel || getApplyLevelLabel(best.applyLevel);
  if (user.currentLevel !== levelLabel || user.certifiedAt !== best.updatedAt) {
    store.updateProfile({
      currentLevel: levelLabel,
      certifiedAt: best.updatedAt || best.createdAt,
    });
  }
}

export function checkActivityLevelGate(user, activity) {
  const minLevel = activity.minLevelRequired;
  if (!minLevel) return { ok: true };
  syncUserLevelFromCertifications(user.phone);
  const current = store.getUser()?.currentLevel;
  if (meetsMinLevel(current, minLevel)) return { ok: true };
  return {
    ok: false,
    minLevel,
    currentLevel: current || null,
  };
}
