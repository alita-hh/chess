import { store } from '../store.js';
import { navigate, back } from '../router.js';
import { showToast, escapeHtml } from '../ui.js';
import { XQ_CERT_LEVELS } from '../constants.js';
import { isValidIdCard, CERT_BACKEND_STATUS } from '../certification.js';

const MAX_IMAGES = 3;

export function renderCertificationApply(container) {
  const user = store.getUser();
  if (!user) {
    navigate('#/login?redirect=' + encodeURIComponent('#/certification/apply'));
    return;
  }

  if (store.hasPendingCertification(user.phone)) {
    container.innerHTML = `
      <div class="page">
        <div class="navbar">
          <button class="navbar-back" id="nav-back">‹ 返回</button>
          <div class="navbar-title">提交认证申请</div>
          <div class="navbar-action"></div>
        </div>
        <div class="page-content">
          <div class="empty-state">
            <div class="empty-icon">⏳</div>
            <div class="empty-title">您有一条申请正在审核中</div>
            <div class="empty-desc">请勿重复提交，可在认证中心查看进度</div>
            <button class="btn btn-primary" id="go-index">返回认证中心</button>
          </div>
        </div>
      </div>
    `;
    container.querySelector('#nav-back').addEventListener('click', () => back('#/certification/index'));
    container.querySelector('#go-index').addEventListener('click', () => navigate('#/certification/index'));
    return;
  }

  const defaultId = user.idType === 'id_card' ? (user.idNumber || '') : '';
  let certImages = [];
  let paperRequired = false;

  container.innerHTML = `
    <div class="page has-bottom-bar">
      <div class="navbar">
        <button class="navbar-back" id="nav-back">‹ 返回</button>
        <div class="navbar-title">提交认证申请</div>
        <div class="navbar-action"></div>
      </div>
      <div class="page-content">
        <form id="cert-apply-form">
          <div class="form-group">
            <label class="form-label">真实姓名 <span class="required">*</span></label>
            <input class="form-input" type="text" id="real-name" maxlength="20" value="${escapeHtml(user.realName || '')}" placeholder="请输入真实姓名">
            <div class="form-error hidden" id="name-error"></div>
          </div>
          <div class="form-group">
            <label class="form-label">身份证号 <span class="required">*</span></label>
            <input class="form-input" type="text" id="id-card" maxlength="18" value="${escapeHtml(defaultId)}" placeholder="18位身份证号码">
            <div class="form-error hidden" id="id-error"></div>
          </div>
          <div class="form-group">
            <label class="form-label">申请级别 <span class="required">*</span></label>
            <select class="form-input" id="apply-level">
              <option value="">请选择申请级别</option>
              ${XQ_CERT_LEVELS.map(l => `<option value="${l.value}">${escapeHtml(l.label)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">等级证明材料 <span class="required">*</span></label>
            <div class="cert-images-grid" id="images-grid">
              <label class="cert-image-slot" for="cert-images-input">
                <span class="cert-image-add">+</span>
                <span class="form-hint">JPG/PNG，≤5MB，最多${MAX_IMAGES}张</span>
              </label>
            </div>
            <input type="file" id="cert-images-input" accept="image/jpeg,image/png,image/*" multiple hidden>
          </div>
          <div class="form-group form-switch-row">
            <label class="form-label" style="margin:0">申请纸质证书</label>
            <label class="form-switch">
              <input type="checkbox" id="paper-cert">
              <span class="form-switch-slider"></span>
            </label>
          </div>
          <div id="mailing-section" class="hidden">
            <div class="form-group">
              <label class="form-label">省 <span class="required">*</span></label>
              <input class="form-input" type="text" id="addr-province" placeholder="如：北京市">
            </div>
            <div class="form-group">
              <label class="form-label">市 <span class="required">*</span></label>
              <input class="form-input" type="text" id="addr-city" placeholder="如：北京市">
            </div>
            <div class="form-group">
              <label class="form-label">区 <span class="required">*</span></label>
              <input class="form-input" type="text" id="addr-district" placeholder="如：朝阳区">
            </div>
            <div class="form-group">
              <label class="form-label">详细地址 <span class="required">*</span></label>
              <input class="form-input" type="text" id="addr-detail" placeholder="街道、门牌号等">
              <div class="form-error hidden" id="addr-error"></div>
            </div>
          </div>
        </form>
      </div>
      <div class="bottom-bar">
        <button class="btn btn-primary btn-block" id="submit-btn">提交申请</button>
      </div>
    </div>
  `;

  const mailingSection = container.querySelector('#mailing-section');
  const imagesGrid = container.querySelector('#images-grid');

  container.querySelector('#nav-back').addEventListener('click', () => back('#/certification/index'));

  container.querySelector('#paper-cert').addEventListener('change', (e) => {
    paperRequired = e.target.checked;
    mailingSection.classList.toggle('hidden', !paperRequired);
  });

  container.querySelector('#cert-images-input').addEventListener('change', async (e) => {
    const files = [...e.target.files];
    e.target.value = '';
    for (const file of files) {
      if (certImages.length >= MAX_IMAGES) {
        showToast(`最多上传 ${MAX_IMAGES} 张图片`);
        break;
      }
      try {
        const dataUrl = await store.readImageFile(file);
        certImages.push(dataUrl);
      } catch (err) {
        showToast(err.message);
      }
    }
    renderImageSlots();
  });

  function renderImageSlots() {
    const slots = certImages.map((src, i) => `
      <div class="cert-image-slot cert-image-slot--filled">
        <img src="${src}" alt="">
        <button type="button" class="cert-image-remove" data-idx="${i}" aria-label="删除">×</button>
      </div>
    `).join('');
    const addSlot = certImages.length < MAX_IMAGES ? `
      <label class="cert-image-slot" for="cert-images-input">
        <span class="cert-image-add">+</span>
      </label>
    ` : '';
    imagesGrid.innerHTML = slots + addSlot;
    imagesGrid.querySelectorAll('.cert-image-remove').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        certImages.splice(Number(btn.dataset.idx), 1);
        renderImageSlots();
      });
    });
  }

  container.querySelector('#submit-btn').addEventListener('click', () => {
    const realName = container.querySelector('#real-name').value.trim();
    const idCard = container.querySelector('#id-card').value.trim();
    const applyLevel = container.querySelector('#apply-level').value;
    let valid = true;

    if (realName.length < 2) {
      showField(container, 'name-error', '请输入真实姓名');
      valid = false;
    } else hideField(container, 'name-error');

    if (!isValidIdCard(idCard)) {
      showField(container, 'id-error', '请输入正确的18位身份证号');
      valid = false;
    } else hideField(container, 'id-error');

    if (!applyLevel) {
      showToast('请选择申请级别');
      valid = false;
    }

    if (certImages.length === 0) {
      showToast('请上传等级证明材料');
      valid = false;
    }

    let mailingAddress = '';
    if (paperRequired) {
      const province = container.querySelector('#addr-province').value.trim();
      const city = container.querySelector('#addr-city').value.trim();
      const district = container.querySelector('#addr-district').value.trim();
      const detail = container.querySelector('#addr-detail').value.trim();
      if (!province || !city || !district || !detail) {
        showField(container, 'addr-error', '请填写完整邮寄地址');
        valid = false;
      } else {
        hideField(container, 'addr-error');
        mailingAddress = `${province}${city}${district}${detail}`;
      }
    }

    if (!valid) return;

    if (store.hasPendingCertification(user.phone)) {
      showToast('您有一条申请正在审核中，请勿重复提交');
      return;
    }

    const levelLabel = XQ_CERT_LEVELS.find(l => l.value === applyLevel)?.label || applyLevel;
    const now = new Date().toISOString();
    const record = {
      id: store.generateCertificationId(),
      userId: user.phone,
      applyLevel,
      applyLevelLabel: levelLabel,
      idCard,
      realName,
      certImages: [...certImages],
      isPaperCertRequired: paperRequired,
      mailingAddress: paperRequired ? mailingAddress : '',
      reviewMode: 2,
      status: CERT_BACKEND_STATUS.PENDING_FIRST,
      rejectReason: '',
      trackingNumber: '',
      createdAt: now,
      updatedAt: now,
    };

    store.addCertification(record);
    if (realName !== user.realName) {
      store.updateProfile({ realName });
    }
    showToast('提交成功');
    navigate('#/certification/detail/' + record.id);
  });
}

function showField(container, id, msg) {
  const el = container.querySelector('#' + id);
  if (el) {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
}

function hideField(container, id) {
  const el = container.querySelector('#' + id);
  if (el) el.classList.add('hidden');
}
