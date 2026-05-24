import { aboutInfo } from '../mock.js';
import { back } from '../router.js';
import { showToast, escapeHtml } from '../ui.js';

export function renderAbout(container) {
  const { title, intro, heroImage, contact } = aboutInfo;

  container.innerHTML = `
    <div class="page">
      <div class="navbar">
        <button class="navbar-back" id="nav-back">‹ 返回</button>
        <div class="navbar-title">关于协会</div>
        <div class="navbar-action"></div>
      </div>
      <img class="about-hero" src="${heroImage}" alt="${escapeHtml(title)}">
      <div class="page-content">
        <div class="about-section">
          <h3>${escapeHtml(title)}</h3>
          ${intro.split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('')}
        </div>
        <div class="about-section" id="contact">
          <h3>联系我们</h3>
          <div class="contact-item">
            <span class="contact-icon">📍</span>
            <span class="clickable" id="contact-address">${escapeHtml(contact.address)}</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">📞</span>
            <span class="clickable" id="contact-phone">${contact.phone}</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">✉️</span>
            <span>${contact.email}</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">🕐</span>
            <span>${contact.hours}</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">💬</span>
            <span>微信公众号：${contact.wechat}</span>
          </div>
          <div class="qrcode-placeholder">公众号二维码</div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#nav-back').addEventListener('click', () => back('#/home'));

  container.querySelector('#contact-phone').addEventListener('click', () => {
    showToast('拨打电话：' + contact.phone);
  });

  container.querySelector('#contact-address').addEventListener('click', () => {
    navigator.clipboard?.writeText(contact.address).then(() => {
      showToast('地址已复制');
    }).catch(() => showToast(contact.address));
  });

  if (window.location.hash.includes('contact')) {
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}
