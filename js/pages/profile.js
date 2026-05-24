import { store } from '../store.js';
import { navigate } from '../router.js';
import { showToast, showModal } from '../ui.js';

export function renderProfile(container) {
  const user = store.getUser();
  if (!user) {
    navigate('#/login?redirect=' + encodeURIComponent('#/profile'));
    return;
  }

  const initial = user.nickname.charAt(0);

  container.innerHTML = `
    <div class="page has-tabbar">
      <div class="profile-header">
        <div class="profile-avatar">${initial}</div>
        <div>
          <div class="profile-name">${user.nickname}</div>
          <div class="profile-phone">${store.maskPhone(user.phone)}</div>
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

  container.querySelector('#menu-regs').addEventListener('click', () => navigate('#/my-registrations'));
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
