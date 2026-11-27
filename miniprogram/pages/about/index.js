const { HOME, openLibrary } = require('../../utils/links')

Page({
  browse() {
    openLibrary('')
  },

  onShareAppMessage() {
    return { title: '创作玩家｜我的 AI 创作教程', path: HOME, imageUrl: '/assets/planet-hero.jpg' }
  }
})
