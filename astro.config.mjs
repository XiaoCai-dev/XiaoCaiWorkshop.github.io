// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Project-page base. Internal links are prefixed with this via:
//  - src/utils/url.ts u() for .astro component hrefs
//  - rehypePrefixBase below for Markdown content links (incl. wikilinks)
const BASE = '/XiaoCaiWorkshop.github.io/';
const BASE_PREFIX = BASE.replace(/\/$/, ''); // no trailing slash

/**
 * Convert Obsidian `[[wikilinks]]` into in-site links (basename-only, same project).
 * Produces `/projects/<project>/<target>`; the rehype plugin below adds the base.
 */
function remarkWikiLinks() {
  const WIKI = /(!?)\[\[([^\]]+)\]\]/g;

  function transform(value, project) {
    const segs = [];
    let last = 0;
    let m;
    WIKI.lastIndex = 0;
    while ((m = WIKI.exec(value)) !== null) {
      if (m.index > last) segs.push({ type: 'text', value: value.slice(last, m.index) });
      const embed = m[1] === '!';
      const inner = m[2];
      const [targetRaw, aliasRaw] = inner.split('|');
      const target = (targetRaw || '').trim();
      const alias = (aliasRaw || target).trim();
      const [namePart, anchorPart] = target.split('#');
      const isImage = /\.(png|jpe?g|gif|svg|webp|avif|bmp)$/i.test(namePart);
      const url = `/projects/${project}/${namePart}` + (anchorPart ? `#${anchorPart}` : '');
      if (embed && isImage) {
        segs.push({ type: 'image', url: `/projects/${project}/${namePart}`, alt: alias });
      } else if (embed) {
        segs.push({ type: 'link', url, data: { hProperties: { className: ['wikilink', 'embed'] } }, children: [{ type: 'text', value: `📄 ${alias}` }] });
      } else {
        segs.push({ type: 'link', url, data: { hProperties: { className: 'wikilink' } }, children: [{ type: 'text', value: alias }] });
      }
      last = m.index + m[0].length;
    }
    if (last < value.length) segs.push({ type: 'text', value: value.slice(last) });
    return segs;
  }

  function walk(nodes, project) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.type === 'text') {
        if (!node.value || !node.value.includes('[[')) continue;
        const segs = transform(node.value, project);
        if (segs.length === 0) continue;
        nodes.splice(i, 1, ...segs);
        i += segs.length - 1;
      } else if (Array.isArray(node.children)) {
        walk(node.children, project);
      }
    }
  }

  return (tree, file) => {
    const fp = String(file?.path || (file?.history && file.history[0]) || '');
    const c = fp.match(/[/\\]content[/\\]([^/\\]+)/);
    let project = c ? c[1] : '';
    if (!project) {
      const p = fp.match(/(?:projects|My_blog)[/\\]([^/\\]+)/);
      if (p) project = p[1];
    }
    if (!project) return;
    if (Array.isArray(tree.children)) walk(tree.children, project);
  };
}

/** Prefix the configured base to internal absolute href/src in rendered Markdown. */
function rehypePrefixBase(prefix) {
  if (!prefix) return () => {};
  return (tree) => {
    const walk = (nodes) => {
      for (const n of nodes) {
        if (n.type === 'element' && n.properties) {
          for (const k of ['href', 'src']) {
            const v = n.properties[k];
            if (typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') && !v.startsWith(prefix)) {
              n.properties[k] = prefix + v;
            }
          }
        }
        if (n.children) walk(n.children);
      }
    };
    if (tree && tree.children) walk(tree.children);
  };
}

export default defineConfig({
  site: 'https://xiaocai-dev.github.io',
  base: BASE,
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkWikiLinks],
    rehypePlugins: [[rehypePrefixBase, BASE_PREFIX]],
  },
});
