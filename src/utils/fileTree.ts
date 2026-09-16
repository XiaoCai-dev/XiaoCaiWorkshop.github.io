import { getCollection, type CollectionEntry } from 'astro:content';

export interface TreeNode {
  name: string;
  path: string; // route path, e.g. /projects/kino/docs/agent (empty for dirs)
  type: 'file' | 'dir';
  depth: number;
  children?: TreeNode[];
}

/** Normalise an entry id to a path without extension: kino/docs/agent */
function normId(id: string): string {
  return id.replace(/\.md$/i, '').replace(/\\/g, '/');
}

export async function listEntries(): Promise<CollectionEntry<'projects'>[]> {
  return getCollection('projects');
}

/** Build the nested file tree for a single project. */
export async function buildTree(project: string): Promise<TreeNode> {
  const entries = await listEntries();
  const prefix = `${project}/`;

  const root: TreeNode = {
    name: project,
    path: `/projects/${project}`,
    type: 'dir',
    depth: 0,
    children: [],
  };

  for (const entry of entries) {
    const id = normId(entry.id);
    if (!id.startsWith(prefix)) continue;
    const rest = id.slice(prefix.length);
    if (!rest) continue;
    const parts = rest.split('/');
    let cur = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      if (isFile) {
        const name = part.replace(/\.md$/i, '');
        // A root-level README is the project landing page itself (/projects/<slug>),
        // not a separate /projects/<slug>/readme route.
        const isReadme = parts.length === 1 && name.toLowerCase() === 'readme';
        const routeParts = parts.slice(0, -1);
        if (!isReadme) routeParts.push(name);
        const path = isReadme
          ? `/projects/${project}`
          : `/projects/${project}/${routeParts.join('/')}`;
        cur.children!.push({
          name,
          path,
          type: 'file',
          depth: cur.depth + 1,
        });
      } else {
        let dir = cur.children!.find((c) => c.type === 'dir' && c.name === part);
        if (!dir) {
          dir = { name: part, path: '', type: 'dir', depth: cur.depth + 1, children: [] };
          cur.children!.push(dir);
        }
        cur = dir;
      }
    }
  }

  const sortRec = (n: TreeNode) => {
    if (!n.children) return;
    n.children.sort((a, b) =>
      a.type !== b.type ? (a.type === 'dir' ? -1 : 1) : a.name.localeCompare(b.name),
    );
    n.children.forEach(sortRec);
  };
  sortRec(root);
  return root;
}

/** Find a collection entry by project + file path (file has no extension). Case-insensitive. */
export async function findEntry(project: string, file: string) {
  const entries = await listEntries();
  const target = normId(`${project}/${file}`).toLowerCase();
  const basename = file.toLowerCase();
  return (
    entries.find((e) => normId(e.id).toLowerCase() === target) ??
    entries.find((e) => normId(e.id).split('/').pop()?.toLowerCase() === basename)
  );
}

/** All (project, file) route params, for [project]/[...file] getStaticPaths. */
export async function allFileRoutes() {
  const entries = await listEntries();
  const routes: { params: { project: string; file: string }; entry: CollectionEntry<'projects'> }[] = [];
  for (const entry of entries) {
    const id = normId(entry.id);
    const [project, ...rest] = id.split('/');
    if (!project || rest.length === 0) continue;
    // Skip the project's README — handled by [project]/index.astro to keep the canonical URL clean.
    if (rest.length === 1 && rest[0].toLowerCase() === 'readme') continue;
    routes.push({ params: { project, file: rest.join('/') }, entry });
  }
  return routes;
}
