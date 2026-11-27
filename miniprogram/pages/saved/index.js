const { getGuide, getCard } = require('../../data/guides')
const { readBookmarks } = require('../../utils/bookmarks')
const { openLibrary } = require('../../utils/links')

Page({
  data: { guides: [], loadError: false },

  onShow() {
    try {
      const guides = readBookmarks().map(getGuide).filter(Boolean).map(getCard)
      this.setData({ guides, loadError: false })
    } catch {
      this.setData({ guides: [], loadError: true })
    }
  },

  browse() {
    openLibrary('')
  }
})
