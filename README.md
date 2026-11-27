# 创作星球

创作星球是一个微信小程序，也是我在视频和文章之外整理 AI 教程的地方。读者可以按工具或作品主题找教程，照着步骤做一个小作品。

首版有首页、教程库、教程详情、收藏和创作者介绍。首批 12 篇图文覆盖 WorkBuddy、Codex、豆包工作流、Grok Bot、AI 短剧、AI 短视频、短剧出海、AI 音乐、AI 小说，以及用 AI 做网站、软件和 App。收藏保存在当前设备。

## 本地预览

1. 打开微信开发者工具，导入本仓库根目录。保留项目里的 `touristappid` 可在游客模式编译预览页面。
2. 验证首页、分类、搜索和详情。测试指定教程入口时，在开发者工具的编译模式中选择 `pages/detail/index`，参数填写 `scene=codex-first`。
3. 准备发布时，在微信公众平台核对「创作星球」名称是否可用，从账号实际开放的类目里确认图文教程对应的服务类目。用正式 AppID 导入项目，在真机上验证分享和扫码，再上传提审。正式 AppSecret 仅由服务端保管。

## 在视频和文章里推广

通用口播可用「这篇教程的步骤和提示词，我放在微信小程序『创作星球』了。」

正式版发布后可在视频结尾、封面或文章中放小程序码。微信内可以把教程详情作为小程序卡片转发。对应专题的小程序码可以调用[微信获取不限制小程序码接口](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/getUnlimitedQRCode.html)，`page` 用 `pages/detail/index`，`scene` 用对应教程 ID。宣传前用正式版扫码验证；在站外发布时按各渠道对小程序码和引流的规则操作。

| 教程主题 | `scene` |
| --- | --- |
| WorkBuddy | `workbuddy-first` |
| Codex | `codex-first` |
| 豆包工作流 | `doubao-work` |
| Grok Bot | `grok-bot` |
| AI 短剧 | `drama-storyboard` |
| AI 短视频 | `video-30s` |
| 短剧出海 | `drama-en` |
| AI 音乐 | `music-bed` |
| AI 小说 | `fiction-chapter` |
| AI 建站 | `build-site` |
| AI 做软件 | `build-software` |
| AI 做 App | `build-app` |

## 更新内容

在 [教程数据](miniprogram/data/guides.js) 中新增分类或教程。教程 ID 用不超过 32 个字符的小写字母、数字和连字符，发布后保留原 ID，让已发出去的卡片和小程序码继续指向对应教程。项目使用原生小程序组件和本地数据，导入后可以直接编译。

## 首页插画

[星球主视觉](miniprogram/assets/planet-hero.jpg) 由内置 ImageGen 生成并压缩为 JPEG。生成提示词如下。

> Use case: stylized-concept. Generate a single wide landscape 3:2 hero illustration for a premium Chinese independent AI creative tutorial mini program named 创作星球. Art only, no text, type, logos or watermark. Elegant retro sci-fi editorial cover, dark midnight-indigo outer space. Put a striking large lavender and ice-violet ringed planet around 76% from the left, just above middle height, with fine sweeping silver rings angled bottom left to top right, realistic soft planetary surface detail and little cyan and violet star specks around it. At far bottom right a very low hazy purple ridge silhouette gives depth. Composition deliberately reserves the entire left 46 percent as almost solid midnight indigo negative space for two lines of application text, with sparse faint stars only. Refined, dim, atmospheric, subtly grainy, limited palette, strong silhouette, deep blacks, clean edges, high-end sci-fi book cover look. Full bleed, planet and rings within the frame.
