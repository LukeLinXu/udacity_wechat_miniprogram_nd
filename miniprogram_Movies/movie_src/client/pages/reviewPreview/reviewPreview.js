// pages/reviewPreview/reviewPreview.js
const NOTPLAYING = 0
const PLAYING = 1
const innerAudioContext = wx.createInnerAudioContext()
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      audioStatusText:['播放', '停止'],
      movie: null,
      type: 0,
      comment: null,
      audioStatus: NOTPLAYING, // 音频播放状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options)
      console.log(decodeURIComponent(options.dataObj))
      let dataObj = JSON.parse(decodeURIComponent(options.dataObj))
      this.setData({
          movie: dataObj.movie,
          type: dataObj.type,
          comment: dataObj.comment,
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

    updateDB(content, duration, movie_id) {
        wx.showLoading({
            title: '正在发布影评'
        })
        qcloud.request({
            url: config.service.addReview,
            data: {
                content: content,
                duration: duration,
                movie_id: movie_id
            },
            method: 'POST',
            success: result => {
                wx.hideLoading();
                if (!result.data.code) {
                    wx.showToast({
                        title: '发布影评成功'
                    })
                    setTimeout(() => {
                        wx.redirectTo({
                            url: '/pages/reviewList/reviewList?movie_id=' + movie_id
                        })
                    }, 1500)
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '发布影评失败'
                    })
                }
            },
            fail: error => {
                console.log(error)
                wx.hideLoading();
                wx.showToast({
                    icon: 'none',
                    title: '发布影评失败'
                })
            }
        })
    },

    uploadMp3(callback) {
        let url = this.data.comment.content;
        wx.uploadFile({
            url: config.service.uploadUrl,
            filePath: url,
            name: 'file',
            header: {
                'content-type': 'multipart/form-data'
            },
            success: res => {
                console.log(res)
                let content = res.data.imgUrl;
                callback && callback(content)
            },
            fail: error => {
                console.log(error)
            }
        })
    },

    onPublishClick() {
        console.log("sendComment Start")
        let movieId = this.data.movie.id;
        let comment = this.data.comment.content;
        let duration = this.data.comment.duration;
        console.log("updateDB data prep")
        if (this.data.type === 0) {
            console.log("updateDB Start")
            this.updateDB(comment, duration, movieId)
        } else if (this.data.type === 1) {
            this.uploadMp3((content) => {
                this.updateDB(content, duration, movieId)
            })
        }
    },

    onCancelClick() {
        wx.navigateBack({
            delta: 1
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
        this.setAudioOptions()
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