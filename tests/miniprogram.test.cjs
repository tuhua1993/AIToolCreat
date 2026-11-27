const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const { categories, findGuides, findCases, getGuide } = require('../miniprogram/data/guides')
const tutorials = require('../miniprogram/data/tutorials')
const config = require('../miniprogram/app.json')
const { detailPath, guideIdFromOptions } = require('../miniprogram/utils/links')
const { readBookmarks } = require('../miniprogram/utils/bookmarks')

const root = path.join(__dirname, '../miniprogram')
const app = { globalData: { libraryEntry: null } }
const ids = (guides) => guides.map(({ id }) => id)

function loadPage(name) {
  const modulePath = require.resolve(`../miniprogram/pages/${name}/index`)
  delete require.cache[modulePath]
  let page
  global.Page = (definition) => {
    page = definition
    page.setData = (patch) => {
      for (const [key, value] of Object.entries(patch)) {
        const [field, child] = key.split('.')
        if (child === undefined) page.data[field] = value
        else page.data[field][child] = value
      }
    }
  }
  require(modulePath)
  return page
}

test('教程内容的日期、图片与已公开入口有效', () => {
  const keys = new Set()
  const topicKeys = new Set(categories.map(({ id }) => id))

  for (const { id, category, time, updatedOn, steps, ...guide } of tutorials) {
    assert.match(id, /^[a-z0-9-]{1,32}$/)
    assert(!keys.has(id), `重复的教程 ID：${id}`)
    keys.add(id)
    assert(topicKeys.has(category), `未定义的分类：${category}`)
    assert(Number.isInteger(time) && time > 0)
    assert.match(updatedOn, /^\d{4}-\d{2}-\d{2}$/)
    assert.equal(new Date(updatedOn).toISOString().slice(0, 10), updatedOn)
    for (const field of ['title', 'summary', 'outcome', 'prompt', 'check']) {
      assert(guide[field].trim(), `${id} 的 ${field} 为空`)
    }
    assert(steps.length > 0)
    assert.equal(new Set(steps.map(([title]) => title)).size, steps.length, `${id} 的步骤标题重复`)
    for (const [title, body, figure] of steps) {
      assert(title.trim() && body.trim())
      if (figure) {
        assert.match(figure.src, /^\/assets\/tutorials\/[a-z0-9-]+\.(png|jpe?g|webp)$/)
        assert(figure.alt.trim())
        assert(fs.statSync(path.join(root, figure.src.slice(1))).isFile())
      }
    }
    assert.equal(getGuide(guideIdFromOptions({ scene: id })).id, id)
  }

  const manual = fs.readFileSync(path.join(root, '../README.md'), 'utf8')
  const scenes = [...manual.matchAll(/^\| [^|]+ \| `([a-z0-9-]+)` \|$/gm)]
  assert(scenes.length > 0, 'README 应至少记录一个小程序码教程 ID')
  for (const [, scene] of scenes) {
    assert(keys.has(scene), `README 中的小程序码教程 ID 已失效：${scene}`)
  }
  for (const id of topicKeys) assert(findGuides(id).length > 0)
})

test('每个已注册页面都有可编译的入口文件和页面配置', () => {
  for (const page of config.pages) {
    assert(fs.existsSync(path.join(root, page + '.js')), `${page}.js 缺失`)
    assert(fs.existsSync(path.join(root, page + '.wxml')), `${page}.wxml 缺失`)
    const pageConfig = JSON.parse(fs.readFileSync(path.join(root, page + '.json'), 'utf8'))
    assert(pageConfig && !Array.isArray(pageConfig) && typeof pageConfig === 'object')
  }
  for (const tab of config.tabBar.list) {
    assert(config.pages.includes(tab.pagePath))
    assert(fs.existsSync(path.join(root, tab.iconPath)))
    assert(fs.existsSync(path.join(root, tab.selectedIconPath)))
  }
})

test('搜索识别常见写法并与分类一起生效', () => {
  const cases = [
    ['Work Buddy', 'workbuddy-first'],
    ['ＣＯＤＥＸ', 'codex-first'],
    ['Grok-Bot', 'grok-bot'],
    ['AI短剧', ['comic-30s', 'drama-storyboard']],
    ['AI做网站', 'build-site'],
    ['英文 字幕', 'drama-en']
  ]
  for (const [query, expected] of cases) {
    assert.deepEqual(ids(findGuides('', query)), [].concat(expected), query)
  }
  assert.deepEqual(findGuides('fiction', 'Codex'), [])
  assert.deepEqual(ids(findGuides('fiction', '  ')), ['fiction-chapter'])
})

