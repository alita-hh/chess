import { store } from '../store.js';
import { navigate, back } from '../router.js';
import { showToast, escapeHtml } from '../ui.js';
import { ID_TYPES, GENDERS, GRADES } from '../constants.js';

function selectOptions(items, selected) {
  return items.map(item => {
    const val = item.value ?? item;
    const label = item.label ?? item;
    return `<option value="${val}"${val === selected ? ' selected' : ''}>${escapeHtml(label)}</option>`;
  }).join('');
}

export function renderPersonalInfo(container) {
  const user = store.getUser();
  if (!user) {
    navigate('#/login?redirect=' + encodeURIComponent('#/personal-info'));
    return;
  }

  const age = store.calcAge(user.birthDate);
  const avatarHtml = user.avatarPhoto
    ? `<img src="${user.avatarPhoto}" alt="免冠照" class="photo-preview-img">`
    : `<div class="photo-preview-placeholder">📷<span>上传免冠照</span></div>`;

  container.innerHTML = `
    <div class="page has-bottom-bar">
      <div class="navbar">
        <button class="navbar-back" id="nav-back">‹ 返回</button>
        <div class="navbar-title">个人信息</div>
        <div class="navbar-action"></div>
      </div>
      <div class="page-content">
        <form id="profile-form">
          <div class="photo-upload-block">
            <label class="photo-upload-label" for="avatar-photo">
              <div class="photo-preview" id="avatar-preview">${avatarHtml}</div>
              <span class="form-hint">点击上传免冠照（JPG/PNG，≤5MB）</span>
            </label>
            <input type="file" id="avatar-photo" accept="image/*" hidden>
          </div>

          <div class="form-group">
            <label class="form-label">姓名 <span class="required">*</span></label>
            <input class="form-input" type="text" id="real-name" maxlength="20" placeholder="请输入真实姓名" value="${escapeHtml(user.realName || '')}">
            <div class="form-error hidden" id="name-error"></div>
          </div>

          <div class="form-group">
            <label class="form-label">性别 <span class="required">*</span></label>
            <select class="form-input" id="gender">
              <option value="">请选择</option>
              ${selectOptions(GENDERS, user.gender || '')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">证件类型 <span class="required">*</span></label>
            <select class="form-input" id="id-type">
              <option value="">请选择</option>
              ${selectOptions(ID_TYPES, user.idType || '')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">证件号码 <span class="required">*</span></label>
            <input class="form-input" type="text" id="id-number" maxlength="30" placeholder="请输入证件号码" value="${escapeHtml(user.idNumber || '')}">
            <div class="form-error hidden" id="id-error"></div>
          </div>

          <div class="form-group">
            <label class="form-label">出生日期 <span class="required">*</span></label>
            <input class="form-input" type="date" id="birth-date" value="${user.birthDate || ''}">
          </div>

          <div class="form-group">
            <label class="form-label">年龄</label>
            <input class="form-input" type="text" id="age-display" readonly value="${age != null ? age + ' 岁' : '—'}">
          </div>

          <div class="form-group">
            <label class="form-label">联系方式</label>
            <input class="form-input" type="tel" readonly value="${store.maskPhone(user.phone)}">
          </div>

          <div class="form-group">
            <label class="form-label">微信号</label>
            <input class="form-input" type="text" id="wechat-id" maxlength="30" placeholder="选填" value="${escapeHtml(user.wechatId || '')}">
          </div>

          <div class="form-group">
            <label class="form-label">学校</label>
            <input class="form-input" type="text" id="school" maxlength="50" placeholder="选填" value="${escapeHtml(user.school || '')}">
          </div>

          <div class="form-group">
            <label class="form-label">年级</label>
            <select class="form-input" id="grade">
              <option value="">请选择</option>
              ${GRADES.map(g => `<option value="${escapeHtml(g)}"${g === user.grade ? ' selected' : ''}>${escapeHtml(g)}</option>`).join('')}
            </select>
          </div>
        </form>
      </div>
      <div class="bottom-bar">
        <button class="btn btn-primary btn-block" id="save-btn">保存</button>
      </div>
    </div>
  `;

  let avatarPhoto = user.avatarPhoto || '';

  container.querySelector('#nav-back').addEventListener('click', () => back('#/profile'));

  container.querySelector('#birth-date').addEventListener('change', (e) => {
    const ageVal = store.calcAge(e.target.value);
    container.querySelector('#age-display').value = ageVal != null ? ageVal + ' 岁' : '—';
  });

  container.querySelector('#avatar-photo').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      avatarPhoto = await store.readImageFile(file);
      container.querySelector('#avatar-preview').innerHTML =
        `<img src="${avatarPhoto}" alt="免冠照" class="photo-preview-img">`;
    } catch (err) {
      showToast(err.message);
    }
  });

  container.querySelector('#save-btn').addEventListener('click', () => {
    const realName = container.querySelector('#real-name').value.trim();
    const gender = container.querySelector('#gender').value;
    const idType = container.querySelector('#id-type').value;
    const idNumber = container.querySelector('#id-number').value.trim();
    const birthDate = container.querySelector('#birth-date').value;
    const nameError = container.querySelector('#name-error');
    const idError = container.querySelector('#id-error');
    let valid = true;

    if (realName.length < 2 || realName.length > 20) {
      nameError.textContent = '姓名需为2-20个字符';
      nameError.classList.remove('hidden');
      valid = false;
    } else {
      nameError.classList.add('hidden');
    }

    if (!idNumber) {
      idError.textContent = '请输入证件号码';
      idError.classList.remove('hidden');
      valid = false;
    } else {
      idError.classList.add('hidden');
    }

    if (!gender || !idType || !birthDate) {
      showToast('请完善必填项');
      valid = false;
    }

    if (!avatarPhoto) {
      showToast('请上传免冠照');
      valid = false;
    }

    if (!valid) return;

    store.updateProfile({
      realName,
      gender,
      idType,
      idNumber,
      birthDate,
      wechatId: container.querySelector('#wechat-id').value.trim(),
      school: container.querySelector('#school').value.trim(),
      grade: container.querySelector('#grade').value,
      avatarPhoto,
    });

    showToast('保存成功');
    navigate('#/profile');
  });
}
