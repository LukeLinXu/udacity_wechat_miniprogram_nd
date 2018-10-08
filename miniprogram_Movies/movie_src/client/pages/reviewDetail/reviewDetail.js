// pages/reviewDetail/reviewDetail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const app = getApp()
const NOTPLAYING = 0
const PLAYING = 1
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      audioStatusText:['播放', '停止'],
      id: '',
      comment: null,
      isLiked: false,
      reviewedId: -1,
      type: 0,
      audioStatus: NOTPLAYING,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          id: options.comment_id
      })
  },

    getReviewDetail() {
      wx.showLoading({
          title: '评论数据加载中',
      })
      qcloud.request({
          url: config.service.getReviewDetail+this.data.id,
          success: result => {
              wx.hideLoading()
              console.log(result)
              if (!result.data.code) {
                  this.setData({
                      comment: result.data.data,
                      isLiked: result.data.data.isLiked,
                      reviewedId: result.data.data.movie.reviewedId,
                      type: (result.data.data.duration == null || result.data.data.duration == 0)? 0: 1
                  })
                  console.log(this.data.type)
                  if(this.data.type == 1){
                      innerAudioContext.src = this.data.comment.content
                      this.setAudioOptions()
                  }
              } else {
                  wx.showToast({
                      title: '评论数据加载失败',
                  })
              }
          },
          fail: result => {
              wx.hideLoading()
              wx.showToast({
                  title: '评论数据加载失败',
              })
          }
      })
  },

  openCommentOptions(e){
      if(this.data.reviewedId == -1){
          let movie = JSON.stringify(this.data.comment.movie)
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
      }else if(this.data.reviewedId != this.data.comment.id){
          wx.navigateTo({
              url: '/pages/reviewDetail/reviewDetail?comment_id=' + this.data.reviewedId,
          })
      }

  },

    onClickLikeButton(e){
      this.ProcessLikeStatus(this.data.id, !this.data.isLiked)
    },

    ProcessLikeStatus(commentId, add){
        wx.showLoading({
            title: 'processing like status',
        })
        qcloud.request({
            url: config.service.updateUserLikes,
            data: {
                commentId: commentId,
                add: add
            },
            method: 'POST',
            success: result => {
                wx.hideLoading()
                console.log(result)
                if (!result.data.code) {
                    this.setData({
                        isLiked: add
                    })
                } else {
                    wx.showToast({
                        title: '失败',
                    })
                }
            },
            fail: result => {
                wx.hideLoading()
                wx.showToast({
                    title: '失败',
                })
            }
        })
    },

    onTapAudio() {
        if (this.data.audioStatus === NOTPLAYING) {
            innerAudioContext.play()
        } else if (this.data.audioStatus === PLAYING) {
            innerAudioContext.pause()
        }
    },

    setAudioOptions() {
        innerAudioContext.onPlay(() => {
            this.setData({
                audioStatus: PLAYING
            })
        })
        innerAudioContext.onPause(() => {
            this.setData({
                audioStatus: NOTPLAYING
            })
        })
        innerAudioContext.onStop(() => {
            this.setData({
                audioStatus: NOTPLAYING
            })
        })
        innerAudioContext.onEnded(() => {
            this.setData({
                audioStatus: NOTPLAYING
            })
        })
        innerAudioContext.onError(error => {
            console.log(error)
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
        this.getReviewDetail()
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