const TAB_ROUTES = ['home', 'activities', 'profile'];
const AUTH_REQUIRED = ['profile', 'my-registrations', 'my-certificates', 'personal-info', 'certificate'];

const routes = [];

export function registerRoute(pattern, handler, options = {}) {
  routes.push({ pattern, handler, ...options });
}

export function matchRoute(hash) {
  const path = hash.replace(/^#/, '') || '/home';
  for (const route of routes) {
    const regex = new RegExp('^' + route.pattern.replace(/:(\w+)/g, '([^/]+)') + '$');
    const match = path.match(regex);
    if (match) {
      const params = {};
      const paramNames = [...route.pattern.matchAll(/:(\w+)/g)].map(m => m[1]);
      paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { handler: route.handler, params, meta: route };
    }
  }
  return null;
}

export function navigate(hash, replace = false) {
  if (replace) {
    const base = window.location.href.split('#')[0];
    window.history.replaceState(null, '', base + hash);
  } else {
    window.location.hash = hash;
  }
}

export function back(fallback = '#/home') {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    navigate(fallback);
  }
}

export function getTabFromRoute(path) {
  const segment = path.replace(/^#\/?/, '').split('/')[0];
  if (segment === 'activities' || segment === 'activity') return 'activities';
  if (segment === 'profile' || segment === 'my-registrations' || segment === 'my-certificates' || segment === 'personal-info' || segment === 'certificate') return 'profile';
  if (segment === 'home' || segment === '' || segment === 'login') return 'home';
  return null;
}

export function isTabRoute(path) {
  const segment = path.replace(/^#\/?/, '').split('/')[0];
  return TAB_ROUTES.includes(segment);
}

export function requiresAuth(path) {
  const segment = path.replace(/^#\/?/, '').split('/')[0];
  if (AUTH_REQUIRED.includes(segment)) return true;
  if (path.includes('/register')) return true;
  return false;
}

export function shouldHideTabbar(path) {
  const segment = path.replace(/^#\/?/, '').split('/')[0];
  const hidden = ['login', 'activity', 'news', 'articles', 'about', 'my-registrations', 'my-certificates', 'personal-info', 'certificate'];
  return hidden.includes(segment);
}

export function initRouter(onRoute) {
  const handle = () => {
    const hash = window.location.hash || '#/home';
    onRoute(hash);
  };
  window.addEventListener('hashchange', handle);
  handle();
}
