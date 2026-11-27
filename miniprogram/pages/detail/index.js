const { getGuide } = require('../../data/guides')
const { readBookmarks, toggleBookmark } = require('../../utils/bookmarks')
const { HOME, detailPath, openLibrary, guideIdFromOptions } = require('../../utils/links')

Page({
  data: {
    guide: null,
    bookmarked: false,
    hiddenFigures: {},
    enlargedFigure: ''
  },

  onLoad(options) {
    const guide = getGuide(guideIdFromOptions(options))
    this.setData({ guide, hiddenFigures: {}, enlargedFigure: '' })
  },

  onShow() {
    if (this.data.guide) this.refreshBookmark()
  },

  refreshBookmark() {
    try {
      this.setData({ bookmarked: readBookmarks().includes(this.data.guide.id) })
    } catch {
      this.setData({ bookmarked: false })
    }
  },

  changeBookmark() {
    const { guide } = this.data
    if (!guide) return
    try {
      this.setData({ bookmarked: toggleBookmark(guide.id) })
    } catch {
      wx.showToast({ title: '暂时无法更新收藏', icon: 'none' })
    }
  },

  copyPrompt() {
    const { guide } = this.data
    if (!guide) return
    wx.setClipboardData({
      data: guide.prompt,
      fail() {
        wx.showToast({ title: '复制失败，可长按文字选取', icon: 'none' })
      }
    })
  },

  previewFigure(event) {
    const { src } = event.currentTarget.dataset
    wx.previewImage({
      current: src,
      urls: [src],
      showmenu: false,
      fail: () => this.setData({ enlargedFigure: src })
    })
  },

  closeFigure() {
    this.setData({ enlargedFigure: '' })
  },

  hideBrokenFigure(event) {
    const { index } = event.currentTarget.dataset
    this.setData({ [`hiddenFigures.${index}`]: true })
  },

  browse() {
    openLibrary(this.data.guide ? this.data.guide.category : '')
  },

  onShareAppMessage() {
    const { guide } = this.data
    return guide
      ? { title: `${guide.title} · 创作玩家`, path: detailPath(guide.id) }
      : { title: '创作玩家', path: HOME }
  }
})
