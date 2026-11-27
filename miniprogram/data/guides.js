const guides = require('./tutorials')

const categories = [
  { id: 'tools', name: 'AI 工具', icon: 'spark', tone: 'blue' },
  { id: 'code', name: 'AI 编程', icon: 'code', tone: 'lilac' },
  { id: 'drama', name: 'AI 短剧', icon: 'drama', tone: 'peach' },
  { id: 'video', name: 'AI 短视频', icon: 'play', tone: 'teal' },
  { id: 'overseas', name: '短剧出海', icon: 'globe', tone: 'teal' },
  { id: 'music', name: 'AI 音乐', icon: 'music', tone: 'peach' },
  { id: 'fiction', name: 'AI 小说', icon: 'book', tone: 'lilac' },
  { id: 'build', name: '网站·软件·App', icon: 'build', tone: 'blue' }
]

const categoryMap = new Map(categories.map((item) => [item.id, item]))
const catalog = guides.slice().sort((a, b) => b.updatedOn.localeCompare(a.updatedOn)).map((guide) => ({
  ...guide,
  topic: categoryMap.get(guide.category),
  steps: guide.steps.map(([title, body, figure]) => ({ title, body, figure: figure || null }))
}))
const guideMap = new Map(catalog.map((item) => [item.id, item]))
const searchable = catalog.map((guide) => ({
  guide,
  fields: [guide.title, guide.summary, guide.topic.name, ...(guide.keywords || [])]
    .map((field) => searchTerms(field).join(''))
}))

function searchTerms(value) {
  return value.normalize('NFKC').toLowerCase().match(/[a-z0-9]+|[\u3400-\u9fff]+/g) || []
}

function getGuide(id) {
  return guideMap.get(id) || null
}

function getCard(guide) {
  const { id, title, summary, time, topic, updatedOn } = guide
  return { id, title, summary, time, topic, updatedOn }
}

function findGuides(category, query = '') {
  const terms = searchTerms(query)
  return searchable.filter(({ guide, fields }) => {
    if (category && guide.category !== category) return false
    return terms.every((term) => fields.some((field) => field.includes(term)))
  }).map(({ guide }) => getCard(guide))
}

module.exports = { categories, getGuide, getCard, findGuides }
