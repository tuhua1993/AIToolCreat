const { categories, findGuides } = require('../../data/guides')
const { LIBRARY } = require('../../utils/links')

Page({
  data: {
    categories: [{ id: '', name: '全部' }, ...categories],
    category: '',
    query: '',
    focusSearch: false,
    pdfOnly: false,
    guides: findGuides('')
  },

  onShow() {
    const app = getApp()
    const entry = app.globalData.libraryEntry
    if (!entry) return

    app.globalData.libraryEntry = null
    this.updateResults(entry.category, '', { focusSearch: entry.focus, pdfOnly: false })
  },

  onHide() {
    this.onSearchBlur()
  },

  updateResults(category, query, options = {}) {
    const pdfOnly = options.pdfOnly ?? this.data.pdfOnly
    this.setData({ category, query, guides: findGuides(category, query, pdfOnly), ...options })
  },

  selectFormat(event) {
    const pdfOnly = event.currentTarget.dataset.format === 'pdf'
    this.updateResults(this.data.category, this.data.query, { pdfOnly, focusSearch: false })
  },

  selectCategory(event) {
    this.updateResults(event.currentTarget.dataset.category, this.data.query, { focusSearch: false })
  },

  updateQuery(event) {
    this.updateResults(this.data.category, event.detail.value)
  },

  clearQuery() {
    this.updateResults(this.data.category, '')
  },

  clearFilters() {
    this.updateResults('', '', { pdfOnly: false })
  },

  onSearchBlur() {
    if (this.data.focusSearch) this.setData({ focusSearch: false })
  },

  onShareAppMessage() {
    return { title: '创作玩家｜AI 图文教程库', path: LIBRARY }
  }
})
