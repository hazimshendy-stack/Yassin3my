import { logger } from '../../lib/logger.js';

/**
 * Mock auth backend used when VITE_USE_MOCKS=true (default).
 * Persists users to localStorage so demos survive reloads.
 */

const USERS_KEY = 'egyskills.mocks.users';
const SESSION_KEY = 'egyskills.mocks.session';

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}
function writeUsers(list) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  } catch (e) {
    logger.warn('mock writeUsers failed', e.message);
  }
}
function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}
function writeSession(session) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    logger.warn('mock writeSession failed', e.message);
  }
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const authApi = {
  async getSession() {
    await delay(200);
    return readSession();
  },

  async login({ email, password }) {
    await delay(400);
    const users = readUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase()
    );
    if (!match || match.password !== password) {
      const e = new Error('بيانات الدخول غير صحيحة');
      e.code = 'INVALID_CREDENTIALS';
      throw e;
    }
    const session = {
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
      avatarUrl: match.avatarUrl,
      createdAt: match.createdAt,
    };
    writeSession(session);
    return session;
  },

  async register({ name, email, password, role = 'student' }) {
    await delay(500);
    const users = readUsers();
    const exists = users.some((u) => u.email.toLowerCase() === String(email).toLowerCase());
    if (exists) {
      const e = new Error('هذا البريد مسجل بالفعل');
      e.code = 'EMAIL_TAKEN';
      throw e;
    }
    const user = {
      id: 'u-' + Date.now().toString(36),
      name,
      email,
      password,
      role,
      avatarUrl: '',
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeUsers(users);
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
    writeSession(session);
    return session;
  },

  async logout() {
    await delay(150);
    writeSession(null);
    return true;
  },

  async updateProfile(updates) {
    await delay(300);
    const session = readSession();
    if (!session) throw new Error('not authenticated');
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === session.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates };
      writeUsers(users);
    }
    const next = { ...session, ...updates };
    writeSession(next);
    return next;
  },
};

export default authApi;
