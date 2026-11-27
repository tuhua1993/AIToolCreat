# 创作玩家

创作玩家是一个微信小程序，也是我在视频和文章之外整理 AI 教程的地方。读者可以按工具或作品主题找教程，照着步骤做一个小作品。

小程序有首页、实战案例、教程库、教程详情、收藏和创作者介绍。现有教程覆盖 WorkBuddy、Codex、豆包工作流、Grok Bot、AI 短剧、AI 短视频、短剧出海、AI 音乐、AI 小说，以及用 AI 做网站、软件和 App。收藏保存在当前设备。

在「案例」选一个作品，查看制作工具、练习预算和流程。详情底部可以查看并复制配套 Skill。复制后使用 Skill 的 `name` 建同名文件夹，把内容保存为 `SKILL.md`，再按所用客户端的说明添加。配套模板提供工作流和检查方法。

建站案例封面来自实际运行的 [作品集示例](examples/portfolio/index.html)。在浏览器里打开该文件即可预览，示例目录包含页面所需的样式和配图。

在「教程库 → PDF 手册」或对应案例详情中可直接打开[三页免费试读](examples/workbooks/mountain-letter-sample.pdf)。试读数据随小程序打包，使用微信原生文档阅读器。更新这份样章后，在仓库根目录执行下面的命令同步阅读器数据，再运行测试核对两个文件的内容一致。

```sh
node -e "const fs=require('node:fs'), id='mountain-letter-sample'; fs.writeFileSync('miniprogram/data/samples/'+id+'.js', 'module.exports = '+JSON.stringify(fs.readFileSync('examples/workbooks/'+id+'.pdf').toString('base64'))+'\n')"
```

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
| 电商商品图文 | `commerce-product-copy` |
| AI 小说 | `fiction-chapter` |
| AI 建站 | `build-site` |
| AI 做软件 | `build-software` |
| AI 做 App | `build-app` |

## 更新内容

在 [教程正文](miniprogram/data/tutorials.js) 中新增或修订教程，填写实际更新日期。提供配套 Skill 的实战案例在 [案例工具与 Skill](miniprogram/data/case-resources.js) 中按教程 ID 登记。首页会自动展示最近更新的三个案例。原有教程 ID 同时用于收藏、分享和小程序码，修订正文时保留原 ID。项目使用原生小程序组件和本地数据，导入后可以直接编译。

内容更新后运行 `node --test tests/miniprogram.test.cjs`，检查日期、图片文件、教程 ID 和主要交互。[更新流程、类目和变现计划](docs/operations.md)

## 开源参考

[The Odin Project](https://github.com/TheOdinProject/curriculum) 把内容组织成可完成的项目。[AI Guide](https://github.com/liyupi/ai-guide) 将工具用法和实战内容组织成不同入口。[AI Video Prompt Hub](https://github.com/fatedawn/ai-video-prompt-hub) 以示例串起分镜、工具和提示词。创作玩家采用了这些内容组织方式。

## 案例图片与样片

[《山月来信》30 秒 MP4](examples/mountain-letter.mp4) 以六幅真人质感的国风分镜剪成，可在本地播放或发到自己的视频号。小程序内可翻阅全部六镜，发布后按[案例绑定说明](docs/operations.md#给案例绑定已发布的作品)补上视频号作品 ID。图像中的角色为虚构人物。

[漫剧首镜](miniprogram/assets/mountain-01.jpg)和[《晚风来信》封面](miniprogram/assets/evening-letter.jpg)使用内置 ImageGen 生成。建站封面是[作品集的实际浏览器截图](miniprogram/assets/project-portfolio-preview.jpg)。

<details>
<summary>查看创作提示词</summary>

**《山月来信》六镜分镜**

> Six LIVE ACTION film photographs in ONE 2-column by 3-row contact sheet. Equal panels, edge to edge, no gutters or text. Each frame landscape 4:3. Chinese period short film shot on a real camera in the Huangshan mountains at warm lavender sunrise. Same real-looking adult Chinese woman, 28, black hair in a plum ribbon, ivory silk hanfu. Natural human face, skin texture, realistic hands, beautiful film lighting, no illustration, anime or CGI. Top left is a hero medium portrait: face in sharp focus, smiling softly on stone steps under an old pine with distant misty peaks. Top right she notices a pale lilac letter caught on a pine twig. Middle left close-up her hand taking the folded note. Middle right over her shoulder unfolded note shows tiny ink drawing of mountain and moon. Bottom left her profile holding note up to the matching mountain notch and moon on the horizon. Bottom right she kneels to leave note under a stone for the next traveler. Distinct camera angles, coherent real actress, cinematic warm daylight, no titles, no lettering.

**《晚风来信》专辑封面**

> A romantic, breezy, luminous photographic album sleeve for an original love song titled 晚风来信. Landscape 4:3, edge to edge. Late afternoon in late spring at a SUNNY open-air neighborhood train platform, abundant warm peach-apricot sun and pale turquoise midtones, airy cream blouse, light sage linen, pale blue distant sky, sunlit green trees softly out of focus. Center-right: candid side view of an adult Chinese woman in her late twenties with a short natural bob, smiling visibly with eyes crinkled as she opens a cream handwritten letter, a loose strand of hair lifted by a soft breeze. If the paper has marks they are out of focus. Bright authentic skin tone, transparent golden backlight, fine analog grain, a sweet, hopeful and intimate Mandopop sleeve like a summer film photograph. Large clearly readable elegant dark teal handlettered 4 Chinese characters “晚风来信” arranged vertically on the left against a mostly clean pale warm sunlit field. ALL other text, logos or badges absent. No shadowy silhouette, no dark coat, no rain, no night setting, no noir, no urban alley, no neon, no gloom, no horror cues, no dramatic dark corners. Inviting sun-washed magazine photography with plenty of air and strong thumbnail readability.

</details>
