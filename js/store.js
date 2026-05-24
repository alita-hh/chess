const STORAGE_KEYS = {
  USER: 'xq_user',
  REGISTRATIONS: 'xq_registrations',
  ACTIVITY_OVERRIDES: 'xq_activity_overrides',
  TOKEN: 'xq_token',
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const store = {
  getUser() {
    return readJSON(STORAGE_KEYS.USER, null);
  },

  setUser(user) {
    writeJSON(STORAGE_KEYS.USER, user);
    writeJSON(STORAGE_KEYS.TOKEN, 'mock_token_' + Date.now());
  },

  clearUser() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  isLoggedIn() {
    return !!this.getUser();
  },

  getRegistrations() {
    return readJSON(STORAGE_KEYS.REGISTRATIONS, []);
  },

  addRegistration(reg) {
    const list = this.getRegistrations();
    list.unshift(reg);
    writeJSON(STORAGE_KEYS.REGISTRATIONS, list);
    return reg;
  },

  removeRegistration(id) {
    const list = this.getRegistrations().filter(r => r.id !== id);
    writeJSON(STORAGE_KEYS.REGISTRATIONS, list);
  },

  getRegistrationById(id) {
    return this.getRegistrations().find(r => r.id === id) || null;
  },

  hasRegistered(activityId, phone) {
    return this.getRegistrations().some(
      r => r.activityId === activityId && r.phone === phone
    );
  },

  getActivityOverrides() {
    return readJSON(STORAGE_KEYS.ACTIVITY_OVERRIDES, {});
  },

  setActivityEnrolled(activityId, enrolled) {
    const overrides = this.getActivityOverrides();
    overrides[activityId] = { ...overrides[activityId], enrolled };
    writeJSON(STORAGE_KEYS.ACTIVITY_OVERRIDES, overrides);
  },

  getActivityEnrolled(activityId, defaultEnrolled) {
    const overrides = this.getActivityOverrides();
    return overrides[activityId]?.enrolled ?? defaultEnrolled;
  },

  maskPhone(phone) {
    if (!phone || phone.length < 11) return phone;
    return phone.slice(0, 3) + '****' + phone.slice(7);
  },

  generateId() {
    return 'REG' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
  },
};

export function getActivityStatus(activity) {
  const enrolled = store.getActivityEnrolled(activity.id, activity.enrolled);
  if (activity.status === 'ended') return 'ended';
  if (enrolled >= activity.capacity) return 'full';
  return 'open';
}

export function getRemainingSlots(activity) {
  const enrolled = store.getActivityEnrolled(activity.id, activity.enrolled);
  return Math.max(0, activity.capacity - enrolled);
}

export function getEnrolledCount(activity) {
  return store.getActivityEnrolled(activity.id, activity.enrolled);
}
