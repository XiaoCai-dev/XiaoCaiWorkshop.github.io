/**
 * Prefix the configured Astro `base` to internal absolute paths so links work
 * under a project-page deployment (e.g. /XiaoCaiWorkshop.github.io/about).
 * External URLs, protocol-relative (//), hashes and mailto: are left as-is.
 */
const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

export function u(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('#') || path.startsWith('mailto:')) {
    return path;
  }
  if (path.startsWith('/')) return BASE + path;
  return path;
}
