const { getGuide } = require('../../data/guides')
const { readBookmarks, toggleBookmark } = require('../../utils/bookmarks')
const { HOME, detailPath, openLibrary, guideIdFromOptions } = require('../../utils/links')

Page({
  data: {
    guide: null,
    bookmarked: false
  },

  onLoad(options) {
    const guide = getGuide(guideIdFromOptions(options))
    this.setData({ guide })
    if (guide) this.refreshBookmark()
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

  browse() {
    openLibrary('')
  },

  onShareAppMessage() {
    const { guide } = this.data
    return guide
      ? { title: `${guide.title} · 创作玩家`, path: detailPath(guide.id) }
      : { title: '创作玩家', path: HOME }
  }
})
