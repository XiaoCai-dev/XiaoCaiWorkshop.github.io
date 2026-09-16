import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content lives in-repo under `./content` (open that folder in Obsidian to
 * edit). Each top-level folder is a project; the root README.md is the home
 * page. Both are read at build time — no external paths, so CI builds cleanly.
 */
const projects = defineCollection({
  loader: glob({ pattern: ['*/*.md', '*/**/*.md'], base: './content' }),
});

const home = defineCollection({
  loader: glob({ pattern: 'README.md', base: './content' }),
});

export const collections = { projects, home };
