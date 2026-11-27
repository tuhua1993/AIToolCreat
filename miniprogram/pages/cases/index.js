const { findCases } = require('../../data/guides')
const { CASES } = require('../../utils/links')

Page({
  data: {
    cases: findCases()
  },

  onShareAppMessage() {
    return { title: '创作玩家｜AI 实战案例', path: CASES }
  }
})
