const util = require('../../utils/util.js')

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
        var temp = res.data.result
        for(var i = 0; i<temp.length; i++){
          var item = temp[i]
          item.date = util.formatTime(new Date(item.date))
          if(item.firstImage == null){
            item.firstImage = '/images/image_load_fail.png'
          }
          if (item.source == null) {
            item.source = ''
          }
        }
        this.setData({
            newsList: temp
        })
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  onTapType:function(event){
    let id = event.currentTarget.dataset.id
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
  },

  onImageLoadFail: function (event) {
    console.log(event)
    var index = event.currentTarget.dataset.index
    console.log(index)
    var temp = this.data.newsList
    console.log(temp)
    temp[index].firstImage = "/images/image_load_fail.png"
    
    this.setData({
      newsList: temp
    })
  },

})
