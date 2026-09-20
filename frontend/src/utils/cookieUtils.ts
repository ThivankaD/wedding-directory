/**
 * Thoroughly clears a cookie across current hostname and parent domains.
 */
export const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;

  // 1. Clear without domain attribute (current host)
  document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

  // 2. Clear with current hostname
  const hostname = window.location.hostname;
  document.cookie = `${name}=; path=/; domain=${hostname}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

  // 3. Clear with parent domain (e.g. .easycase.site for sayido.easycase.site)
  const parts = hostname.split('.');
  if (parts.length > 2) {
    const parentDomain = '.' + parts.slice(-2).join('.');
    document.cookie = `${name}=; path=/; domain=${parentDomain}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    const parentDomainNoDot = parts.slice(-2).join('.');
    document.cookie = `${name}=; path=/; domain=${parentDomainNoDot}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

/**
 * Checks whether a JWT token string is structurally valid and not expired.
 */
export const isTokenValid = (token: string | null | undefined): boolean => {
  if (!token || typeof token !== 'string') return false;
  try {
    const cleanToken = token.replace(/^["']|["']$/g, '').trim();
    const parts = cleanToken.split('.');
    if (parts.length !== 3) return false;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    const payloadJson = atob(base64);
    const payload = JSON.parse(payloadJson);
    if (payload.exp && typeof payload.exp === 'number') {
      // Allow 30 seconds clock skew tolerance
      return payload.exp * 1000 > Date.now() - 30000;
    }
    return true;
  } catch {
    return false;
  }
};
