/**
 * Single source of truth for site-wide identity & nav.
 * Edit these to point at your own GitHub, etc.
 */
export const SITE = {
  name: 'XiaoCai',
  role: 'Agent Developer & Builder.',
  tagline: 'I build AI agents, tools and products that turn ideas into something real.',
  focus: ['AI', 'Agents', 'Backend', 'SaaS'],
  github: 'https://github.com/XiaoCai-dev',
} as const;

export const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'GitHub', href: SITE.github, external: true },
] as const;
