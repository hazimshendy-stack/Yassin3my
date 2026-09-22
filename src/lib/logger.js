const isDev = (() => {
  try { return Boolean(import.meta && import.meta.env && import.meta.env.DEV); }
  catch { return false; }
})();

const PREFIX = '[EGY-Skills]';

function emit(method, args) {
  if (!isDev && method !== 'error') return;
  const fn = console[method] || console.log;
  fn(PREFIX, ...args);
}

export const logger = {
  debug: (...a) => emit('debug', a),
  info:  (...a) => emit('info', a),
  warn:  (...a) => emit('warn', a),
  error: (...a) => emit('error', a),
};

export default logger;
