import { getActivityById } from '../mock.js';
import { store, getActivityStatus } from '../store.js';
import { navigate, back } from '../router.js';
import { showToast, showModal, statusBadge, escapeHtml } from '../ui.js';

export function renderMyRegistrations(container) {
  const user = store.getUser();
  if (!user) {
    navigate('#/login?redirect=' + encodeURIComponent('#/my-registrations'));
    return;
  }

  const regs = store.getRegistrations().filter(r => r.phone === user.phone);

  container.innerHTML = `
    <div class="page">
      <div class="navbar">
        <button class="navbar-back" id="nav-back">‹ 返回</button>
        <div class="navbar-title">我的报名</div>
        <div class="navbar-action"></div>
      </div>
      <div class="page-content">
        ${regs.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">📋</div>
            <div class="empty-title">暂无报名记录</div>
            <div class="empty-desc">快去发现精彩活动吧</div>
            <button class="btn btn-primary" id="go-activities">去逛逛活动</button>
          </div>
        ` : regs.map(r => registrationCard(r)).join('')}
      </div>
    </div>
  `;

  container.querySelector('#nav-back')?.addEventListener('click', () => back('#/profile'));
  container.querySelector('#go-activities')?.addEventListener('click', () => navigate('#/activities'));

  container.querySelectorAll('.reg-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.cancel-btn')) return;
      const regId = card.dataset.regId;
      const reg = store.getRegistrationById(regId);
      if (reg) showRegistrationDetail(reg);
    });
  });

  container.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const regId = btn.dataset.regId;
      const reg = store.getRegistrationById(regId);
      if (!reg) return;

      const activity = getActivityById(reg.activityId);
      const status = activity ? getActivityStatus(activity) : 'ended';
      if (status !== 'open') {
        showToast('该活动已不可取消');
        return;
      }

      const confirmed = await showModal({
        title: '取消报名',
        body: `确定要取消「${reg.activityTitle}」的报名吗？`,
        confirmText: '取消报名',
        cancelText: '再想想',
        danger: true,
      });

      if (confirmed) {
        store.removeRegistration(regId);
        const enrolled = store.getActivityEnrolled(reg.activityId, activity.enrolled);
        store.setActivityEnrolled(reg.activityId, Math.max(0, enrolled - 1));
        showToast('已取消报名');
        renderMyRegistrations(container);
      }
    });
  });
}

function registrationCard(reg) {
  const activity = getActivityById(reg.activityId);
  const status = activity ? getActivityStatus(activity) : 'ended';
  const regStatus = status === 'ended' ? 'ended' : 'registered';
  const statusMap = {
    registered: { cls: 'badge-open', text: '已报名' },
    ended: { cls: 'badge-ended', text: '活动已结束' },
  };
  const s = statusMap[regStatus];

  return `
    <div class="reg-card" data-reg-id="${reg.id}">
      <div class="reg-card-header">
        <div class="reg-card-title">${escapeHtml(reg.activityTitle)}</div>
        <span class="badge ${s.cls}">${s.text}</span>
      </div>
      <div class="reg-card-meta">${reg.activityStartTime}</div>
      <div class="reg-card-meta">报名人：${escapeHtml(reg.name)}</div>
      <div class="reg-card-id">编号：${reg.id}</div>
      ${status === 'open' ? `<button class="btn btn-outline btn-sm cancel-btn" data-reg-id="${reg.id}" style="margin-top:12px">取消报名</button>` : ''}
    </div>
  `;
}

function showRegistrationDetail(reg) {
  const overlay = document.createElement('div');
  overlay.className = 'nickname-overlay';
  const createdAt = new Date(reg.createdAt).toLocaleString('zh-CN');
  overlay.innerHTML = `
    <div class="nickname-box" style="width:300px">
      <h3>报名详情</h3>
      <div style="text-align:left;font-size:13px;line-height:2;margin:16px 0">
        <div><span class="text-secondary">活动：</span>${escapeHtml(reg.activityTitle)}</div>
        <div><span class="text-secondary">时间：</span>${reg.activityStartTime}</div>
        <div><span class="text-secondary">姓名：</span>${escapeHtml(reg.name)}</div>
        <div><span class="text-secondary">手机：</span>${store.maskPhone(reg.phone)}</div>
        ${reg.remark ? `<div><span class="text-secondary">备注：</span>${escapeHtml(reg.remark)}</div>` : ''}
        <div><span class="text-secondary">编号：</span>${reg.id}</div>
        <div><span class="text-secondary">时间：</span>${createdAt}</div>
      </div>
      <button class="btn btn-primary btn-block" id="close-detail">关闭</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#close-detail').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}
