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
