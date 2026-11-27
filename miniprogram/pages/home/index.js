const { categories, getGuide, getCard } = require('../../data/guides')
const { HOME, detailPath, openLibrary } = require('../../utils/links')

Page({
  data: {
    categories,
    featured: ['workbuddy-first', 'codex-first', 'video-30s'].map((id) => getCard(getGuide(id))),
    startPath: detailPath('workbuddy-first')
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
    return { title: '创作星球｜我的 AI 创作教程', path: HOME, imageUrl: '/assets/planet-hero.jpg' }
  }
})
