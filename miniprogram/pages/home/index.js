const { categories, findCases, coverNoteFor } = require('../../data/guides')
const { HOME, openLibrary } = require('../../utils/links')

const creationOrder = ['drama', 'music', 'fiction', 'commerce', 'build', 'video']
const recent = findCases().slice(0, 3)

Page({
  data: {
    creationTopics: creationOrder.map((id) => categories.find((topic) => topic.id === id)),
    recent,
    coverNote: coverNoteFor(recent)
  },

  search() { openLibrary('', true) },

  openTopic(event) {
    openLibrary(event.currentTarget.dataset.category)
  },

  onShareAppMessage() {
    return { title: '创作玩家｜今天你想用AI做什么？', path: HOME }
  }
})
