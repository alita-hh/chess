import { store } from '../store.js';
import { navigate } from '../router.js';
import { showToast } from '../ui.js';

export function renderLogin(container, { redirect } = {}) {
  container.innerHTML = `
    <div class="page login-page">
      <div class="login-logo">
        <div class="login-logo-icon">♟️</div>
        <div class="login-logo-title">朝阳区象棋协会</div>
        <div class="login-logo-sub">手机号登录</div>
      </div>
      <form class="login-form" id="login-form">
        <div class="form-group">
          <label class="form-label">手机号</label>
          <input class="form-input" type="tel" id="phone" maxlength="11" placeholder="请输入手机号" autocomplete="tel">
          <div class="form-error hidden" id="phone-error"></div>
        </div>
        <div class="form-group">
          <label class="form-label">验证码</label>
          <div class="code-row">
            <input class="form-input" type="text" id="code" maxlength="6" placeholder="请输入验证码" autocomplete="one-time-code">
            <button type="button" class="btn btn-outline btn-sm" id="send-code" style="white-space:nowrap;flex-shrink:0">获取验证码</button>
          </div>
          <div class="form-error hidden" id="code-error"></div>
        </div>
        <button type="submit" class="btn btn-primary btn-block" style="margin-top:8px">登录</button>
        <div class="login-demo-hint">演示模式：任意 6 位验证码均可登录</div>
      </form>
    </div>
  `;

  const phoneInput = container.querySelector('#phone');
  const codeInput = container.querySelector('#code');
  const sendBtn = container.querySelector('#send-code');
  let countdown = 0;
  let countdownTimer = null;

  sendBtn.addEventListener('click', () => {
    const phone = phoneInput.value.trim();
    if (!/^1\d{10}$/.test(phone)) {
      showFieldError('phone-error', '请输入正确的11位手机号');
      return;
      }
    hideFieldError('phone-error');
    if (countdown > 0) return;
    countdown = 60;
    sendBtn.disabled = true;
    sendBtn.textContent = `${countdown}s`;
    countdownTimer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(countdownTimer);
        sendBtn.disabled = false;
        sendBtn.textContent = '获取验证码';
      } else {
        sendBtn.textContent = `${countdown}s`;
      }
    }, 1000);
    showToast('验证码已发送（演示）');
  });

  container.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = phoneInput.value.trim();
    const code = codeInput.value.trim();

    let valid = true;
    if (!/^1\d{10}$/.test(phone)) {
      showFieldError('phone-error', '请输入正确的11位手机号');
      valid = false;
    } else {
      hideFieldError('phone-error');
    }
    if (!/^\d{6}$/.test(code)) {
      showFieldError('code-error', '请输入6位验证码');
      valid = false;
    } else {
      hideFieldError('code-error');
    }
    if (!valid) return;

    const existing = store.getUser();
    if (existing && existing.phone === phone && existing.nickname) {
      store.setUser(existing);
      showToast('登录成功');
      navigate(redirect || '#/home');
      return;
    }

    showNicknameDialog(phone, redirect);
  });
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
}

function hideFieldError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

function showNicknameDialog(phone, redirect) {
  const overlay = document.createElement('div');
  overlay.className = 'nickname-overlay';
  overlay.innerHTML = `
    <div class="nickname-box">
      <h3>设置昵称</h3>
      <p>首次登录，请设置您的昵称</p>
      <div class="form-group">
        <input class="form-input" id="nickname-input" maxlength="12" placeholder="2-12个字符">
        <div class="form-error hidden" id="nickname-error"></div>
      </div>
      <button class="btn btn-primary btn-block" id="nickname-submit">完成</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('#nickname-input');
  input.focus();

  overlay.querySelector('#nickname-submit').addEventListener('click', () => {
    const nickname = input.value.trim();
    if (nickname.length < 2 || nickname.length > 12) {
      const err = overlay.querySelector('#nickname-error');
      err.textContent = '昵称需为2-12个字符';
      err.classList.remove('hidden');
      return;
    }
    store.setUser({ phone, nickname, createdAt: new Date().toISOString() });
    overlay.remove();
    showToast('登录成功');
    navigate(redirect || '#/home');
  });
}

