// Only free samples belong in the client package.
const sources = {
  'mountain-letter-sample': () => require('../../data/samples/mountain-letter-sample')
}

Component({
  properties: {
    sample: { type: Object, value: null },
    cover: String
  },
  data: { opening: false },
  methods: {
    openSample() {
      if (this.data.opening || !this.data.sample) return
      const { id } = this.data.sample
      const load = sources[id]
      if (typeof load !== 'function') return
      const filePath = wx.env.USER_DATA_PATH + '/' + id + '.pdf'
      this.setData({ opening: true })
      const fail = () => {
        this.setData({ opening: false })
        wx.showToast({ title: '手册暂时打不开，请重试', icon: 'none' })
      }
      try {
        wx.getFileSystemManager().writeFile({
          filePath,
          data: load(),
          encoding: 'base64',
          fail,
          success: () => wx.openDocument({
            filePath, fileType: 'pdf', showMenu: true,
            success: () => this.setData({ opening: false }),
            fail
          })
        })
      } catch {
        fail()
      }
    }
  }
})
