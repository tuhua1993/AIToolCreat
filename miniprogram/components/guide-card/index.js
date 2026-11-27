const { detailPath } = require('../../utils/links')

Component({
  properties: {
    guide: {
      type: Object,
      value: null,
      observer(guide) {
        this.setData({ url: guide ? detailPath(guide.id) : '' })
      }
    }
  },
  data: { url: '' }
})
