const DEFAULT_TIMEOUT = 30000; // 30 שניות

export async function api(path, opts = {}) {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOpts } = opts;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const res = await fetch(path, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(fetchOpts.headers || {}) },
      signal: controller.signal,
      ...fetchOpts,
    });
    return res;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('הבקשה נכשלה - תם הזמן המוקצב. אנא נסה שוב.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
