const guides = require('./tutorials')

const categories = [
  { id: 'tools', name: 'AI 工具', subtitle: 'WorkBuddy · 豆包 · Grok', icon: 'spark', tone: 'lime' },
  { id: 'code', name: 'AI 编程', subtitle: 'Codex 实战', icon: 'code', tone: 'violet' },
  { id: 'drama', name: 'AI 短剧', subtitle: '剧本与分镜', icon: 'drama', tone: 'rose' },
  { id: 'video', name: 'AI 短视频', subtitle: '选题、口播与剪辑', icon: 'play', tone: 'cyan' },
  { id: 'overseas', name: '短剧出海', subtitle: '本地化与英文字幕', icon: 'globe', tone: 'cyan' },
  { id: 'music', name: 'AI 音乐', subtitle: '写歌与配乐', icon: 'music', tone: 'rose' },
  { id: 'fiction', name: 'AI 小说', subtitle: '人设、情节与章节', icon: 'book', tone: 'violet' },
  { id: 'build', name: '网站·软件·App', subtitle: '把想法做成产品', icon: 'build', tone: 'lime' }
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
