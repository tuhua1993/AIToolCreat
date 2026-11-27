const STORAGE_KEY = 'creator-planet-bookmarks'

function readBookmarks() {
  const saved = wx.getStorageSync(STORAGE_KEY)
  return Array.isArray(saved)
    ? [...new Set(saved.filter((id) => typeof id === 'string' && id.trim()))]
    : []
}

function toggleBookmark(id) {
  const saved = readBookmarks()
  const willSave = !saved.includes(id)
  const next = willSave ? [id, ...saved] : saved.filter((item) => item !== id)
  wx.setStorageSync(STORAGE_KEY, next)
  return willSave
}

module.exports = { readBookmarks, toggleBookmark }
