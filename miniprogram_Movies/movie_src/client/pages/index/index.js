// pages/index/index.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRandomComment()
  },

  getRandomComment(callback) {
    wx.showLoading({
            title: '评论数据加载中',
    })
    qcloud.request({
        url: config.service.getRandomComment,
        success: result => {
            wx.hideLoading()
            if (!result.data.code) {
                this.setData({
                    comment: result.data.data
                })
            } else {
                wx.showToast({
                    title: '商品数据加载失败',
                })
            }
        },
        fail: result => {
            wx.hideLoading()
            wx.showToast({
                title: '评论数据加载失败',
            })
        },
        complete: () => {
            callback && callback()
        }
    })
  },

  onTapMovieList: function(){
    wx.navigateTo({
      url: '/pages/movieList/movieList',
    })
  },

    onTapLogin: function(){
        wx.navigateTo({
            url: '/pages/myReviews/myReviews',
        })
    },

  onTapAvatar: function (event){
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/reviewDetail/reviewDetail?comment_id=' + id,
    })
  },

  onTapMovie: function (event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/movieDetail/movieDetail?movie_id=' + id,
    })
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
      this.getRandomComment(() => {
          wx.stopPullDownRefresh();
      })
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