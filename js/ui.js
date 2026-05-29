export function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

export function showModal({ title, body, confirmText = '确定', cancelText = '取消', danger = false }) {
  return new Promise(resolve => {
    const root = document.getElementById('modal-root');
    root.hidden = false;
    root.innerHTML = `
      <div class="modal-box">
        <div class="modal-title">${title}</div>
        <div class="modal-body">${body}</div>
        <div class="modal-actions">
          <button class="modal-btn" data-action="cancel">${cancelText}</button>
          <button class="modal-btn ${danger ? 'modal-btn-danger' : 'modal-btn-primary'}" data-action="confirm">${confirmText}</button>
        </div>
      </div>
    `;

    const close = (result) => {
      root.hidden = true;
      root.innerHTML = '';
      resolve(result);
    };

    root.querySelector('[data-action="cancel"]').addEventListener('click', () => close(false));
    root.querySelector('[data-action="confirm"]').addEventListener('click', () => close(true));
    root.addEventListener('click', (e) => {
      if (e.target === root) close(false);
    }, { once: true });
  });
}

export function certReviewBadge(status) {
  const map = {
    pending_first: { cls: 'badge-pending', text: '待初审' },
    pending_second: { cls: 'badge-review', text: '待复审' },
    approved: { cls: 'badge-open', text: '审核通过' },
    rejected: { cls: 'badge-rejected', text: '审核驳回' },
  };
  const s = map[status] || map.pending_first;
  return `<span class="badge ${s.cls}">${s.text}</span>`;
}

export function statusBadge(status) {
  const map = {
    open: { cls: 'badge-open', text: '报名中' },
    full: { cls: 'badge-full', text: '已满员' },
    ended: { cls: 'badge-ended', text: '已结束' },
  };
  const s = map[status] || map.ended;
  return `<span class="badge ${s.cls}">${s.text}</span>`;
}

export function formatFee(fee) {
  return fee === 0 ? '<span class="fee-free">免费</span>' : `<span class="fee-tag">¥${fee}</span>`;
}

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function renderParagraphs(text) {
  return text.split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('');
}

export function initBanner(container) {
  const track = container.querySelector('.banner-track');
  const dots = container.querySelectorAll('.banner-dot');
  const slides = container.querySelectorAll('.banner-slide');
  if (!track || slides.length === 0) return;

  let current = 0;
  let timer = null;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    timer = setInterval(() => goTo(current + 1), 4000);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(i);
      startAuto();
    });
  });

  let startX = 0;
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) {
      goTo(diff > 0 ? current - 1 : current + 1);
    }
    startAuto();
  }, { passive: true });

  startAuto();
}
