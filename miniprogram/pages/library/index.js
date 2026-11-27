const { categories, findGuides } = require('../../data/guides')
const { LIBRARY } = require('../../utils/links')

Page({
  data: {
    categories: [{ id: '', name: '全部' }, ...categories],
    category: '',
    query: '',
    focusSearch: false,
    guides: findGuides('')
  },

  onShow() {
    const app = getApp()
    const entry = app.globalData.libraryEntry
    if (!entry) return

    app.globalData.libraryEntry = null
    this.updateResults(entry.category, '')
    this.setData({ focusSearch: entry.focus })
  },

  updateResults(category, query) {
    this.setData({ category, query, guides: findGuides(category, query) })
  },

  selectCategory(event) {
    this.updateResults(event.currentTarget.dataset.category, this.data.query)
  },

  updateQuery(event) {
    this.updateResults(this.data.category, event.detail.value)
  },

  clearQuery() {
    this.updateResults(this.data.category, '')
  },

  clearFilters() {
    this.updateResults('', '')
  },

  onSearchBlur() {
    if (this.data.focusSearch) this.setData({ focusSearch: false })
  },

  onShareAppMessage() {
    return { title: '创作玩家｜AI 图文教程库', path: LIBRARY }
  }
})
