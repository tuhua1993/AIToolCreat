const { detailPath } = require('../../utils/links')

Component({
  properties: {
    guide: {
      type: Object,
      value: null,
      observer(guide) {
        this.setData({ url: guide ? detailPath(guide.id) : '' })
      }
    },
    showDate: { type: Boolean, value: false },
    illustrated: { type: Boolean, value: false },
    featured: { type: Boolean, value: false }
  },
  data: { url: '' }
})
