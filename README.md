# 创作玩家

创作玩家是一个微信小程序，也是我在视频和文章之外整理 AI 教程的地方。读者可以按工具或作品主题找教程，照着步骤做一个小作品。

小程序有首页、实战案例、教程库、教程详情、收藏和创作者介绍。现有教程覆盖 WorkBuddy、Codex、豆包工作流、Grok Bot、AI 短剧、AI 短视频、短剧出海、AI 音乐、AI 小说，以及用 AI 做网站、软件和 App。收藏保存在当前设备。

在「案例」选一个作品，查看制作工具、练习预算和流程。详情底部可以查看并复制配套 Skill。复制后使用 Skill 的 `name` 建同名文件夹，把内容保存为 `SKILL.md`，再按所用客户端的说明添加。配套模板提供工作流和检查方法。

建站案例封面来自实际运行的 [作品集示例](examples/portfolio/index.html)。在浏览器里打开该文件即可预览，示例目录包含页面所需的样式和配图。

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
| 30 秒 AI 漫剧案例 | `comic-30s` |
| AI 短视频 | `video-30s` |
| 短剧出海 | `drama-en` |
| AI 音乐 | `music-bed` |
| 原创情歌案例 | `music-first-song` |
| AI 小说 | `fiction-chapter` |
| AI 建站 | `build-site` |
| AI 做软件 | `build-software` |
| AI 做 App | `build-app` |

## 更新内容

在 [教程正文](miniprogram/data/tutorials.js) 中新增或修订教程，填写实际更新日期。提供配套 Skill 的实战案例在 [案例工具与 Skill](miniprogram/data/case-resources.js) 中按教程 ID 登记。首页会自动展示最近更新的三个案例。原有教程 ID 同时用于收藏、分享和小程序码，修订正文时保留原 ID。项目使用原生小程序组件和本地数据，导入后可以直接编译。

内容更新后运行 `node --test tests/miniprogram.test.cjs`，检查日期、图片文件、教程 ID 和主要交互。[更新流程、类目和变现计划](docs/operations.md)

## 开源参考

[The Odin Project](https://github.com/TheOdinProject/curriculum) 把内容组织成可完成的项目。[AI Guide](https://github.com/liyupi/ai-guide) 将工具用法和实战内容组织成不同入口。[AI Video Prompt Hub](https://github.com/fatedawn/ai-video-prompt-hub) 以示例串起分镜、工具和提示词。创作玩家采用了这些内容组织方式。

## 项目插画

[工作台主视觉](miniprogram/assets/studio-cover.jpg) 由内置 ImageGen 生成并压缩为 JPEG。

> Use case: stylized-concept. A wide 3:2 single image for a mobile editorial hero cover of a Chinese independent creative workshop/tutorial journal. Clean warm ivory paper background, near-white soft daylight product photography with tactile real paper and gorgeous shadows. Confine every object to the right 43% of the image, vertically centered, leaving the entire left 54% nearly blank uninterrupted light warm ivory for a heading. On the right, an art-directed asymmetric stack: a deep electric-cobalt blue paper notebook or portfolio with blank cover angled in perspective, a chunky little butter-yellow sculptural asterisk clipped on one corner, a brushed silver mechanical pencil, a small cream contact print of blue abstract ink marks, sculptural bold blue circular paper cutout tucked behind. The blue book is bold and large enough to read on a phone, everything centered horizontally around x 76%. A modern Japanese design magazine style, understated high-end studio image, natural imperfections, daylight from upper left, palette cobalt blue #2646D3, yellow #F6D85D, ivory #F9F6ED, minimal charcoal. Avoid gradients, sci-fi, computer screens, outer space, glowing effects, human models, any text or letters, logos, brand markings or watermark. Keep the main object away from horizontal edges, full-bleed background, art only.

本次首页主视觉、漫剧画面示例和歌曲情境封面使用内置 ImageGen 生成。作品集案例采用本地页面截图。

[首页主视觉](miniprogram/assets/creator-stage.jpg)

> Use case: stylized-concept. Premium art-directed mobile hero for an independent creator's AI tutorial publication. Produce a square 1:1 crop-safe studio photograph with a deep, saturated indigo cobalt seamless background, nearly monochrome #2639B9. The entire left 48% is uninterrupted flat cobalt-blue dark enough for white heading and CTA, no props, faint studio falloff only. In the right half, build a tactile high-fashion still-life: a single large luminous acid-lime yellow-green six-spoke asterisk made from thick folded paper, sculptural and irregular with crisp small shadows, hovering diagonally above a thin stack of cream gridded storyboard index cards and a chrome bulldog clip. A cobalt glass semicircle low behind it. Physically photographed, tactile matte card, dramatic hard-soft directional studio light from the upper right, crisp editorial product photography, cropped close with deliberate scale, sophisticated independent design magazine styling. Main object center x=76% y=46%, leave all objects within right half. Palette cobalt and saturated citrine #EAF981, small neutral cream and silver. No words, letters, numbers, logos, screens, robots, sci-fi, gradient bands, stars, planet or watermark.

[漫剧第 5 镜画面示例](miniprogram/assets/project-comic-still.jpg)

> Create an original photorealistic cinematic film still, landscape 3:2 with a strong square center crop. It is the pivotal reveal in a 30-second short film titled The Paper Boats Under the Umbrella, no text in the image. Blue-hour after rain at a quiet modern Asian commuter train platform, wet slate tile with clear reflections, a single saturated yellow umbrella tipped gently upward by the partially visible hand of an adult wearing a dark navy raincoat. Under it, four dry ivory folded paper boats neatly lined up at the edge of a shallow puddle. Frame from very low close to the ground, crop people to only sleeve and hands, large clear shapes and photographic texture, muted blue-teal background, warm soft platform lights, gentle hopeful mood. The paper boats and yellow umbrella should be unmistakable at a tiny mobile thumbnail. Photoreal, analog 35mm subtle grain, fine weather detail, no readable signage, numbers, brands, typography, watermarks, rail danger or violence.

[原创歌曲情境封面](miniprogram/assets/project-song-cover.jpg)

> Create an original cinematic photographic album cover image with no text, landscape 3:2 with strong square-center framing, for a gentle Chinese indie folk song about someone arriving home on the last train. Blue hour outside a small city train station, a single adult in a dark plum coat seen from behind, carrying a canvas bag, standing beneath one pool of warm amber light. The wet pavement reflects golden windows and cobalt light. A warm paper letter held loosely in one hand, understated human emotion. Balanced sharply recognizable dark silhouette in the middle and rich nighttime city context, editorial independent record cover photography, subtle blue/magenta undertone and golden accents, believable natural optics and film grain. No letters, names, logo, signage, poster typography, frames, watermark, or reference to any real artist. No cyberpunk signage, no illustration.

[作品集浏览器截图](miniprogram/assets/project-portfolio-preview.jpg)
