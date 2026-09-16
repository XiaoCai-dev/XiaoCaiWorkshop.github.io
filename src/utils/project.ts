import projectsMeta from '../data/projects.json';
import { buildTree, findEntry } from './fileTree';

export interface ProjectMeta {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  year: string;
  tags: string[];
  github: string;
  accent?: string;
}

export function allProjects(): ProjectMeta[] {
  return projectsMeta as ProjectMeta[];
}

export function getProjectMeta(slug: string): ProjectMeta | undefined {
  return (projectsMeta as ProjectMeta[]).find((p) => p.slug === slug);
}

export async function getProjectTree(slug: string) {
  return buildTree(slug);
}

export async function getProjectEntry(slug: string, file: string) {
  return findEntry(slug, file);
}