test('首页展示最新教程，入口打开指定分类或搜索', () => {
  global.getApp = () => app
  let lastTab
  global.wx = {
    switchTab: ({ url }) => { lastTab = url }
  }
  const home = loadPage('home')
  const library = loadPage('library')

  assert.deepEqual(ids(home.data.recent), ids(findCases().slice(0, 3)))
  assert.deepEqual(ids(home.data.creationTopics), ['drama', 'music', 'fiction', 'commerce', 'build', 'video'])
  const days = findGuides('').map(({ updatedOn }) => updatedOn)
  assert.deepEqual(days, [...days].sort().reverse())
  for (const topic of home.data.creationTopics) {
    assert(fs.existsSync(path.join(root, 'assets/actions', topic.icon + '.png')))
    home.openTopic({ currentTarget: { dataset: { category: topic.id } } })
    library.onShow()
    assert(library.data.guides.length > 0)
  }
  home.openTopic({ currentTarget: { dataset: { category: 'drama' } } })
  assert.equal(lastTab, '/pages/library/index')
  library.onShow()
  assert.deepEqual(ids(library.data.guides), ['comic-30s', 'drama-storyboard'])
  assert.equal(app.globalData.libraryEntry, null)

  home.search()
  library.onShow()
  assert.equal(library.data.focusSearch, true)
  library.updateQuery({ detail: { value: 'AI做网站' } })
  assert.deepEqual(ids(library.data.guides), ['build-site'])
  library.onHide()
  assert.equal(library.data.focusSearch, false)
  home.search()
  library.onShow()
  assert.equal(library.data.focusSearch, true)
  assert.equal(library.data.query, '')
})

test('实战案例具备封面、制作预算、流程入口与可复制的 SKILL.md', () => {
  let clipboard
  let scrollTarget
  global.wx = {
    setClipboardData: ({ data }) => { clipboard = data },
    pageScrollTo: ({ selector }) => { scrollTarget = selector }
  }
  const casesPage = loadPage('cases')
  const detail = loadPage('detail')
  assert.deepEqual(ids(casesPage.data.cases), ids(findCases()))
  assert.equal(casesPage.onShareAppMessage().path, '/pages/cases/index')
  assert(casesPage.data.cases.length >= 3)

  for (const { id, cover } of casesPage.data.cases) {
    assert(cover.alt.trim())
    assert(cover.credit.trim())
    assert(fs.statSync(path.join(root, cover.src.slice(1))).isFile())
    detail.onLoad({ scene: id })
    assert.equal(detail.data.showSkill, false)
    const { skill, tools, budget, evidence } = detail.data.guide.resources
    const [, nameLine, descriptionLine, endHeader] = skill.markdown.split('\n')
    assert.match(skill.id, /^[a-z0-9-]{1,63}$/)
    assert.equal(nameLine, `name: ${skill.id}`)
    assert.equal(JSON.parse(descriptionLine.slice('description: '.length)), skill.description)
    assert.equal(endHeader, '---')
    assert(tools.every((tool) => tool.name.trim() && tool.role.trim()))
    assert(evidence.trim())
    assert(budget.headline.trim() && budget.note.trim())
    assert(budget.items.every((item) => item.name.trim() && item.cost.trim()))
    detail.jumpToCaseSection({ currentTarget: { dataset: { section: 'case-budget' } } })
    assert.equal(scrollTarget, '#case-budget')
    detail.toggleSkill()
    assert.equal(detail.data.showSkill, true)
    detail.copySkill()
    assert.equal(clipboard, skill.markdown)
  }
})

