const guides = require('./tutorials')
const caseResources = require('./case-resources')

const categories = [
  { id: 'tools', name: 'AI 工具', icon: 'spark', tone: 'blue' },
  { id: 'code', name: 'AI 编程', icon: 'code', tone: 'lilac' },
  { id: 'drama', name: 'AI 短剧', action: '做短剧', icon: 'drama', tone: 'peach' },
  { id: 'video', name: 'AI 短视频', action: '做自媒体', icon: 'play', tone: 'teal' },
  { id: 'overseas', name: '短剧出海', action: '做出海字幕', icon: 'globe', tone: 'teal' },
  { id: 'music', name: 'AI 音乐', action: '做音乐', icon: 'music', tone: 'peach' },
  { id: 'fiction', name: 'AI 小说', action: '写小说', icon: 'book', tone: 'lilac' },
  { id: 'commerce', name: '电商内容', action: '做电商', icon: 'bag', tone: 'lilac' },
  { id: 'build', name: '网站·软件·App', action: '做网站', icon: 'build', tone: 'blue' }
]

const categoryMap = new Map(categories.map((item) => [item.id, item]))
const catalog = guides.slice().sort((a, b) => b.updatedOn.localeCompare(a.updatedOn)).map((guide) => ({
  ...guide,
  resources: caseResources[guide.id] || null,
  topic: categoryMap.get(guide.category),
  steps: guide.steps.map(([title, body, figure]) => ({ title, body, figure: figure || null }))
}))
const guideMap = new Map(catalog.map((item) => [item.id, item]))
const searchable = catalog.map((guide) => ({
  guide,
  fields: [guide.title, guide.summary, guide.topic.name, ...(guide.sample ? ['PDF 手册 试读', guide.sample.title, guide.sample.description] : []), ...(guide.keywords || [])]
    .map((field) => searchTerms(field).join(''))
}))

function searchTerms(value) {
  return value.normalize('NFKC').toLowerCase().match(/[a-z0-9]+|[\u3400-\u9fff]+/g) || []
}

function getGuide(id) {
  return guideMap.get(id) || null
}

function getCard(guide) {
  const { id, title, summary, time, topic, updatedOn, cover, caseNote, sample } = guide
  return { id, title, summary, time, topic, updatedOn, cover: cover || null, caseNote: caseNote || '', sample: sample || null }
}

function findGuides(category, query = '', pdfOnly = false) {
  const terms = searchTerms(query)
  return searchable.filter(({ guide, fields }) => {
    if (pdfOnly && !guide.sample) return false
    if (category && guide.category !== category) return false
    return terms.every((term) => fields.some((field) => field.includes(term)))
  }).map(({ guide }) => getCard(guide))
}

function findCases() {
  return catalog.filter((guide) => guide.resources).map(getCard)
}

function coverNoteFor(cards) {
  const labels = cards.filter((card) => card.cover && card.cover.generatedLabel).map((card) => card.cover.generatedLabel)
  return labels.length ? labels.join('、') + '由 AI 生成。' : ''
}

module.exports = { categories, getGuide, getCard, findGuides, findCases, coverNoteFor }
