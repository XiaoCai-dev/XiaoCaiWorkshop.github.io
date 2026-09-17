#!/usr/bin/env node
// Content scaffolder: add/delete projects and docs. Keeps projects.json in sync
// and git-commits the change; you only run `git push` to deploy.
//
//   npm run add-project -- <slug>                       # 新增一个项目
//   npm run add-doc -- <project> <path>                 # 新增一篇文章到指定项目
//   npm run del-project -- <slug>                       # 删除一整个项目
//   npm run del-doc -- <project> <path>                 # 删除一篇文章
//
//   npm run new                                          # 交互式（建项目/文档）
//   npm run delete -- <slug>                            # = del-project 的简写
//
// <path> 不带 .md，如 docs/setup 或 setup → /projects/<project>/docs/setup
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VAULT = join(ROOT, 'content');
const PROJECTS_JSON = join(ROOT, 'src/data/projects.json');
const GITHUB = 'https://github.com/XiaoCai-dev';

const rl = readline.createInterface({ input: stdin, output: stdout });
const isTTY = process.stdin.isTTY;
const ask = (q, def = '') =>
  isTTY ? rl.question(q).then((a) => a.trim() || def) : Promise.resolve(def);
const askList = async (q, def) =>
  (await ask(q, def)).split(/[,\s]+/).filter(Boolean);
const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');

function readProjects() {
  return JSON.parse(readFileSync(PROJECTS_JSON, 'utf8'));
}
function writeProjects(list) {
  writeFileSync(PROJECTS_JSON, JSON.stringify(list, null, 2) + '\n');
}
function gitCommit(message) {
  try {
    execSync('git add -A', { cwd: ROOT, stdio: 'ignore' });
    execSync(`git commit -m ${JSON.stringify(message)}`, { cwd: ROOT, stdio: 'ignore' });
    console.log('✓ 已 git 提交');
  } catch {
    console.log('(git 提交跳过；请手动 git add -A && git commit)');
  }
  console.log('\n→ 推送上线:  git push');
}

async function newProject(slug) {
  slug = slugify(slug || (await ask('slug (文件夹名, 如 kino): ', 'new-project')));
  if (!slug) return console.log('已取消');
  const dir = join(VAULT, slug);
  if (existsSync(dir)) return console.log('✗ 项目已存在:', dir);

  const name = await ask('显示名 (如 KINO): ', slug.toUpperCase());
  const tagline = await ask('一句话简介: ', '');
  const description = await ask('描述 (回车同简介): ', tagline);
  const tags = await askList('标签 (逗号分隔): ', 'AI');
  const accent = await ask('主题色 hex (回车默认): ', '#6366f1');

  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'README.md'),
    `# ${name}\n\n> ${tagline}\n\n${description}\n\n## Status\n\nEarly.\n`,
  );

  const projects = readProjects();
  projects.push({
    slug,
    name,
    tagline,
    description,
    year: String(new Date().getFullYear()),
    tags,
    github: GITHUB,
    accent,
  });
  writeProjects(projects);

  console.log(`✓ 项目已创建`);
  console.log(`  文件: ${dir}`);
  console.log(`  预览: /projects/${slug}`);
  gitCommit(`add project ${slug}`);
}

async function newDoc(project, path) {
  const projects = readProjects();
  const slugs = projects.map((p) => p.slug);
  project = project || (await ask(`项目 (${slugs.join(' / ')}): `, slugs[0]));
  if (!projects.find((p) => p.slug === project))
    return console.log('✗ 未知项目:', project, '— 先 add-project 创建');

  path = path || (await ask('文件路径 (如 docs/setup 或 setup): ', 'note'));
  path = path.replace(/\.md$/i, '').replace(/^\/+/, '');
  const full = join(VAULT, project, path + '.md');
  if (existsSync(full)) return console.log('✓ 文件已存在:', full);

  mkdirSync(dirname(full), { recursive: true });
  const title = path.split('/').pop();
  writeFileSync(full, `# ${title}\n\nTBD.\n`);
  console.log(`✓ 文档已创建`);
  console.log(`  文件: ${full}`);
  console.log(`  预览: /projects/${project}/${path}`);
  gitCommit(`add doc ${project}/${path}`);
}

async function deleteProject(slug) {
  slug = slug || (await ask('要删除的项目 slug: ', ''));
  if (!slug) return console.log('已取消');
  const projects = readProjects();
  if (!projects.find((p) => p.slug === slug))
    return console.log(`✗ projects.json 里没有 slug="${slug}"`);

  const dir = join(VAULT, slug);
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    console.log(`✓ 删除文件夹 ${dir}`);
  } else {
    console.log(`(文件夹不存在: ${dir})`);
  }
  writeProjects(projects.filter((p) => p.slug !== slug));
  console.log(`✓ 从 projects.json 移除 "${slug}"`);
  gitCommit(`remove project ${slug}`);
}

async function deleteDoc(project, path) {
  const projects = readProjects();
  const slugs = projects.map((p) => p.slug);
  project = project || (await ask(`项目 (${slugs.join(' / ')}): `, slugs[0]));
  path = path || (await ask('文件路径 (如 docs/setup 或 setup): ', 'note'));
  path = path.replace(/\.md$/i, '').replace(/^\/+/, '');
  const full = join(VAULT, project, path + '.md');
  if (!existsSync(full)) return console.log('✓ 文件不存在:', full);

  rmSync(full, { force: true });
  console.log(`✓ 删除文件 ${full}`);
  gitCommit(`remove doc ${project}/${path}`);
}

async function main() {
  const [sub, a, b, c] = process.argv.slice(2);
  if (sub === 'project') return await newProject(a);
  if (sub === 'doc') return await newDoc(a, b);
  if (sub === 'delete') {
    if (a === 'doc') return await deleteDoc(b, c); // delete doc <project> <path>
    if (a === 'project') return await deleteProject(b); // delete project <slug>
    return await deleteProject(a); // delete <slug> (project shorthand)
  }

  // interactive
  const mode = await ask('操作  (1) 加项目  (2) 加文档  (3) 删项目  (4) 删文档  [1-4]: ', '2');
  if (mode === '1') await newProject();
  else if (mode === '3') await deleteProject();
  else if (mode === '4') await deleteDoc();
  else await newDoc();
  rl.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
