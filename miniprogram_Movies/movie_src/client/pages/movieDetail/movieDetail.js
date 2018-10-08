// pages/movieDetail/movieDetail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    movie: null,
    reviewedId: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.movie_id
    })
  },

  getMovieDetail() {
    wx.showLoading({
      title: '电影数据加载中',
    })
    qcloud.request({
      url: config.service.getMovieDetail+this.data.id,
      success: result => {
        wx.hideLoading()
          console.log(result)
        if (!result.data.code) {
          this.setData({
            movie: result.data.data,
              reviewedId: result.data.data.reviewedId
          })
        } else {
          wx.showToast({
            title: '电影数据加载失败',
          })
        }
      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '电影数据加载失败',
        })
      }
    })
  },

  onTapMovieComments: function (event){
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/reviewList/reviewList?movie_id=' + id,
    })
  },

    openCommentOptions(e){
      if(this.data.reviewedId == -1){
          let movie = JSON.stringify(this.data.movie)
          wx.showActionSheet({
              itemList: ['文字', '音频'],
              itemColor: '#007aff',
              success(res) {
                  if (res.tapIndex === 0) {
                      wx.navigateTo({
                          url: '/pages/reviewEdit/reviewEdit?type_id=0&movie=' + movie + '&type_id=0'
                      })
                  } else if (res.tapIndex === 1) {
                      wx.navigateTo({
                          url: '/pages/reviewEdit/reviewEdit?type_id=1&movie=' + movie + '&type_id=1'
                      })
                  }
              }
          })
      }else{
          wx.navigateTo({
              url: '/pages/reviewDetail/reviewDetail?comment_id=' + this.data.reviewedId,
          })
      }

    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      if(app.getUserInfo()){
          this.getMovieDetail()
      }else {
          wx.navigateTo({
              url: '/pages/login/login'
          })
      }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})