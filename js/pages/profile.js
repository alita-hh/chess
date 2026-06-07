import { store } from '../store.js';
import { navigate } from '../router.js';
import { showToast, showModal, escapeHtml } from '../ui.js';

export function renderProfile(container) {
  const user = store.getUser();
  if (!user) {
    navigate('#/login?redirect=' + encodeURIComponent('#/profile'));
    return;
  }

  const initial = user.nickname.charAt(0);
  const avatarHtml = user.avatarPhoto
    ? `<img src="${user.avatarPhoto}" alt="" class="profile-avatar-img">`
    : initial;
  const profileComplete = store.isProfileComplete(user);

  container.innerHTML = `
    <div class="page has-tabbar">
      <div class="profile-header">
        <div class="profile-avatar">${avatarHtml}</div>
        <div class="profile-header-info">
          <div class="profile-name">${escapeHtml(user.nickname)}</div>
          <div class="profile-phone">${store.maskPhone(user.phone)}</div>
          ${user.realName ? `<div class="profile-real-name">${escapeHtml(user.realName)}</div>` : ''}
          ${user.currentLevel ? `<div class="profile-level">🎯 ${escapeHtml(user.currentLevel)}</div>` : ''}
          <button class="profile-edit-link" id="edit-profile">${profileComplete ? '编辑资料 ›' : '完善个人信息 ›'}</button>
        </div>
      </div>
      <div class="page-content">
        <div class="menu-list">
          <div class="menu-item" id="menu-regs">
            <div class="menu-item-left">
              <span class="menu-item-icon">📋</span>
              <span class="menu-item-label">我的报名</span>
            </div>
            <span class="menu-item-arrow">›</span>
          </div>
          <div class="menu-item" id="menu-certification">
            <div class="menu-item-left">
              <span class="menu-item-icon">🎯</span>
              <span class="menu-item-label">等级认证</span>
            </div>
            <span class="menu-item-arrow">›</span>
          </div>
          <div class="menu-item" id="menu-certs">
            <div class="menu-item-left">
              <span class="menu-item-icon">🏅</span>
              <span class="menu-item-label">我的证书</span>
            </div>
            <span class="menu-item-arrow">›</span>
          </div>
          <div class="menu-item" id="menu-about">
            <div class="menu-item-left">
              <span class="menu-item-icon">ℹ️</span>
              <span class="menu-item-label">关于协会</span>
            </div>
            <span class="menu-item-arrow">›</span>
          </div>
          <div class="menu-item menu-item-danger" id="menu-logout">
            <div class="menu-item-left">
              <span class="menu-item-icon">🚪</span>
              <span class="menu-item-label">退出登录</span>
            </div>
            <span class="menu-item-arrow">›</span>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#edit-profile').addEventListener('click', () => navigate('#/personal-info'));
  container.querySelector('#menu-regs').addEventListener('click', () => navigate('#/my-registrations'));
  container.querySelector('#menu-certification').addEventListener('click', () => navigate('#/certification/index'));
  container.querySelector('#menu-certs').addEventListener('click', () => navigate('#/my-certificates'));
  container.querySelector('#menu-about').addEventListener('click', () => navigate('#/about'));

  container.querySelector('#menu-logout').addEventListener('click', async () => {
    const confirmed = await showModal({
      title: '退出登录',
      body: '确定要退出当前账号吗？',
      confirmText: '退出',
      cancelText: '取消',
      danger: true,
    });
    if (confirmed) {
      store.clearUser();
      showToast('已退出登录');
      navigate('#/home');
    }
  });
}
