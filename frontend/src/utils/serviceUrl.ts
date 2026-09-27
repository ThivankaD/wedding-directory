/**
 * Returns the SEO-friendly URL for a service.
 * Prefers the human-readable slug if available, falling back to id.
 */
export function getServiceUrl(service?: { id?: string; slug?: string | null } | null): string {
  if (!service) return '/services';
  const identifier = service.slug || service.id;
  return identifier ? `/services/${identifier}` : '/services';
}

export default getServiceUrl;
