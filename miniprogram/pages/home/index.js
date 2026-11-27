const { categories, findCases } = require('../../data/guides')
const { HOME, CASES, openLibrary } = require('../../utils/links')

const creationOrder = ['drama', 'music', 'fiction', 'video', 'build', 'overseas']
const creationTopics = creationOrder.map((id) => categories.find((topic) => topic.id === id))

function mastheadMetrics() {
  const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
  const statusBar = windowInfo.statusBarHeight || 0
  const menu = wx.getMenuButtonBoundingClientRect() || {}
  const menuInset = menu.top - statusBar
  const menuFits = menu.height > 0 && menuInset >= 0 && menuInset < 24
  return {
    statusBar,
    menuHeight: menuFits ? menu.height + menuInset * 2 : 44
  }
}

Page({
  data: {
    creationTopics,
    recent: findCases().slice(0, 3),
    statusBar: 20,
    menuHeight: 44
  },

  onLoad() {
    if (wx.getMenuButtonBoundingClientRect) this.setData(mastheadMetrics())
  },

  openCases() {
    wx.switchTab({ url: CASES })
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
