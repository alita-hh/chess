const STORAGE_KEYS = {
  USER: 'xq_user',
  REGISTRATIONS: 'xq_registrations',
  ACTIVITY_OVERRIDES: 'xq_activity_overrides',
  TOKEN: 'xq_token',
  CERTIFICATES: 'xq_certificates',
  CERTIFICATIONS: 'xq_certifications',
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
    const existing = this.getUser();
    writeJSON(STORAGE_KEYS.USER, { ...existing, ...user });
    writeJSON(STORAGE_KEYS.TOKEN, 'mock_token_' + Date.now());
  },

  updateProfile(fields) {
    const user = this.getUser();
    if (!user) return null;
    const updated = { ...user, ...fields };
    writeJSON(STORAGE_KEYS.USER, updated);
    return updated;
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

  getCertificates() {
    return readJSON(STORAGE_KEYS.CERTIFICATES, []);
  },

  getCertificatesByUser(phone) {
    return this.getCertificates().filter(c => c.phone === phone);
  },

  getCertificateById(id) {
    return this.getCertificates().find(c => c.id === id) || null;
  },

  addCertificate(cert) {
    const list = this.getCertificates();
    list.unshift(cert);
    writeJSON(STORAGE_KEYS.CERTIFICATES, list);
    return cert;
  },

  updateCertificate(id, fields) {
    const list = this.getCertificates();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...fields };
    writeJSON(STORAGE_KEYS.CERTIFICATES, list);
    return list[idx];
  },

  maskPhone(phone) {
    if (!phone || phone.length < 11) return phone;
    return phone.slice(0, 3) + '****' + phone.slice(7);
  },

  maskIdNumber(idNumber) {
    if (!idNumber) return '';
    if (idNumber.length <= 8) return idNumber.slice(0, 2) + '****';
    return idNumber.slice(0, 4) + '****' + idNumber.slice(-4);
  },

  calcAge(birthDate) {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 0 ? age : null;
  },

  isProfileComplete(user) {
    if (!user) return false;
    return !!(
      user.realName &&
      user.gender &&
      user.idType &&
      user.idNumber &&
      user.birthDate &&
      user.avatarPhoto
    );
  },

  generateId() {
    return 'REG' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
  },

  generateCertId() {
    return 'CERT' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
  },

  generateCertificationId() {
    return 'CERTAPP' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
  },

  getCertifications() {
    return readJSON(STORAGE_KEYS.CERTIFICATIONS, []);
  },

  getCertificationsByUser(phone) {
    return this.getCertifications()
      .filter(c => c.userId === phone)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getCertificationById(id) {
    return this.getCertifications().find(c => c.id === id) || null;
  },

  addCertification(record) {
    const list = this.getCertifications();
    list.unshift(record);
    writeJSON(STORAGE_KEYS.CERTIFICATIONS, list);
    return record;
  },

  updateCertification(id, fields) {
    const list = this.getCertifications();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...fields, updatedAt: new Date().toISOString() };
    writeJSON(STORAGE_KEYS.CERTIFICATIONS, list);
    return list[idx];
  },

  hasPendingCertification(phone) {
    return this.getCertificationsByUser(phone).some(c =>
      c.status === 0 || c.status === 2
    );
  },

  readImageFile(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('请选择图片文件'));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('图片不能超过 5MB'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('图片读取失败'));
      reader.readAsDataURL(file);
    });
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
