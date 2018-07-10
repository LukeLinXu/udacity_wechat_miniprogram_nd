// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    resultInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.news_id
    })
    this.getNewsById()
  },

  onPullDownRefresh: function () {
    this.getNewsById(() => {
      wx.stopPullDownRefresh()
    })
  },

  getNewsById(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: this.data.id
      },
      success: res => {
        console.log(res.data)
        this.setData({
          resultInfo: res.data.result
        })
      },
      complete: () => {
        callback && callback()
      }
    })
  },
})