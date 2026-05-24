import { getActivityById } from '../mock.js';
import { store } from '../store.js';
import { navigate } from '../router.js';
import { escapeHtml } from '../ui.js';

export function renderActivitySuccess(container, { id, regId }) {
  const activity = getActivityById(id);
  const reg = store.getRegistrationById(regId);

  if (!activity || !reg) {
    container.innerHTML = `<div class="page"><div class="empty-state"><div class="empty-title">报名信息不存在</div></div></div>`;
    return;
  }

  const createdAt = new Date(reg.createdAt).toLocaleString('zh-CN');

  container.innerHTML = `
    <div class="page">
      <div class="success-page">
        <div class="success-icon">✓</div>
        <div class="success-title">报名成功</div>
        <div class="success-desc">您已成功报名以下活动</div>
        <div class="success-info">
          <div class="success-info-row">
            <span class="text-secondary">活动名称</span>
            <span>${escapeHtml(activity.title)}</span>
          </div>
          <div class="success-info-row">
            <span class="text-secondary">活动时间</span>
            <span>${activity.startTime}</span>
          </div>
          <div class="success-info-row">
            <span class="text-secondary">报名人</span>
            <span>${escapeHtml(reg.name)}</span>
          </div>
          <div class="success-info-row">
            <span class="text-secondary">报名时间</span>
            <span>${createdAt}</span>
          </div>
          <div class="success-info-row">
            <span class="text-secondary">报名编号</span>
            <span style="font-family:monospace">${reg.id}</span>
          </div>
        </div>
        <div class="success-actions">
          <button class="btn btn-primary btn-block" id="view-regs">查看我的报名</button>
          <button class="btn btn-outline btn-block" id="go-home">返回首页</button>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#view-regs').addEventListener('click', () => {
    navigate('#/my-registrations');
  });

  container.querySelector('#go-home').addEventListener('click', () => {
    navigate('#/home');
  });
}
