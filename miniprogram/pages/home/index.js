const { categories, findGuides, getGuide } = require('../../data/guides')
const { HOME, detailPath, openLibrary } = require('../../utils/links')
const starter = getGuide('build-site')

Page({
  data: {
    categories,
    recent: findGuides('').slice(0, 3),
    startPath: detailPath(starter.id),
    recommendation: starter.title
  },

  browse() {
    openLibrary('')
  },

  search() {
    openLibrary('', true)
  },

  openTopic(event) {
    openLibrary(event.currentTarget.dataset.category)
  },

  onShareAppMessage() {
    return { title: '创作玩家｜我的 AI 创作教程', path: HOME }
  }
})
