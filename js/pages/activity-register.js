import { getActivityById } from '../mock.js';
import { store, getActivityStatus, getEnrolledCount, getRemainingSlots } from '../store.js';
import { navigate, back } from '../router.js';
import { showToast, escapeHtml } from '../ui.js';

export function renderActivityRegister(container, { id }) {
  const activity = getActivityById(id);
  const user = store.getUser();

  if (!activity || !user) {
    navigate('#/login');
    return;
  }

  const status = getActivityStatus(activity);
  if (status !== 'open') {
    showToast('该活动暂不可报名');
    navigate('#/activity/' + id);
    return;
  }

  if (store.hasRegistered(activity.id, user.phone)) {
    showToast('您已报名该活动');
    navigate('#/activity/' + id);
    return;
  }

  container.innerHTML = `
    <div class="page has-bottom-bar">
      <div class="navbar">
        <button class="navbar-back" id="nav-back">‹ 返回</button>
        <div class="navbar-title">活动报名</div>
        <div class="navbar-action"></div>
      </div>
      <div class="page-content">
        <div class="card" style="margin-bottom:16px">
          <div class="card-body">
            <div style="font-weight:600;margin-bottom:4px">${escapeHtml(activity.title)}</div>
            <div class="text-secondary" style="font-size:13px">${activity.startTime}</div>
          </div>
        </div>
        <form id="register-form">
          <div class="form-group">
            <label class="form-label">昵称</label>
            <input class="form-input" type="text" value="${escapeHtml(user.nickname)}" readonly>
          </div>
          <div class="form-group">
            <label class="form-label">手机号</label>
            <input class="form-input" type="tel" value="${store.maskPhone(user.phone)}" readonly>
          </div>
          <div class="form-group">
            <label class="form-label">真实姓名 <span class="required">*</span></label>
            <input class="form-input" type="text" id="real-name" maxlength="20" placeholder="请输入真实姓名">
            <div class="form-error hidden" id="name-error"></div>
          </div>
          <div class="form-group">
            <label class="form-label">备注</label>
            <textarea class="form-input" id="remark" rows="3" placeholder="选填，如有特殊需求请说明" style="padding:12px;min-height:80px;resize:none"></textarea>
          </div>
        </form>
      </div>
      <div class="bottom-bar">
        <button class="btn btn-primary btn-block" id="submit-btn">提交报名</button>
      </div>
    </div>
  `;

  container.querySelector('#nav-back').addEventListener('click', () => back('#/activity/' + id));

  container.querySelector('#submit-btn').addEventListener('click', () => {
    const name = container.querySelector('#real-name').value.trim();
    const remark = container.querySelector('#remark').value.trim();
    const nameError = container.querySelector('#name-error');

    if (name.length < 2 || name.length > 20) {
      nameError.textContent = '姓名需为2-20个字符';
      nameError.classList.remove('hidden');
      container.querySelector('#real-name').classList.add('error');
      return;
    }
    nameError.classList.add('hidden');
    container.querySelector('#real-name').classList.remove('error');

    const remaining = getRemainingSlots(activity);
    if (remaining <= 0) {
      showToast('名额已满');
      navigate('#/activity/' + id);
      return;
    }

    const reg = {
      id: store.generateId(),
      activityId: activity.id,
      activityTitle: activity.title,
      activityStartTime: activity.startTime,
      userId: user.phone,
      name,
      phone: user.phone,
      nickname: user.nickname,
      remark,
      createdAt: new Date().toISOString(),
    };

    store.addRegistration(reg);
    const newEnrolled = getEnrolledCount(activity) + 1;
    store.setActivityEnrolled(activity.id, newEnrolled);

    navigate('#/activity/' + id + '/success?regId=' + reg.id);
  });
}
