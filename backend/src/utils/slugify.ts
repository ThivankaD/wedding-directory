/**
 * Converts a raw string (e.g. service name, city) into a clean, URL-safe slug.
 * Example: "John's Studio & Film (Pvt) Ltd" -> "johns-studio-and-film-pvt-ltd"
 */
export function slugify(text: string): string {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/**
 * Generates an initial candidate slug from service name and optional city/vendor.
 */
export function generateServiceBaseSlug(name: string, city?: string): string {
  const cleanName = slugify(name);
  if (!cleanName) return 'service';
  return cleanName;
}
