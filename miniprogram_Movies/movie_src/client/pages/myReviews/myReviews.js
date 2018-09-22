// pages/myReviews/myReviews.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      reviewsList: [],
      myReviewsList: [],
      LikeReviewsList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

    getLikesList(callback) {
        wx.showLoading({
            title: '电影数据加载中',
        })
        qcloud.request({
            url: config.service.getUserDetail,
            success: result => {
                wx.hideLoading()
                if (!result.data.code) {
                    this.setData({
                        LikeReviewsList: result.data.data.likesDetail
                    })
                    console.log(result)
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
            },
            complete: () => {
                callback && callback()
            }
        })
    },

    getMyCommentsList(callback) {
        wx.showLoading({
            title: '电影数据加载中',
        })
        qcloud.request({
            url: config.service.getReviewListByUserId,
            success: result => {
                wx.hideLoading()
                if (!result.data.code) {
                    console.log(result)
                    this.setData({
                        myReviewsList: result.data.data,
                        reviewsList: result.data.data
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
            },
            complete: () => {
                callback && callback()
            }
        })
    },

    onBackClick(){
        wx.navigateBack({
            delta: 1
        })
    },

    onMyReviewClick(){
        this.setData({
            reviewsList: this.data.myReviewsList
        })
    },

    onMyLikeClick(){
        this.setData({
            reviewsList: this.data.LikeReviewsList
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
      if(app.getUserInfo()){
          this.getLikesList()
          this.getMyCommentsList()
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
      this.getLikesList()
      this.getMyCommentsList(() => {
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