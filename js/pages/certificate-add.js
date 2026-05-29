import { store } from '../store.js';
import { navigate, back } from '../router.js';
import { showToast, showModal, escapeHtml } from '../ui.js';
import { CHESS_TYPES, CERT_LEVELS } from '../constants.js';

export function renderCertificateAdd(container) {
  const user = store.getUser();
  if (!user) {
    navigate('#/login?redirect=' + encodeURIComponent('#/certificate/add'));
    return;
  }

  const editId = new URLSearchParams(window.location.hash.split('?')[1] || '').get('editId');
  const existing = editId ? store.getCertificateById(editId) : null;

  if (existing && existing.phone !== user.phone) {
    navigate('#/my-certificates');
    return;
  }

  if (existing && existing.reviewStatus !== 'rejected') {
    showToast('当前状态不可编辑');
    navigate('#/certificate/' + editId);
    return;
  }

  if (!store.isProfileComplete(user)) {
    showModal({
      title: '请先完善个人信息',
      body: '提交证书前需填写姓名、性别、证件信息、出生日期并上传免冠照。',
      confirmText: '去完善',
      cancelText: '稍后',
    }).then(ok => {
      if (ok) navigate('#/personal-info');
      else navigate('#/profile');
    });
    container.innerHTML = `<div class="page"><div class="empty-state"><div class="empty-title">请先完善个人信息</div></div></div>`;
    return;
  }

  const chessType = existing?.chessType || '';
  const levels = chessType ? (CERT_LEVELS[chessType] || []) : [];
  const photoHtml = existing?.certPhoto
    ? `<img src="${existing.certPhoto}" alt="证书照片" class="photo-preview-img">`
    : `<div class="photo-preview-placeholder">📷<span>上传证书照片</span></div>`;

  container.innerHTML = `
    <div class="page has-bottom-bar">
      <div class="navbar">
        <button class="navbar-back" id="nav-back">‹ 返回</button>
        <div class="navbar-title">${existing ? '重新提交证书' : '添加证书'}</div>
        <div class="navbar-action"></div>
      </div>
      <div class="page-content">
        <form id="cert-form">
          <div class="form-group">
            <label class="form-label">棋类类型 <span class="required">*</span></label>
            <select class="form-input" id="chess-type">
              <option value="">请选择</option>
              ${CHESS_TYPES.map(t => `<option value="${t.value}"${t.value === chessType ? ' selected' : ''}>${escapeHtml(t.label)}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">证书级别 <span class="required">*</span></label>
            <select class="form-input" id="cert-level" ${!chessType ? 'disabled' : ''}>
              <option value="">${chessType ? '请选择' : '请先选择棋类类型'}</option>
              ${levels.map(l => `<option value="${escapeHtml(l)}"${l === existing?.certLevel ? ' selected' : ''}>${escapeHtml(l)}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">证书编号 <span class="required">*</span></label>
            <input class="form-input" type="text" id="cert-no" maxlength="30" placeholder="请输入证书编号" value="${escapeHtml(existing?.certNo || '')}">
            <div class="form-error hidden" id="cert-no-error"></div>
          </div>

          <div class="form-group">
            <label class="form-label">赛事名称 <span class="required">*</span></label>
            <input class="form-input" type="text" id="event-name" maxlength="50" placeholder="请输入赛事名称" value="${escapeHtml(existing?.eventName || '')}">
            <div class="form-error hidden" id="event-error"></div>
          </div>

          <div class="photo-upload-block">
            <label class="form-label">证书照片 <span class="required">*</span></label>
            <label class="photo-upload-label" for="cert-photo">
              <div class="photo-preview cert-photo-preview" id="cert-preview">${photoHtml}</div>
              <span class="form-hint">点击上传证书原件或扫描件（JPG/PNG，≤5MB）</span>
            </label>
            <input type="file" id="cert-photo" accept="image/*" hidden>
          </div>
        </form>
      </div>
      <div class="bottom-bar">
        <button class="btn btn-primary btn-block" id="submit-btn">提交审核</button>
      </div>
    </div>
  `;

  let certPhoto = existing?.certPhoto || '';

  container.querySelector('#nav-back').addEventListener('click', () => back('#/my-certificates'));

  container.querySelector('#chess-type').addEventListener('change', (e) => {
    const type = e.target.value;
    const levelSelect = container.querySelector('#cert-level');
    const levelList = CERT_LEVELS[type] || [];
    levelSelect.disabled = !type;
    levelSelect.innerHTML = `
      <option value="">${type ? '请选择' : '请先选择棋类类型'}</option>
      ${levelList.map(l => `<option value="${escapeHtml(l)}">${escapeHtml(l)}</option>`).join('')}
    `;
  });

  container.querySelector('#cert-photo').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      certPhoto = await store.readImageFile(file);
      container.querySelector('#cert-preview').innerHTML =
        `<img src="${certPhoto}" alt="证书照片" class="photo-preview-img">`;
    } catch (err) {
      showToast(err.message);
    }
  });

  container.querySelector('#submit-btn').addEventListener('click', () => {
    const chessTypeVal = container.querySelector('#chess-type').value;
    const certLevel = container.querySelector('#cert-level').value;
    const certNo = container.querySelector('#cert-no').value.trim();
    const eventName = container.querySelector('#event-name').value.trim();
    let valid = true;

    if (!chessTypeVal || !certLevel) {
      showToast('请选择棋类类型和证书级别');
      valid = false;
    }

    if (!certNo) {
      container.querySelector('#cert-no-error').textContent = '请输入证书编号';
      container.querySelector('#cert-no-error').classList.remove('hidden');
      valid = false;
    } else {
      container.querySelector('#cert-no-error').classList.add('hidden');
    }

    if (eventName.length < 2) {
      container.querySelector('#event-error').textContent = '赛事名称需至少2个字符';
      container.querySelector('#event-error').classList.remove('hidden');
      valid = false;
    } else {
      container.querySelector('#event-error').classList.add('hidden');
    }

    if (!certPhoto) {
      showToast('请上传证书照片');
      valid = false;
    }

    if (!valid) return;

    const dup = store.getCertificatesByUser(user.phone).some(c =>
      c.certNo === certNo &&
      c.chessType === chessTypeVal &&
      c.id !== editId &&
      c.reviewStatus !== 'rejected'
    );
    if (dup) {
      showToast('该棋类下已有相同编号的证书');
      return;
    }

    const now = new Date().toISOString();

    if (existing) {
      store.updateCertificate(existing.id, {
        chessType: chessTypeVal,
        certLevel,
        certNo,
        eventName,
        certPhoto,
        reviewStatus: 'pending_first',
        rejectReason: '',
        reviewedAt: null,
        submittedAt: now,
      });
      showToast('已重新提交，等待审核');
      navigate('#/certificate/' + existing.id);
    } else {
      const cert = {
        id: store.generateCertId(),
        phone: user.phone,
        chessType: chessTypeVal,
        certLevel,
        certNo,
        eventName,
        certPhoto,
        reviewStatus: 'pending_first',
        rejectReason: '',
        submittedAt: now,
        reviewedAt: null,
      };
      store.addCertificate(cert);
      showToast('提交成功，等待初审');
      navigate('#/certificate/' + cert.id);
    }
  });
}
