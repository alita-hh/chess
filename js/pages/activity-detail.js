import { getActivityById } from '../mock.js';
import { getActivityStatus, getEnrolledCount, getRemainingSlots, store } from '../store.js';
import { navigate, back } from '../router.js';
import { showToast, showModal, statusBadge, renderParagraphs, escapeHtml } from '../ui.js';
import { checkActivityLevelGate } from '../certification.js';

function renderGroupList(groupList) {
  if (!groupList || groupList.length === 0) {
    return '<p class="text-secondary">分组名单暂未公布，请持续关注。</p>';
  }
  return groupList.map(g => `
    <div class="group-block">
      <div class="group-name">${escapeHtml(g.name)}</div>
      <div class="group-members">${g.members.map(m => `<span class="group-member">${escapeHtml(m)}</span>`).join('')}</div>
    </div>
  `).join('');
}

export function renderActivityDetail(container, { id }) {
  const activity = getActivityById(id);
  if (!activity) {
    container.innerHTML = `<div class="page"><div class="empty-state"><div class="empty-title">活动不存在</div></div></div>`;
    return;
  }

  const status = getActivityStatus(activity);
  const enrolled = getEnrolledCount(activity);
  const remaining = getRemainingSlots(activity);
  const user = store.getUser();
  const alreadyRegistered = user && store.hasRegistered(activity.id, user.phone);

  let ctaText = '立即报名';
  let ctaDisabled = false;
  if (status === 'ended') {
    ctaText = '活动已结束';
    ctaDisabled = true;
  } else if (status === 'full') {
    ctaText = '已满员';
    ctaDisabled = true;
  } else if (alreadyRegistered) {
    ctaText = '已报名';
    ctaDisabled = true;
  }

  container.innerHTML = `
    <div class="page has-bottom-bar">
      <div class="navbar">
        <button class="navbar-back" id="nav-back">‹ 返回</button>
        <div class="navbar-title">活动详情</div>
        <div class="navbar-action"></div>
      </div>
      <img class="detail-hero" src="${activity.cover}" alt="">
      <div class="detail-header">
        <div class="detail-title">${escapeHtml(activity.title)}</div>
        ${statusBadge(status)}
      </div>
      <div class="page-content" style="padding-top:0">
        <div class="detail-info-list">
          <div class="detail-info-item">
            <span class="detail-info-label">活动时间</span>
            <span class="detail-info-value">${activity.startTime} - ${activity.endTime.split(' ')[1]}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">报名时间</span>
            <span class="detail-info-value">即日起至 ${activity.registerDeadline || '活动开始前'}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">活动地点</span>
            <span class="detail-info-value">${escapeHtml(activity.location)}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">详细地址</span>
            <span class="detail-info-value clickable" id="copy-address">${escapeHtml(activity.address)} 📋</span>
          </div>
          ${activity.minLevelRequired ? `
          <div class="detail-info-item">
            <span class="detail-info-label">棋力要求</span>
            <span class="detail-info-value">${escapeHtml(activity.minLevelRequired)} 及以上</span>
          </div>
          ` : ''}
          <div class="detail-info-item">
            <span class="detail-info-label">报名费用</span>
            <span class="detail-info-value">${activity.fee === 0 ? '免费' : '¥' + activity.fee}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">人数限制</span>
            <span class="detail-info-value">${activity.capacity} 人（已报 ${enrolled}，剩余 ${remaining}）</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-info-label">主办方</span>
            <span class="detail-info-value">${escapeHtml(activity.organizer)}</span>
          </div>
        </div>

        <div class="detail-sections">
          <div class="detail-section-tabs">
            <button class="detail-section-tab active" data-section="rules">参赛规章</button>
            <button class="detail-section-tab" data-section="supplementary">补充规定</button>
            <button class="detail-section-tab" data-section="groups">分组名单</button>
          </div>
          <div class="detail-section-panel active" data-panel="rules">
            ${renderParagraphs(activity.rules || '暂无参赛规章')}
          </div>
          <div class="detail-section-panel" data-panel="supplementary">
            ${renderParagraphs(activity.supplementaryRules || '暂无补充规定')}
          </div>
          <div class="detail-section-panel" data-panel="groups">
            ${renderGroupList(activity.groupList)}
          </div>
        </div>
      </div>
      <div class="bottom-bar">
        <button class="btn btn-primary btn-block" id="register-btn" ${ctaDisabled ? 'disabled' : ''}>${ctaText}</button>
      </div>
    </div>
  `;

  container.querySelector('#nav-back').addEventListener('click', () => back('#/activities'));

  container.querySelector('#copy-address').addEventListener('click', () => {
    navigator.clipboard?.writeText(activity.address).then(() => {
      showToast('地址已复制');
    }).catch(() => {
      showToast(activity.address);
    });
  });

  container.querySelectorAll('.detail-section-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const section = tab.dataset.section;
      container.querySelectorAll('.detail-section-tab').forEach(t => t.classList.toggle('active', t === tab));
      container.querySelectorAll('.detail-section-panel').forEach(p => {
        p.classList.toggle('active', p.dataset.panel === section);
      });
    });
  });

  const registerBtn = container.querySelector('#register-btn');
  if (!ctaDisabled) {
    registerBtn.addEventListener('click', async () => {
      if (!store.isLoggedIn()) {
        navigate('#/login?redirect=' + encodeURIComponent('#/activity/' + id + '/register'));
        return;
      }
      const gate = checkActivityLevelGate(store.getUser(), activity);
      if (!gate.ok) {
        const body = gate.currentLevel
          ? `本活动要求 <strong>${escapeHtml(activity.minLevelRequired)}</strong> 及以上等级，您当前为 <strong>${escapeHtml(gate.currentLevel)}</strong>，请先完成等级认证。`
          : `本活动要求 <strong>${escapeHtml(activity.minLevelRequired)}</strong> 及以上等级，您尚未完成等级认证。`;
        const go = await showModal({
          title: '等级未达标',
          body,
          confirmText: '去认证',
          cancelText: '取消',
        });
        if (go) navigate('#/certification/index');
        return;
      }
      navigate('#/activity/' + id + '/register');
    });
  }
}
