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

这不是可双击 index.html 使用的纯静态站点。可使用 Sites，或根据 `dist/server/wrangler.json` 在兼容 Cloudflare Workers 的环境部署。`dist` 是生成文件，不提交到源码仓库。

## 数据与安全

内容保存在当前浏览器的 IndexedDB 中。清理站点数据、更换浏览器、设备或域名可能导致无法访问原有内容，请定期通过“我的 → 导出全部数据”备份。

仓库不包含用户日记、录音、图片备份、API Key 或当前部署的项目标识。核心功能不需要 AI API Key。私有配置应保存在已忽略的本地环境文件中，不要提交密钥。

## 验证范围

自动测试覆盖备份往返、媒体字节存储与恢复、写入冲突、异常及超时。实际麦克风、浏览器媒体格式、手机后台中断和设备存储限制仍需要目标设备验证。旧版导入只支持项目自身的已定义备份格式，不猜测其他项目的数据结构。
