

Page({
  data: {
    type: 'gn',
    newsList: [],
    typeMap : {
      'gn': '国内',
      'gj': '国际',
      'cj': '财经',
      'yl': '娱乐',
      'js': '军事',
      'ty': '体育',
      'other': '其他'
    }
  },
  onLoad() {
    this.getNews()
  },
  onPullDownRefresh() {
    this.getNews(() => {
      wx.stopPullDownRefresh()
    })
  },

  getNews(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: this.data.type
      },
      success: res => {
        console.log(res.data)
        this.setData({
            newsList: res.data.result
        })
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  onTapType:function(event){
    let id = event.target.dataset.id
    this.setData({
      type: id
    })
    this.getNews()
  },

  onTapNew: function (event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?news_id=' + id,
    })
  }
})
