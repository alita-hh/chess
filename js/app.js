import {
  registerRoute, matchRoute, initRouter, navigate,
  getTabFromRoute, isTabRoute, shouldHideTabbar, requiresAuth
} from './router.js';
import { store } from './store.js';
import { renderLogin } from './pages/login.js';
import { renderHome } from './pages/home.js';
import { renderActivities } from './pages/activities.js';
import { renderActivityDetail } from './pages/activity-detail.js';
import { renderActivityRegister } from './pages/activity-register.js';
import { renderActivitySuccess } from './pages/activity-success.js';
import { renderNewsDetail } from './pages/news-detail.js';
import { renderArticles } from './pages/articles.js';
import { renderArticleDetail } from './pages/article-detail.js';
import { renderProfile } from './pages/profile.js';
import { renderMyRegistrations } from './pages/my-registrations.js';
import { renderAbout } from './pages/about.js';
import { renderPersonalInfo } from './pages/personal-info.js';
import { renderMyCertificates, renderCertificateDetail } from './pages/my-certificates.js';
import { renderCertificateAdd } from './pages/certificate-add.js';

const app = document.getElementById('app');
const tabbar = document.getElementById('tabbar');

function setupRoutes() {
  registerRoute('/login', (container, params) => {
    const redirect = new URLSearchParams(window.location.hash.split('?')[1] || '').get('redirect');
    renderLogin(container, { redirect: redirect ? decodeURIComponent(redirect) : '#/home' });
  });

  registerRoute('/home', (container) => renderHome(container));
  registerRoute('/activities', (container) => renderActivities(container));
  registerRoute('/activity/:id', (container, params) => renderActivityDetail(container, params));
  registerRoute('/activity/:id/register', (container, params) => renderActivityRegister(container, params));
  registerRoute('/activity/:id/success', (container, params) => {
    const regId = new URLSearchParams(window.location.hash.split('?')[1] || '').get('regId');
    renderActivitySuccess(container, { ...params, regId });
  });
  registerRoute('/news/:id', (container, params) => renderNewsDetail(container, params));
  registerRoute('/articles', (container) => renderArticles(container));
  registerRoute('/articles/:id', (container, params) => renderArticleDetail(container, params));
  registerRoute('/profile', (container) => renderProfile(container));
  registerRoute('/my-registrations', (container) => renderMyRegistrations(container));
  registerRoute('/personal-info', (container) => renderPersonalInfo(container));
  registerRoute('/my-certificates', (container) => renderMyCertificates(container));
  registerRoute('/certificate/add', (container) => renderCertificateAdd(container));
  registerRoute('/certificate/:id', (container, params) => renderCertificateDetail(container, params));
  registerRoute('/about', (container) => renderAbout(container));
}

function updateTabbar(hash) {
  const hide = shouldHideTabbar(hash);
  tabbar.classList.toggle('hidden', hide);

  const tab = getTabFromRoute(hash);
  tabbar.querySelectorAll('.tabbar-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tab);
  });
}

function handleRoute(hash) {
  const path = hash.replace(/^#/, '') || '/home';
  const pathOnly = path.split('?')[0];

  if (pathOnly !== '/login' && requiresAuth('#' + pathOnly) && !store.isLoggedIn()) {
    navigate('#/login?redirect=' + encodeURIComponent('#' + pathOnly), true);
    return;
  }

  const matched = matchRoute('#' + pathOnly);
  if (!matched) {
    navigate('#/home', true);
    return;
  }

  app.innerHTML = '';
  matched.handler(app, matched.params);
  updateTabbar('#' + pathOnly);
}

function setupTabbar() {
  tabbar.querySelectorAll('.tabbar-item').forEach(item => {
    item.addEventListener('click', () => {
      const route = item.dataset.route;
      const tab = item.dataset.tab;

      if (tab === 'profile' && !store.isLoggedIn()) {
        navigate('#/login?redirect=' + encodeURIComponent('#/profile'));
        return;
      }

      navigate(route);
    });
  });
}

setupRoutes();
setupTabbar();
initRouter(handleRoute);

if (!window.location.hash) {
  navigate('#/home', true);
}
