const { findCases, coverNoteFor } = require('../../data/guides')
const { CASES } = require('../../utils/links')
const cases = findCases()

Page({
  data: { cases, coverNote: coverNoteFor(cases) },
  onShareAppMessage() {
    return { title: '创作玩家｜AI 实战案例', path: CASES }
  }
})
