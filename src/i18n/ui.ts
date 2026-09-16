export type Lang = 'zh' | 'en';

export const DEFAULT_LANG: Lang = 'zh';

/**
 * UI strings for the site chrome (nav, hero, labels). Markdown content is not
 * translated — it renders as written in the vault. Default language is Chinese.
 *
 * In components, render the default-lang string server-side and tag the element
 * with `data-i18n="<key>"` (or `data-i18n-placeholder` for inputs). The client
 * script in BaseLayout swaps these based on the persisted language.
 */
export const UI: Record<Lang, Record<string, string>> = {
  zh: {
    'nav.about': '关于',
    'nav.projects': '项目',
    'nav.github': 'GitHub',

    'home.greetingPrefix': '你好，我是',
    'home.greetingSuffix': '。',
    'home.role': 'AI Agent 开发者 & 构建者',
    'home.tagline': '我构建 AI agents、工具和产品，把想法变成现实。',
    'home.welcome': '欢迎来到我的小角落。',

    'about.label': '关于',
    'about.body': '我专注于 AI agents、后端系统，以及把想法变成现实的产品。',
    'about.exploring': '目前正在探索',

    'projects.label': '项目',
    'projects.heading': '我正在构建的东西。',

    'project.files': '文件',
    'project.search': '搜索文件…',
    'project.onThisPage': '本页目录',
    'project.noSections': '暂无章节',
    'project.backToList': '← 项目',
    'project.backToProject': '← 返回',
    'project.noReadme':
      '这个项目还没有 README。在 Obsidian 的项目文件夹里添加 README.md，它就会出现在这里。',

    'lang.zh': '中',
    'lang.en': 'EN',
  },
  en: {
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.github': 'GitHub',

    'home.greetingPrefix': "Hi, I'm",
    'home.greetingSuffix': '.',
    'home.role': 'Agent Developer & Builder.',
    'home.tagline': 'I build AI agents, tools and products that turn ideas into something real.',
    'home.welcome': 'Welcome to my little corner.',

    'about.label': 'About',
    'about.body': 'I work on AI agents, backend systems, and products that turn ideas into reality.',
    'about.exploring': 'Currently exploring',

    'projects.label': 'Projects',
    'projects.heading': "Things I'm building.",

    'project.files': 'Files',
    'project.search': 'Search files…',
    'project.onThisPage': 'On this page',
    'project.noSections': 'No sections.',
    'project.backToList': '← Projects',
    'project.backToProject': '← Back to',
    'project.noReadme':
      "This project doesn't have a README yet. Add README.md to its folder in Obsidian and it will show up here.",

    'lang.zh': '中',
    'lang.en': 'EN',
  },
};

/** Helper to render the default-lang string server-side. */
export function t(key: string): string {
  return UI[DEFAULT_LANG][key] ?? key;
}
