const HOME = '/pages/home/index'
const LIBRARY = '/pages/library/index'
const CASES = '/pages/cases/index'
const DETAIL = '/pages/detail/index'

function detailPath(id) {
  return `${DETAIL}?id=${encodeURIComponent(id)}`
}

function openLibrary(category, focus = false) {
  const app = getApp()
  app.globalData.libraryEntry = { category, focus }
  wx.switchTab({
    url: LIBRARY,
    fail() {
      app.globalData.libraryEntry = null
    }
  })
}

function guideIdFromOptions(options = {}) {
  if (options.id) return options.id
  if (typeof options.scene !== 'string') return ''

  try {
    return decodeURIComponent(options.scene)
  } catch {
    return ''
  }
}

module.exports = { HOME, LIBRARY, CASES, detailPath, openLibrary, guideIdFromOptions }
