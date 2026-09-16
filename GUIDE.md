# 使用教程

从「新建一篇内容」到「上线」到「删除」的完整流程。所有内容都是 Markdown，放在仓库的 `content/` 文件夹里。

---

## 0. 核心概念

- **内容目录**：仓库里的 `content/`。用 Obsidian 打开这个文件夹来编辑（不是项目根目录）。
- **一个顶层文件夹 = 一个项目**：`content/kino/`、`content/jijiang/`。
- **根 `README.md` = 首页**：`content/README.md` 的 frontmatter 决定首页 hero 文字。
- **每个 `.md` = 一个页面**：`content/kino/docs/agent.md` → 网址 `/projects/kino/docs/agent`。
- 改完保存，dev server 自动刷新，无需重启。

> 仓库当前位置：`~/.zcode/workspace/default/blog/`。如果想搬到更顺手的路径，直接移动整个 `blog/` 文件夹即可，git 远程不受影响。

---

## 1. 本地预览

```sh
cd blog
npm install        # 第一次或拉取更新后
npm run dev        # http://localhost:4321
```

浏览器打开 [http://localhost:4321](http://localhost:4321)。Obsidian 里保存后，页面自动热更新。

---

## 2. 新建文件

### 方式 A：Obsidian 直接建（最快）

1. 在 Obsidian（打开的是 `content/` 文件夹）里，进到某个项目目录，比如 `kino/docs/`。
2. 新建一个 `.md` 文件，比如 `setup.md`，写内容。
3. 保存。左侧文件树立刻多出这一项，访问 `/projects/kino/docs/setup` 即可。

子目录会自动反映成路由和文件树层级，不用任何额外配置。

### 方式 B：脚手架命令（带模板）

```sh
npm run new                       # 交互式：选「项目」或「文档」
npm run new -- doc kino docs/setup     # 直接建一篇文档
npm run new -- project aura            # 直接建一个新项目（用默认值，事后改）
```

脚手架会自动建好文件、写入模板；建项目时还会往 `src/data/projects.json` 加好条目。

### 新建一个完整项目（手动三步）

1. 在 `content/` 下建文件夹：`content/aura/`，放一个 `README.md`（它就是项目首页 `/projects/aura`）。
2. 在 `src/data/projects.json` 加一条（`slug` 必须等于文件夹名）：
   ```json
   { "slug": "aura", "name": "AURA", "tagline": "...", "description": "...",
     "year": "2026", "tags": ["AI"], "github": "https://github.com/XiaoCai-dev",
     "accent": "#22c55e" }
   ```
3. 保存。项目列表页和 `/projects/aura` 立即可用。

---

## 3. 上传 / 更新到线上（git 部署）

内容在 `content/` 里，是 git 跟踪的，所以「上传」= `git push`，GitHub Actions 会自动构建并发布到 GitHub Pages。

### 首次设置（只做一次）

1. 在 GitHub 建一个**用户主页仓库**，名字必须是 `XiaoCai-dev.github.io`（这样网址是干净的 `https://xiaocai-dev.github.io/`，无需 base 前缀）。
2. 仓库 **Settings → Pages → Build and deployment → Source：GitHub Actions**。
3. 本地连远程并首次推送：
   ```sh
   cd blog
   git remote add origin https://github.com/XiaoCai-dev/XiaoCai-dev.github.io.git
   git add .
   git commit -m "init site"
   git push -u origin main
   ```
   推送后 `.github/workflows/deploy.yml` 会自动跑构建并发布。等 1~2 分钟，打开 `https://xiaocai-dev.github.io/`。

> 如果一定要用项目仓库（仓库名不是 `<用户名>.github.io`），网址会多一层前缀，且需要在 `astro.config.mjs` 设 `base: '/<仓库名>/'` 并给内部链接加 base 前缀——不推荐，用户主页仓库最省心。

### 日常更新（每次改完）

```sh
cd blog
git add .
git commit -m "更新 KINO 架构文档"
git push
```

推完即触发部署，几分钟后线上更新。本地 `npm run dev` 看的是即时效果，线上略晚于本地。

---

## 4. 删除

### 删除一篇文档

直接在 Obsidian 里删掉那个 `.md` 文件（或 `rm content/kino/docs/setup.md`）。保存后文件树和路由同步消失。

### 删除整个项目

1. 删掉 `content/<项目>/` 整个文件夹。
2. 从 `src/data/projects.json` 里删掉对应那条（`slug` 匹配的那个对象）。

### 让删除同步到线上

```sh
git add .
git commit -m "移除旧项目 xxx"
git push
```

用 `git rm <文件>` 也行，效果一样。

---

## 5. 小技巧

- **站内链接**：同项目内用 `[[architecture]]` 会自动指到 `/projects/<当前项目>/architecture`（按文件名，限同项目）。跨项目或跨子目录的链接，用普通 Markdown 链接更稳：`[架构](/projects/kino/architecture)`。
- **首页文字**：改 `content/README.md` 的 frontmatter（`name` / `role_zh` / `role_en` / `tagline_zh` / `tagline_en` / `focus` / `welcome_zh` / `welcome_en`）。`_en` 字段留空时英文回退到中文。
- **深色模式**：自动跟随系统外观，无需任何开关。
- **中英切换**：页面右上角「中 / EN」按钮，记忆你的选择（localStorage）。只切换界面文字，正文按你写的语言显示。
- **项目配色**：`projects.json` 里每个项目的 `accent` 字段控制该项目名和卡片主题色。
- **本地构建检查**：`npm run build` 会在 `dist/` 生成完整站点，可用来确认改完能正常构建再推送。

---

## 命令速查

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地预览 `localhost:4321` |
| `npm run build` | 构建到 `dist/`（推送前自检） |
| `npm run new` | 交互式新建项目/文档 |
| `npm run new -- doc kino docs/setup` | 直接建文档 |
| `npm run new -- project aura` | 直接建项目 |
| `git add . && git commit -m "..." && git push` | 上传更新到线上 |
