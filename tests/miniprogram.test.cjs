const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const { categories, findGuides, getGuide } = require('../miniprogram/data/guides')
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
})

test('搜索识别常见写法并与分类一起生效', () => {
  const cases = [
    ['Work Buddy', 'workbuddy-first'],
    ['ＣＯＤＥＸ', 'codex-first'],
    ['Grok-Bot', 'grok-bot'],
    ['AI短剧', 'drama-storyboard'],
    ['AI做网站', 'build-site'],
    ['英文 字幕', 'drama-en']
  ]
  for (const [query, id] of cases) {
    assert.deepEqual(ids(findGuides('', query)), [id], query)
  }
  assert.deepEqual(findGuides('fiction', 'Codex'), [])
  assert.deepEqual(ids(findGuides('fiction', '  ')), ['fiction-chapter'])
})

test('首页展示最新教程，入口打开指定分类或搜索', () => {
  global.getApp = () => app
  global.wx = { switchTab: ({ url }) => assert.equal(url, '/pages/library/index') }
  const home = loadPage('home')
  const library = loadPage('library')

  assert.deepEqual(ids(home.data.recent), ids(findGuides('').slice(0, 3)))
  const days = findGuides('').map(({ updatedOn }) => updatedOn)
  assert.deepEqual(days, [...days].sort().reverse())
  assert.equal(home.data.startPath, detailPath('workbuddy-first'))
  home.openTopic({ currentTarget: { dataset: { category: 'drama' } } })
  library.onShow()
  assert.deepEqual(ids(library.data.guides), ['drama-storyboard'])
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
