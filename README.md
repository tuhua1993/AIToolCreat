# 创作玩家

创作玩家是一个微信小程序，也是我在视频和文章之外整理 AI 教程的地方。读者可以按工具或作品主题找教程，照着步骤做一个小作品。

首版有首页、教程库、教程详情、收藏和创作者介绍。首批 12 篇图文覆盖 WorkBuddy、Codex、豆包工作流、Grok Bot、AI 短剧、AI 短视频、短剧出海、AI 音乐、AI 小说，以及用 AI 做网站、软件和 App。收藏保存在当前设备。

## 本地预览

1. 打开微信开发者工具，导入本仓库根目录。保留项目里的 `touristappid` 可在游客模式编译预览页面。
2. 验证首页、分类、搜索和详情。测试指定教程入口时，在开发者工具的编译模式中选择 `pages/detail/index`，参数填写 `scene=codex-first`。
3. 准备发布时，在微信公众平台核对「创作玩家」的账号信息、服务类目和备案。用正式 AppID 导入项目，在真机上验证分享和扫码，再上传提审。正式 AppSecret 仅由服务端保管。

## 在视频和文章里推广

通用口播可用「这篇教程的步骤和提示词，我放在微信小程序『创作玩家』了。」

正式版发布后可在视频结尾、封面或文章中放小程序码。微信内可以把教程详情作为小程序卡片转发。对应专题的小程序码可以调用[微信获取不限制小程序码接口](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/getUnlimitedQRCode.html)，`page` 用 `pages/detail/index`，`scene` 用对应教程 ID。宣传前用正式版扫码验证；在站外发布时按各渠道对小程序码和引流的规则操作。

| 教程主题 | 扫码参数 `scene` |
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

在 [教程正文](miniprogram/data/tutorials.js) 中新增或修订教程，填写实际更新日期。首页会自动展示最近更新的三篇。原有教程 ID 同时用于收藏、分享和小程序码，修订正文时保留原 ID。项目使用原生小程序组件和本地数据，导入后可以直接编译。

内容更新后运行 `node --test tests/miniprogram.test.cjs`，检查日期、图片文件、教程 ID 和主要交互。[更新流程、类目和变现计划](docs/operations.md)

## 首页插画

[工作台主视觉](miniprogram/assets/studio-cover.jpg) 由内置 ImageGen 生成并压缩为 JPEG。

> Use case: stylized-concept. A wide 3:2 single image for a mobile editorial hero cover of a Chinese independent creative workshop/tutorial journal. Clean warm ivory paper background, near-white soft daylight product photography with tactile real paper and gorgeous shadows. Confine every object to the right 43% of the image, vertically centered, leaving the entire left 54% nearly blank uninterrupted light warm ivory for a heading. On the right, an art-directed asymmetric stack: a deep electric-cobalt blue paper notebook or portfolio with blank cover angled in perspective, a chunky little butter-yellow sculptural asterisk clipped on one corner, a brushed silver mechanical pencil, a small cream contact print of blue abstract ink marks, sculptural bold blue circular paper cutout tucked behind. The blue book is bold and large enough to read on a phone, everything centered horizontally around x 76%. A modern Japanese design magazine style, understated high-end studio image, natural imperfections, daylight from upper left, palette cobalt blue #2646D3, yellow #F6D85D, ivory #F9F6ED, minimal charcoal. Avoid gradients, sci-fi, computer screens, outer space, glowing effects, human models, any text or letters, logos, brand markings or watermark. Keep the main object away from horizontal edges, full-bleed background, art only.
