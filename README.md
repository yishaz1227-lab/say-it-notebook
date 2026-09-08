# 开口日记 · say it

适配手机和电脑的本地优先网页应用，用于日常记录、摘录练习和场景准备。

## 功能

- 日记：文字、压缩图片、最长 60 秒录音、历史日记及补录。
- 拾句：摘录、标签、同页录音、最长 5 分钟的多次练习与原文快照。
- 场景准备：主题、准备稿、最长 5 分钟录音，新录音成功保存后替换旧录音。
- 本地数据管理：IndexedDB 持久化、草稿、备份导出导入。
- 响应式布局：电脑侧栏、手机底部导航。

不提供语音转文字、AI 评价、账号同步或云端个人内容存储。

## 技术栈

React 19、TypeScript、Vinext、Vite、Tailwind CSS、Base UI / Shadcn、IndexedDB、MediaRecorder。部署产物包含 Cloudflare Workers 服务端代码。

## 本地开发

需要 Node.js 22.13.0 或更高版本、pnpm。

```sh
pnpm install
pnpm dev
```

在终端显示的本地地址打开网站。录音需要 localhost 或 HTTPS，并需要用户主动授权麦克风。

项目默认不运行第三方依赖的安装脚本。若特定环境要求额外构建步骤，请先审查对应依赖并遵循该环境的安全策略。

## 检查与打包

```sh
pnpm typecheck
pnpm test
pnpm build
```

构建输出：

```text
dist/
├── client/   # 浏览器端资源
├── server/   # Workers 入口和 wrangler.json
└── .openai/  # 托管配置
```

默认 `pnpm build` 保留 Sites / Cloudflare Workers 构建，可根据 `dist/server/wrangler.json` 部署。`dist` 是生成文件，不提交到源码仓库。

## 部署到 Vercel

仓库根目录的 `vercel.json` 已配置独立的 Vite 静态构建：

- Root Directory：仓库根目录。
- Framework：Vite。
- Build Command：`pnpm run build:vercel`。
- Output Directory：`dist/vercel`。
- 首页产物：`dist/vercel/index.html`。

将 GitHub 仓库导入 Vercel 或推送更新后，由 Vercel 按此配置构建。不要将 Workers 的 `dist/server` 或不含 HTML 首页的 `dist/client` 设置为 Vercel 输出目录。

```sh
pnpm run build:vercel
pnpm run preview:vercel
```

Vercel 入口直接复用 `app/page.tsx` 和 `app/globals.css`，录音、图片、IndexedDB 与 hash 导航不变，不需要服务端 API。默认 `vite.config.ts` 和 `pnpm build` 继续服务于 ChatGPT Sites，不受 Vercel 构建影响。

此前 Vercel 404 的原因是平台没有可部署的 HTML 首页或 Vercel 函数：原构建输出为 Cloudflare Workers。Vinext 的“Some routes could not be classified”是静态分析提示，不代表缺少 `app/page.tsx`，也不是本次需要修复的路由本身。

个人内容按域名分别存储，Sites 和 Vercel 域名不会自动共享记录；迁移内容请使用导出/导入备份。

## 数据与安全

内容保存在当前浏览器的 IndexedDB 中。清理站点数据、更换浏览器、设备或域名可能导致无法访问原有内容，请定期通过“我的 → 导出全部数据”备份。

仓库不包含用户日记、录音、图片备份、API Key 或当前部署的项目标识。核心功能不需要 AI API Key。私有配置应保存在已忽略的本地环境文件中，不要提交密钥。

## 验证范围

自动测试覆盖备份往返、媒体字节存储与恢复、写入冲突、异常及超时。实际麦克风、浏览器媒体格式、手机后台中断和设备存储限制仍需要目标设备验证。旧版导入只支持项目自身的已定义备份格式，不猜测其他项目的数据结构。
