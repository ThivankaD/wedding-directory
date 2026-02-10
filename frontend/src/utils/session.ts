/**
 * Generate and persist a unique session ID for anonymous visitors.
 * Used for tracking unique package views without requiring authentication.
 */
export function ensureSessionId(): string {
  const key = 'wedding_session_id';
  
  if (typeof window === 'undefined') {
    // Server-side rendering: return empty string
    return '';
  }
  
  let sessionId = localStorage.getItem(key);
  
  if (!sessionId) {
    // Generate a new UUID for this browser session
    sessionId = crypto.randomUUID();
    localStorage.setItem(key, sessionId);
  }
  
  return sessionId;
}