test('详情扫码、分享、提示词、图片放大及同类返回', () => {
  global.getApp = () => app
  global.wx = {
    getStorageSync: () => [],
    switchTab: ({ url }) => assert.equal(url, '/pages/library/index'),
    setClipboardData: ({ data }) => assert.equal(data, getGuide('video-30s').prompt),
    previewImage: ({ current, urls, fail }) => {
      assert.equal(current, '/assets/tutorials/video-30s.png')
      assert.deepEqual(urls, [current])
      fail()
    }
  }
  const detail = loadPage('detail')
  detail.onLoad({ scene: 'video%2D30s' })
  detail.onShow()
  assert.equal(detail.data.guide.id, 'video-30s')
  assert.equal(detail.onShareAppMessage().path, detailPath('video-30s'))
  detail.copyPrompt()
  const source = detail.data.guide.steps[1].figure.src
  detail.previewFigure({ currentTarget: { dataset: { src: source } } })
  assert.equal(detail.data.enlargedFigure, source)
  detail.closeFigure()
  assert.equal(detail.data.enlargedFigure, '')
  detail.hideBrokenFigure({ currentTarget: { dataset: { index: 1 } } })
  assert.equal(detail.data.hiddenFigures[1], true)
  detail.browse()
  assert.equal(app.globalData.libraryEntry.category, 'video')
  detail.onLoad({ scene: 'broken%' })
  assert.equal(detail.data.guide, null)
  assert.equal(detail.onShareAppMessage().path, '/pages/home/index')
})

test('收藏兼容旧数据，并支持回到收藏页后移除条目', () => {
  let storage = ['codex-first', '', ' ', null, 'codex-first', 'removed-guide']
  global.wx = {
    getStorageSync: () => storage,
    setStorageSync: (_key, saved) => { storage = saved },
    showToast: ({ title }) => assert.equal(title, '暂时无法更新收藏')
  }
  assert.deepEqual(readBookmarks(), ['codex-first', 'removed-guide'])
  const detail = loadPage('detail')
  const saved = loadPage('saved')
  detail.onLoad({ id: 'codex-first' })
  detail.onShow()
  assert.equal(detail.data.bookmarked, true)
  saved.onShow()
  assert.deepEqual(ids(saved.data.guides), ['codex-first'])
  detail.changeBookmark()
  saved.onShow()
  assert.deepEqual(saved.data.guides, [])
  detail.changeBookmark()
  saved.onShow()
  assert.deepEqual(ids(saved.data.guides), ['codex-first'])

  global.wx.getStorageSync = () => { throw new Error('storage unavailable') }
  saved.onShow()
  assert.equal(saved.data.loadError, true)
  detail.changeBookmark()
  assert.equal(detail.data.bookmarked, true)
})

test('漫剧逐镜浏览、作品入口绑定和未发布状态', () => {
  const detail = loadPage('detail')
  const comic = getGuide('comic-30s')
  const original = comic.resources.channelsVideo
  let opened
  global.wx = { openChannelsActivity: (args) => { opened = args } }
  const click = (step) => detail.moveFrame({ currentTarget: { dataset: { step } } })
  try {
    comic.resources.channelsVideo = null
    detail.onLoad({ id: comic.id })
    detail.openCaseVideo()
    assert.equal(opened, undefined)
    const frames = comic.resources.frames
    assert.equal(frames.length, 6)
    assert.equal(new Set(frames.map((frame) => frame.src)).size, 6)
    for (const frame of frames) {
      assert(fs.statSync(path.join(root, frame.src.slice(1))).size > 0)
      assert(frame.time && frame.caption)
    }
    click(-1)
    assert.equal(detail.data.frameIndex, 0)
    for (let i = 0; i < 6; i++) click(1)
    assert.equal(detail.data.frameIndex, 5)
    click(-1)
    assert.equal(detail.data.frameIndex, 4)
    comic.resources.channelsVideo = { finderUserName: 'sample', feedId: '' }
    detail.onLoad({ id: comic.id })
    assert.equal(detail.data.channelsVideo, null)
    comic.resources.channelsVideo = { finderUserName: 'sample', feedId: '10000000000000001' }
    detail.onLoad({ id: comic.id })
    assert.equal(detail.data.frameIndex, 0)
    detail.openCaseVideo()
    assert.equal(opened.finderUserName, 'sample')
    assert.equal(opened.feedId, '10000000000000001')
    detail.onLoad({ id: 'music-first-song' })
    assert.equal(detail.data.channelsVideo, null)
    assert.equal(detail.data.guide.resources.lyrics.length, 4)
  } finally { comic.resources.channelsVideo = original }
})
